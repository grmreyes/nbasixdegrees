const express = require('express')
const app = express()
const path = require('path')
// const fetch = require('node-fetch')
const PORT = process.env.PORT || 8000; // process.env accesses heroku's environment variables
const keys = PORT === 8000 ? require('./config/keys') : null

const actors = require('./assets/smol_actors.json');
const movies = require('./assets/smol_movies.json');
// console.log(Object.keys(actors).length + " actors")
// console.log(Object.keys(movies).length + " movies")

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
  return true
})

app.get('/actors/:actorId', (req, res) => {
  let id = req.params.actorId
  let actor = actors[id]
  res.send(actor)
  return true
});

app.get('/actorsbymovie/:movieId', (req, res) => {
  let movId = req.params.movieId
  let movie = movies[movId]
  let ids = movie.actor_ids
  let actorsByMovie = {}
  ids.forEach(id => actorsByMovie[id] = actors[id])
  res.send(actorsByMovie)
  return true
});

app.get('/newgame/:act1/:act2', (req, res) => {
  let id1 = req.params.act1
  let id2 = req.params.act2
  let actor1 = actors[id1]
  let actor2 = actors[id2]
  res.send([actor1, actor2])
  return true
});

app.get('/movies/:movieId', (req, res) => {
  let id = req.params.movieId
  let movie = movies[id]
  res.send(movie)
  return true
});

app.get('/moviesbyactor/:actorId', (req, res) => {
  let actId = req.params.actorId
  let actor = actors[actId]
  let ids = actor.movie_ids
  let moviesByActor = {}
  ids.forEach(id => moviesByActor[id] = movies[id])
  res.send(moviesByActor)
  return true
});

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i)
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

const A2M = (q, thisSeenMovies, thatSeenMovies, firstSteps, firstPass, mCenter) => {
  let newQ = new Set();
  let winnerIds = new Set()
  for (let i = 0; i < q.length; i++) {
    let origActorId = q[i]
    let mIds = actors[origActorId].movie_ids
    for (let j = 0; j < mIds.length; j++) {
      let movieId = mIds[j]
      if (!movies[movieId] || thisSeenMovies.has(movieId)) continue
      if (firstPass) {
        if (!firstSteps.movies[movieId]) firstSteps.movies[movieId] = new Set()
        firstSteps.actors[origActorId].forEach(origFirstStep => {
          firstSteps.movies[movieId].add(origFirstStep)
        })
      }

      if (thatSeenMovies.has(movieId)) winnerIds.add(movieId)
      newQ.add(movieId)
    }
  }

  if (winnerIds.size) {
    let answerIds = new Set()
    winnerIds.forEach(winId => {
      firstSteps.movies[winId].forEach(firstStep => answerIds.add(firstStep))
    })
    let res = Array.from(answerIds.keys()).map(id => mCenter ? actors[id] : movies[id])
    return [true, res]
  } else {
    return [false, Array.from(newQ.keys())]
  }
}

const M2A = (q, thisSeenActors, thatSeenActors, firstSteps, firstPass, mCenter) => {
  let newQ = new Set();
  let winnerIds = new Set()
  for (let i = 0; i < q.length; i++) {
    let origMovieId = q[i]
    let aIds = movies[origMovieId].actor_ids
    for (let j = 0; j < aIds.length; j++) {
      let actorId = aIds[j]
      if (!actors[actorId] || thisSeenActors.has(actorId)) continue
      if (firstPass) {
        if (!firstSteps.actors[actorId]) firstSteps.actors[actorId] = new Set()
        firstSteps.movies[origMovieId].forEach(origFirstStep => {
          firstSteps.actors[actorId].add(origFirstStep)
        })
      }

      if (thatSeenActors.has(actorId)) winnerIds.add(actorId)
      newQ.add(actorId)
    }
  }

  if (winnerIds.size) {
    let answerIds = new Set()
    winnerIds.forEach(winId => {
      firstSteps.actors[winId].forEach(firstStep => answerIds.add(firstStep))
    })
    let res = Array.from(answerIds.keys()).map(id => mCenter ? actors[id] : movies[id])
    return [true, res]
  } else {
    return [false, Array.from(newQ.keys())]
  }
}

app.get('/bestpath/:act1/:act2', (req, res) => {
  let [startId, endId] = [parseInt(req.params.act1), parseInt(req.params.act2)]

  let q1 = [startId]
  let q2 = [endId]

  let firstSteps = {movies: {}, actors: {}}
  firstSteps.actors[startId] = new Set()

  let seenActors1 = new Set([startId])
  let seenActors2 = new Set([endId])
  let seenMovies1 = new Set()
  let seenMovies2 = new Set()
  let bestScore = 1;
  let start = new Date()

  let movieIds = actors[startId].movie_ids
  movieIds.forEach(movieId => firstSteps.movies[movieId] = new Set([movieId]))

  while (bestScore < 7) {
    let firstA2M = A2M(q1, seenMovies1, seenMovies2, firstSteps, true, false)
    if (firstA2M[0]) {
      res.send([bestScore, shuffle(firstA2M[1])]);
      return true
    } else {
      q1 = firstA2M[1]
      q1.forEach(movieId => seenMovies1.add(movieId))
    }

    let secondA2M = A2M(q2, seenMovies2, seenMovies1, firstSteps, false, false)
    if (secondA2M[0]) {
      res.send([bestScore, shuffle(secondA2M[1])]);
      return true
    } else {
      q2 = secondA2M[1]
      q2.forEach(movieId => seenMovies2.add(movieId))
    }

    bestScore++
    let timeElapsed = new Date() - start
    // console.log(bestScore + ": " + timeElapsed)
    if (!q1.length || !q2.length || bestScore > 6 || timeElapsed > 800) break

    let firstM2A = M2A(q1, seenActors1, seenActors2, firstSteps, true, false)
    if (firstM2A[0]) {
      res.send([bestScore, shuffle(firstM2A[1])]);
      return true
    } else {
      q1 = firstM2A[1]
      q1.forEach(actorId => seenActors1.add(actorId))
    }

    let secondM2A = M2A(q2, seenActors2, seenActors1, firstSteps, false, false)
    if (secondM2A[0]) {
      res.send([bestScore, shuffle(secondM2A[1])]);
      return true
    } else {
      q2 = secondM2A[1]
      q2.forEach(actorId => seenActors2.add(actorId))
    }

    bestScore++
    let timeElapsed2 = new Date() - start
    // console.log(bestScore + ": " + timeElapsed2)
    if (!q1.length || !q2.length || bestScore > 6 || timeElapsed2 > 800) break
  }

  res.send([0, []])
  return true
});

app.get('/moviepath/:mov1/:act2', (req, res) => {
  let [startId, endId] = [parseInt(req.params.mov1), parseInt(req.params.act2)]

  let q1 = []
  let q2 = [endId]

  let firstSteps = { movies: {}, actors: {} }
  firstSteps.movies[startId] = new Set()

  let seenActors1 = new Set()
  let seenActors2 = new Set([endId])
  let seenMovies1 = new Set([startId])
  let seenMovies2 = new Set()
  let bestScore = 1;
  let start = new Date()

  let actorIds = movies[startId].actor_ids
  shuffle(actorIds)
  for (let k = 0; k < actorIds.length; k++) {
    let newActorId = actorIds[k]
    if (newActorId === endId) {
      res.send([bestScore, [actors[newActorId]]])
      return true
    }
    firstSteps.actors[newActorId] = new Set([newActorId])
    seenActors1.add(newActorId)
    q1.push(newActorId)
  }

  while (bestScore < 7) {

    let firstA2M = A2M(q1, seenMovies1, seenMovies2, firstSteps, true, true)
    if (firstA2M[0]) {
      res.send([bestScore, shuffle(firstA2M[1])]);
      return true
    } else {
      q1 = firstA2M[1]
      q1.forEach(movieId => seenMovies1.add(movieId))
    }

    let secondA2M = A2M(q2, seenMovies2, seenMovies1, firstSteps, false, true)
    if (secondA2M[0]) {
      res.send([bestScore, shuffle(secondA2M[1])]);
      return true
    } else {
      q2 = secondA2M[1]
      q2.forEach(movieId => seenMovies2.add(movieId))
    }

    bestScore++
    let timeElapsed = new Date() - start
    // console.log("m" + bestScore + ": " + timeElapsed)
    if (!q1.length || !q2.length || bestScore > 6 || timeElapsed > 800) break

    let firstM2A = M2A(q1, seenActors1, seenActors2, firstSteps, true, true)
    if (firstM2A[0]) {
      res.send([bestScore, shuffle(firstM2A[1])]);
      return true
    } else {
      q1 = firstM2A[1]
      q1.forEach(actorId => seenActors1.add(actorId))
    }

    let secondM2A = M2A(q2, seenActors2, seenActors1, firstSteps, false, true)
    if (secondM2A[0]) {
      res.send([bestScore, shuffle(secondM2A[1])]);
      return true
    } else {
      q2 = secondM2A[1]
      q2.forEach(actorId => seenActors2.add(actorId))
    }

    bestScore++
    let timeElapsed2 = new Date() - start
    // console.log("m" + bestScore + ": " + timeElapsed2)
    if (!q1.length || !q2.length || bestScore > 6 || timeElapsed2 > 800) break
  }

  res.send([0, []])
  return true
});

// EXAMPLE OF FULL API REQ:

// app.get('/actors/:actorId', (request, response) => {
//   fetch(`https://api.themoviedb.org/3/person/${request.params.actorId}?append_to_response=movie_credits`, {
//     headers: {
//     'Authorization': 'Bearer ' + keys.TMDBReadAccessToken,
//     'Content-Type': `application/json;charset=utf-8`,
//   }})
//     .then((response) => {
//       return response.text();
//     }).then((body) => {
//       let results = JSON.parse(body)
//       response.send(results)
//     }).catch(err => {
//       console.log(err)
//     })
// });


app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`)
})
//Upper case formatting
function toTitleCase(str) {
    return str.replace(
      /\w*/g,
      function(txt) {
        if(txt.length<3){
            if(!["JA","MO","AL","BO","KY","SI","TY"].includes(txt.toUpperCase())){
                // console.log(txt.toUpperCase())
                return txt.toUpperCase();
            }
            else{
                // console.log(txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                
            }


        }
        // else if(txt==="iv"||txt==="Iv"){
        //     return "IV"
        // }
        // else if(txt==="iii"||txt==="Iii"){
        //     return "III"
        // }
        // else if(txt==="ii"||txt==="Ii"){
        //     return "II"
        // } 
        // else if(txt==="Jj"||txt==="jj"){
        //     return "JJ"
        // }
        // else if(txt==="Tj"||txt==="tj"){
        //     return "TJ"
        // }
        // else if(txt==="Cj"||txt==="cj"){
        //     return "CJ"
        // }
        // else if(txt==="Bj"||txt==="bj"){
        //     return "BJ"
        // }

        else{
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
      }
    );
  }

  //auto scroll page
  function scrollPage() {
    var div = document.querySelector(".page");
    $(div).animate({
       scrollTop: div.scrollHeight - div.clientHeight
    }, 1500);
 }

//get shortesr path to 2nd player
function getPath() {
    
    document.querySelector(".instructions").classList.add("hidden")

    var startPlayer = toTitleCase(document.getElementById("playerInput1").value)
    var endPlayer = toTitleCase(document.getElementById("playerInput2").value)

    if(!players[startPlayer]||!players[endPlayer]){
        document.getElementById("connections-list").innerHTML = "Player Not Found";
        return false;
    }

    let seenTeams = []
    let nextTeams = []
    let seenPlayers = [[startPlayer,[startPlayer]]]
    let nextPlayers = [[startPlayer,[startPlayer]]]
    let winArray = [];

    counter = 0;


    while(winArray.length<1){


        //queue up teams

        if(nextPlayers[0]){
            players[nextPlayers[0][0]].forEach(team =>{

                if(seenTeams.includes(team)){
                    return;
                }


                queueObject = [team,nextPlayers[0][1].concat(team)]

                seenTeams.push(team)
                nextTeams.push(queueObject)

                
            })
            nextPlayers.shift();
        }

        //queue up players
        if(nextTeams[0]){
            teams[nextTeams[0][0]].forEach(player =>{

                if(seenPlayers.includes(player)){
                    return;
                }
                
                
                queueObject = [player,nextTeams[0][1].concat(player)]

                if(player===endPlayer){
                    winArray = queueObject[1]
                }
                seenPlayers.push(player)
                nextPlayers.push(queueObject)
                
            })
            nextTeams.shift();
        }

    }
    displayConnections(winArray);
}

function displayConnections(winArray){
    document.getElementById("connections-list").innerHTML = "";
    for(let i=0;i<winArray.length-1;i+=2){
        let teamname = winArray[i+1].slice(8)

        let list = document.createElement("li");  
        //add css colors by team name
        switch(teamname){
            case "Atlanta Hawks":
                            list.classList.add("hawks");
                            break;
            case "Boston Celtics":
                            list.classList.add("celtics");
                            break;
            case "Cleveland Cavaliers":
                            list.classList.add("cavaliers");
                            break;
            case "New Orleans Pelicans":
                            list.classList.add("pelicans");
                            break;
            case "Chicago Bulls":
                            list.classList.add("bulls");
                            break;
            case "Dallas Mavericks":
                            list.classList.add("mavericks");
                            break;
            case "Denver Nuggets":
                            list.classList.add("nuggets");
                            break;
            case "Golden State Warriors":
                            list.classList.add("warriors");
                            break;
            case "Minneapolis Lakers":
                                list.classList.add("warriors");
                                break;
            case "Houston Rockets":
                            list.classList.add("rockets");
                            break;
            case "Los Angeles Clippers":
                            list.classList.add("clippers");
                            break;
            case "Los Angeles Lakers":
                            list.classList.add("lakers");
                            break;
            case "Miami Heat":
                            list.classList.add("heat");
                            break;
            case "Milwaukee Bucks":
                            list.classList.add("bucks");
                            break;
            case "Minnesota Timberwolves":
                            list.classList.add("timberwolves");
                            break;
            case "New Jersey Nets":
                                list.classList.add("timberwolves");
                                break;
            case "Brooklyn Nets":
                            list.classList.add("nets");
                            break;
            case "New York Knicks":
                            list.classList.add("knicks");
                            break;
            case "Orlando Magic":
                            list.classList.add("magic");
                            break;
            case "Indiana Pacers":
                            list.classList.add("pacers");
                            break;
            case "Philadelphia 76ers":
                            list.classList.add("sixers");
                            break;
            case "Phoenix Suns":
                            list.classList.add("suns");
                            break;
            case "Portland Trail Blazers":
                            list.classList.add("blazers");
                            break;
            case "Sacramento Kings":
                            list.classList.add("kings");
                            break;
            case "San Antonio Spurs":
                            list.classList.add("spurs");
                            break;
            case "Oklahoma City Thunder":
                            list.classList.add("thunder");
                            break;
            case "Toronto Raptors":
                            list.classList.add("raptors");
                            break;
            case "Utah Jazz":
                            list.classList.add("jazz");
                            break;
            case "Memphis Grizzlies":
                            list.classList.add("grizzlies");
                            break;
            case "Vancouver Grizzlies":
                                list.classList.add("grizzlies");
                                break;
            case "Washington Wizards":
                            list.classList.add("wizards");
                            break;
            case "Washington Bullets":
                            list.classList.add("wizards");
                            break;
            case "Detroit Pistons":
                            list.classList.add("pistons");
                            break;
            case "Charlotte Hornets":
                            list.classList.add("hornets");
                            break;
            case "New Orleans Hornets":
                                list.classList.add("hornets");
                                break;
            case "Seattle Supersonics":
                            list.classList.add("sonics");
                            break;
            case "Charlotte Bobcats":
                            list.classList.add("bobcats");
                            break;
            case "Philadelphia Warriors":
                                list.classList.add("knicks");
                                break;

            default:
                                list.classList.add("default");
                                break;
        }
 
        let player1 = document.createElement("div"); 
        let team = document.createElement("div"); 
        let player2 = document.createElement("div");

        player1.innerHTML = winArray[i];  
        team.innerHTML = `${winArray[i+1].slice(0,8)}<br>${teamname}`; 
        player2.innerHTML = winArray[i+2];  

        list.appendChild(player1);   
        list.appendChild(team);   
        list.appendChild(player2);
        
        let delayClass = "delay"+i
        list.classList.add(delayClass)
        list.classList.add("fadeInLeft");
                                   
        document.getElementById("connections-list").appendChild(list);
    }
    setTimeout(scrollPage,10)
}
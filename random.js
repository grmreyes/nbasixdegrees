//popular players for random
var newPlayers = [
    "Zion Williamson",
    "Luka Doncic",
    "Lamelo Ball",
    "Kyrie Irving",
    "Devin Booker",
    "Joel Embiid",
    "Nikola Jokic",
    "Jamal Murray",
    "Jaylen Brown",
    "Jayson Tatum",
    "Giannis Antetokounmpo",
    "Anthony Davis",
    "Trae Young",
    "De'Aaron Fox",
    "Karl-Anthony Towns",
    "Anthony Edwards",
    "Tyrese Haliburton",
    "Tyler Herro",
    "Cade Cunningham",
    "Jalen Green",
    "Evan Mobley",
    "Scottie Barnes",
    "Victor Wembanyama",
    "Jalen Brunson",
    "Lebron James",
    "Paolo Banchero",
    "Shai Gilgeous-Alexander",
    "Chet Holmgren",
    "Stephen Curry",
    "Kevin Durant"
    ]
    
    var oldPlayers = ["Larry Bird",
    "Magic Johnson",
    "Julius Erving",
    "Kareem Abdul-Jabbar",
    "Wilt Chamberlain",
    "Moses Malone",
    "Patrick Ewing",
    "Shawn Kemp",
    "Charles Barkley",
    "Shaquille O'Neal",
    "Phil Jackson",
    "Reggie Miller",
    "Karl Malone",
    "Dominique Wilkins",
    "Clyde Drexler",
    "John Stockton",
    "George Gervin",
    "James Worthy",
    "Isiah Thomas",
    "John Havlicek",
    "Rick Barry",
    "Bill Russell",
    "George Mikan",
    "Pete Maravich",
    "Walt Frazier",
    "Jerry West",
    "Bill Walton",
    "Hakeem Olajuwon",
    "David Robinson",
    "Michael Jordan",
    "Chris Mullin",
    "Scottie Pippen",
    "Elgin Baylor",
    "Oscar Robertson",
    "Elvin Hayes",
    "Alex English",
    "Willis Reed",
    "Bob Cousy"    
    ]
    
    
    function randomOld(){
        var player = oldPlayers[Math.floor(Math.random()*oldPlayers.length)]
        document.querySelector("#playerInput2").value = player
    }
    
    function randomNew(){
        var player = newPlayers[Math.floor(Math.random()*newPlayers.length)]
        document.querySelector("#playerInput1").value = player
    }
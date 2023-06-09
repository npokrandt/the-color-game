/*
This is a js file which explores indexedDB, which will be used for the game I have planned
*/

//Let's create an object store with 3 players: me, Nimbus and Sparrow
const playersD = [
    { id: 1, name: "Harris",  lives: 3, rn: 0, duration: 0, twenty: "no", status: "normal" },
    { id: 2, name: "Joe", lives: 3, rn: 0, duration: 0, twenty: "no", status: "normal" },
    { id: 3, name: "Bob",  lives: 3, rn: 0, duration: 0, twenty: "no", status: "normal" }
  ];
//defining the database variable

//Now we can add, delete and modify names and stuff, but for the latter 2 actions
//there is no way for the user to specify the id of the player they want to delete
//or modify. Once that is solved, there is the issue of rudimentary html/css to show each 
//player and their status (and number)

//THEN I can finally start building the first iteration of the game itself!

let db;

var OSlength = 0
//for now this determines the number of active players, starting with 5
var sn = 0
var activePlayers = []

const request = window.indexedDB.open("ColorTestDB", 5)

  request.onerror = (event) =>{
    //somthing went wrong. figure out how to handle it
    //this should do whatever is needed
    console.error(`Database error: ${event.target.errorCode}`);
  };

  request.onsuccess = (event) =>{
    db = event.target.result;

    const transaction = db.transaction(["players"], "readwrite")

    transaction.oncomplete = (event) => {
      console.log("initial count transaction complete")
    }

    transaction.onerror = (event) => {
      console.log("transaction failed")
    }

    const objectStore = transaction.objectStore("players");
    const request2 = objectStore.count();
    const request3 = objectStore.openCursor()

    request2.onerror = (event) =>{
      //somthing went wrong. figure out how to handle it
      //this should do whatever is needed
      console.error(`Something went wrong`);
    };

    request2.onsuccess = () =>{
      OSlength = request2.result + 1
      sn = OSlength - 1
      console.log(OSlength + " " + sn);
    };

    request3.onerror = (event) =>{
      //somthing went wrong. figure out how to handle it
      //this should do whatever is needed
      console.error(`Something went wrong`);
    };

    request3.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {

        const req = objectStore.get(cursor.key);
              req.onerror = (event) => {
              // Handle errors!
                console.log("error")
              };

              req.onsuccess = (event) => {
                // Get the old value that we want to update
                const data = event.target.result;
       
                // update the value(s) in the object that you want to change
                data.rn = 0
                data.status = "normal"
                data.lives = 3
                data.twenty = "no"
                data.duration = 0
      
                // Put this updated object back into the database.
                const requestUpdate = objectStore.put(data);
                requestUpdate.onerror = (event) => {
                  // Do something with the error
                  console.log("update error")
                };

                requestUpdate.onsuccess = (event) => {
                  // Success - the data is updated!
                  console.log("update successful")
                };
              }
        //console.log(`Name for ID #${cursor.key} is ${cursor.value.name}`);
        var playerID = "player" + cursor.key
        var playerFlex = playerID + "Flex"
        //console.log(playerID)

        var playerDiv = document.createElement("div")
        playerDiv.setAttribute("id", playerID)
        playerDiv.setAttribute("class", "player")
        document.getElementById("playerList").appendChild(playerDiv)

        var playerFlexDiv = document.createElement("div")
        playerFlexDiv.setAttribute("id", playerFlex)
        playerFlexDiv.setAttribute("class", "container2")
        document.getElementById(playerID).appendChild(playerFlexDiv)

        var playerNameID = playerID + "Name"
        var playerName = document.createElement("p")
        playerName.setAttribute("id", playerNameID)
        playerName.setAttribute("class", "playerName")
        document.getElementById(playerFlex).appendChild(playerName)
        document.getElementById(playerNameID).innerHTML = cursor.value.name

        var playerLivesID = playerID + "Lives"
        var playerLives = document.createElement("p")
        playerLives.setAttribute("id", playerLivesID)
        playerLives.setAttribute("class", "playerLives")
        document.getElementById(playerFlex).appendChild(playerLives)
        document.getElementById(playerLivesID).innerHTML = 3

        var playerNumberID = playerID + "Number"
        var playerNumber = document.createElement("p")
        playerNumber.setAttribute("id", playerNumberID)
        playerNumber.setAttribute("class", "playerNumber")
        document.getElementById(playerID).appendChild(playerNumber)
        document.getElementById(playerNumberID).innerHTML = 0

        var playerStatusID = playerID + "Status"
        var playerStatus = document.createElement("p")
        playerStatus.setAttribute("id", playerStatusID)
        playerStatus.setAttribute("class", "playerStatus")
        document.getElementById(playerID).appendChild(playerStatus)
        document.getElementById(playerStatusID).innerHTML = "normal"
        cursor.continue();
      } else {
        console.log("list complete");
      }
    }

  }

    request.onupgradeneeded = (event) => {
      console.log("upgrading...")
      const db = event.target.result;
db.deleteObjectStore("players");
      //d.onsuccess = (event) => {
        //console.log("players has been deleted")

        // Create an objectStore to hold information about our customers. We're
        // going to use "ssn" as our key path because it's guaranteed to be
        // unique - or at least that's what I was told during the kickoff meeting.
        const objectStore = db.createObjectStore("players", { keyPath: "id" });
    
        // Create an index to search customers by name. We may have duplicates
        // so we can't use a unique index.
        objectStore.createIndex("name", "name", { unique: false });

        // Use transaction oncomplete to make sure the objectStore creation is
        // finished before adding data into it.
        objectStore.transaction.oncomplete = (event) => {
            // Store values in the newly created objectStore.
            const customerObjectStore = db
            .transaction("players", "readwrite")
            .objectStore("players");
            playersD.forEach((customer) => {
              customerObjectStore.add(customer);
            });
          };
      //}

      //d.onerror = (event) => {
        //console.log("error")
      //}
};
  

function getCount(){
  const request = window.indexedDB.open("ColorTestDB", 5)
  request.onerror = (event) =>{
    //somthing went wrong. figure out how to handle it
    //this should do whatever is needed
    console.error(`Database error: ${event.target.errorCode}`);
  };

  request.onsuccess = (event) =>{
    const transaction = db.transaction(["players"], "readonly")

    transaction.oncomplete = (event) => {
      console.log("count transaction complete")
    }

    transaction.onerror = (event) => {
      console.log("transaction failed")
    }

    const objectStore = transaction.objectStore("players", "readwrite");
    const request2 = objectStore.count();

    request2.onerror = (event) =>{
      //somthing went wrong. figure out how to handle it
      //this should do whatever is needed
      console.error(`Something went wrong`);
    };

    request2.onsuccess = () =>{
      OSlength = request2.result + 1
      sn = OSlength - 1
      console.log(OSlength + ' ' + sn);
    };

  }
}
//a function to view the data; still in test mode
function viewData(){
  //getCount()
  console.log("view")
  const request = window.indexedDB.open("ColorTestDB", 5)
  request.onerror = (event) =>{
    //somthing went wrong. figure out how to handle it
    //this should do whatever is needed
    console.error(`Database error: ${event.target.errorCode}`);
  };

  request.onsuccess = (event) =>{
    db = event.target.result;
    const transaction = db.transaction(["players"], "readwrite")

    transaction.oncomplete = (event) => {
      console.log("view transaction complete")
    }

    transaction.onerror = (event) => {
      console.log("transaction failed")
    }

    const objectStore = db.transaction(["players"], "readwrite").objectStore("players");

      objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          var player = cursor.key
          var id = "player" + player
          var name = cursor.value.name
          var lives = cursor.value.lives
          //${cursor.key}
          console.log(`Lives for ` + name + ` is ` + lives + `. ` + id);
          cursor.continue();
        } else {
          console.log("list complete");
        }
      }
  }
}

//a function reset the data after each game
function resetOS(){

  console.log("modify")
  const request = window.indexedDB.open("ColorTestDB", 5)
  request.onerror = (event) =>{
    //somthing went wrong. figure out how to handle it
    //this should do whatever is needed
    console.error(`Database error: ${event.target.errorCode}`);
  };

  request.onsuccess = (event) =>{
    db = event.target.result;
    const transaction = db.transaction(["players"], "readwrite")

    transaction.oncomplete = (event) => {
      console.log("modify transaction complete")
    }

    transaction.onerror = (event) => {
      console.log("transaction failed")
    }

    const objectStore = db
    .transaction(["players"], "readwrite")
    .objectStore("players");

    //add a cursor
    objectStore.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        var player = cursor.key
        var id = "player" + player
        var idNum = id + "Number"
        var idSts = id + "Status"
        var idLvs = id + "Lives"
        document.getElementById(idNum).innerHTML = 0
        document.getElementById(idSts).innerHTML = "normal"
        document.getElementById(idLvs).innerHTML = 3
        //${cursor.key}
        //console.log(`Lives for ` + name + ` is ` + lives + `. ` + id);
        const req = objectStore.get(player);
              req.onerror = (event) => {
              // Handle errors!
                console.log("error")
              };

              req.onsuccess = (event) => {
                // Get the old value that we want to update
                const data = event.target.result;
       
                // update the value(s) in the object that you want to change
                data.rn = 0
                data.status = "normal"
                data.lives = 3
                data.twenty = "no"
      
                // Put this updated object back into the database.
                const requestUpdate = objectStore.put(data);
                requestUpdate.onerror = (event) => {
                  // Do something with the error
                  console.log("update error")
                };

                requestUpdate.onsuccess = (event) => {
                  // Success - the data is updated!
                  console.log("update successful")
                };
              }
        cursor.continue();
      } else {
        console.log("list complete");
      }
    }
  }
}

//a function to add to the store; still in test mode
function addPlayer(){

  var playerNamePrompt = prompt("What is the name of player " + OSlength + "?", "<player>")
  //here we get the name for the new player

  //there must be input for the name!
  if (playerNamePrompt != ""){
  var tempO = new Object()
  
  console.log(OSlength)
  //this info is for the store and the new html elements
  tempO.id = OSlength
  tempO.name = playerNamePrompt
  //these 2 fields are constant for all new players; they will change during gameplay
  tempO.rn = 0
  tempO.status = "normal"
  tempO.lives = 3
  tempO.duration = 0
  tempO.twenty = "no"

  console.log("add")
  //open IDB
  const request = window.indexedDB.open("ColorTestDB", 5)

  request.onerror = (event) =>{
    //somthing went wrong. figure out how to handle it
    //this should do whatever is needed
    console.error(`Database error: ${event.target.errorCode}`);
  };

  request.onsuccess = (event) =>{
    //we're here - successful. Now what?
    db = event.target.result;
    const transaction = db.transaction(["players"], "readwrite")

    const objectStore = transaction.objectStore("players");
    //this is pretty much it for updating the DB. this is not the issue
    const request2 = objectStore.add(tempO);

    request2.onerror = (event) =>{
      //somthing went wrong. figure out how to handle it
      //this should do whatever is needed
      console.error(`Database error: ${event.target.errorCode}`);
    };

    request2.onsuccess = (event) =>{


      //somthing went wrong. figure out how to handle it
      //this should do whatever is needed
      console.log(playerNamePrompt + " added to players list!");
    };

    //It appears this is where the bug lies
    //find out what is going wrong here!
    transaction.oncomplete = (event) => {
      console.log("add transaction complete")
      //update the id number for the next player added
      var playerID = "player" + OSlength
      var playerFlex = playerID + "Flex"
      //it appears the playerID is not the issue. Then what is?
      console.log(playerID)

      //here we create the new div (which does occur - it just doesn't have any info in it)
        var playerDiv = document.createElement("div")
        //this should set the correct div
        playerDiv.setAttribute("id", playerID)
        playerDiv.setAttribute("class", "player")
        document.getElementById("playerList").appendChild(playerDiv)

        var playerFlexDiv = document.createElement("div")
        playerFlexDiv.setAttribute("id", playerFlex)
        playerFlexDiv.setAttribute("class", "container2")
        document.getElementById(playerID).appendChild(playerFlexDiv)

        var playerNameID = playerID + "Name"
        var playerName = document.createElement("p")
        playerName.setAttribute("id", playerNameID)
        playerName.setAttribute("class", "playerName")
        document.getElementById(playerFlex).appendChild(playerName)
        document.getElementById(playerNameID).innerHTML = playerNamePrompt

        var playerLivesID = playerID + "Lives"
        var playerLives = document.createElement("p")
        playerLives.setAttribute("id", playerLivesID)
        playerLives.setAttribute("class", "playerLives")
        document.getElementById(playerFlex).appendChild(playerLives)
        document.getElementById(playerLivesID).innerHTML = 3

        var playerNumberID = playerID + "Number"
        var playerNumber = document.createElement("p")
        playerNumber.setAttribute("id", playerNumberID)
        playerNumber.setAttribute("class", "playerNumber")
        document.getElementById(playerID).appendChild(playerNumber)
        document.getElementById(playerNumberID).innerHTML = 0

        var playerStatusID = playerID + "Status"
        var playerStatus = document.createElement("p")
        playerStatus.setAttribute("id", playerStatusID)
        playerStatus.setAttribute("class", "playerStatus")
        document.getElementById(playerID).appendChild(playerStatus)
        document.getElementById(playerStatusID).innerHTML = "normal"

        console.log(playerID + " " + playerNameID + " " + playerNumberID + " " + playerStatusID)
      getCount()
    }

    transaction.onerror = (event) => {
      console.log("transaction failed")
    }
  }
} else {
  console.log("You must type somthing into the text box!")
}
}

function test(){
  for (var i = 1; i < OSlength; i++){
    var testID = "player" + i
    console.log(testID)
    document.getElementById(testID).style.opacity = 0.2
  }
}

//a function to delete from the store; still in test mode

//Now there is issue with adding a player after a deletion!
function deletePlayer(){
  //this will eventually be the selected id that the user wants to delete
  deleteId = prompt("Which player would you like to delete?", "<id>")

  var c = 0
  while (c < 1){
  if ((deleteId > 0) && (deleteId < OSlength)){
    console.log(deleteId)
    deleteId = (deleteId - 0)
    c++
  } else {
    deleteId = prompt("Incorrect Number! Please try a different id", "<id>")
  }
  }
  //console.log("delete")
  const request = window.indexedDB.open("ColorTestDB", 5)
  request.onerror = (event) =>{
    //somthing went wrong. figure out how to handle it
    //this should do whatever is needed
    console.error(`Database error: ${event.target.errorCode}`);
  };

  request.onsuccess = (event) =>{

    db = event.target.result;
    const transaction = db.transaction(["players"], "readwrite")

    transaction.oncomplete = (event) => {
      console.log("delete transaction complete")

      //maybe here we can test to see if the object deleted was the last in the list,
      //therefore we don't need to reset the ids
      if ((deleteId + 1) != OSlength){
        realignCount(deleteId)
      } else {
        console.log("the last value in the table was deleted; no need to adjust the ids")
      }
      getCount()
      var playerID = "player" + deleteId;
      document.getElementById(playerID).remove()
      
    }

    transaction.onerror = (event) => {
      console.log("transaction failed")
    }

    db
    .transaction(["players"], "readwrite")
    .objectStore("players")
    .delete(deleteId).onsuccess = (event) => { 
    console.log("player deleted");
    };
  }
}

function realignCount(dId){

  console.log("count is being realigned")
  var names = []

  //the purpose of deleteID in here is that for the divs to the right of the deleted div, their 
  //ids need to be modified so that the number matches the object store key
  console.log(dId)
//there might be a deleted character out of order. I would like it to correct itself
//go through with a cursor maybe, change id to resetId shown above
//add 1 to the id after each modification\

  //the only time someone might delete a player is before the game. Thus, the only info to be carried over 
  //is the names of the others already playing
  const request = window.indexedDB.open("ColorTestDB", 5)
  request.onerror = (event) =>{
      //somthing went wrong. figure out how to handle it
      //this should do whatever is needed
      console.error(`Database error: ${event.target.errorCode}`);
    };

  request.onsuccess = (event) =>{
    db = event.target.result;
    const transaction = db.transaction(["players"], "readonly")
  
      transaction.oncomplete = (event) => {
        console.log("name grab transaction complete")
      }
  
      transaction.onerror = (event) => {
        console.log("transaction failed")
      }
  
      const objectStore = db
      .transaction(["players"], "readonly")
      .objectStore("players");

      objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          console.log(`Name for ID #${cursor.key} is ${cursor.value.name}`);
          names.push(cursor.value.name)
          cursor.continue();
        } else {
          console.log("list complete");
          console.log(names.length)
          //after we gather the names we clear the table and rebuild it
          resetStore(names)
        }
      }

      for (var i = dId + 1; i < OSlength; i++){
        var playerIDToChange = "player" + i;
        var changedID = "player" + (i - 1)
        console.log(playerIDToChange + " " + changedID)
        document.getElementById(playerIDToChange).id = changedID
        //document.getElementById(changedID).style.opacity = 0.5
        //console.log(changedID)
      }
      
      /*req.onerror = (event) => {
      // Handle errors!
      console.log("error")
      };
      req.onsuccess = (event) => {
          // Get the old value that we want to update
          const data = event.target.result;
        
          // update the value(s) in the object that you want to change
          //data.name = prompt("Write a new name for player 2", "Example");
        
          data.id = i
          // Put this updated object back into the database.
          const requestUpdate = objectStore.put(data);
          requestUpdate.onerror = (event) => {
            // Do something with the error
            console.log("update error")
          };
          requestUpdate.onsuccess = (event) => {
            // Success - the data is updated!
            console.log("update successful")
          };
        };*/
    }

  function resetStore(){
    console.log(names.length)

    const request = window.indexedDB.open("ColorTestDB", 5)
    request.onerror = (event) =>{
      //somthing went wrong. figure out how to handle it
      //this should do whatever is needed
      console.error(`Database error: ${event.target.errorCode}`);
    };

    request.onsuccess = (event) =>{
      db = event.target.result;
      const transaction = db.transaction(["players"], "readwrite")
  
      transaction.oncomplete = (event) => {
        console.log("table reset transaction complete")
      }
  
      transaction.onerror = (event) => {
        console.log("transaction failed")
      }

      const objectStore = db
      .transaction(["players"], "readwrite")
      .objectStore("players");

      const clear = objectStore.clear()

      clear.onsuccess = (event) => {
        console.log("players has been cleared")
      }

      var objects = []
      for (var i = 1; i < OSlength; i++){
        var tempoO = new Object()
        tempoO.id = i
        tempoO.name = names[i - 1]
        tempoO.rn = 0
        tempoO.status = "normal"
        tempoO.duration = 0
        tempoO.twenty = "no"
        objects.push(tempoO)       
      }

      console.log(objects.length)

      objects.forEach((object) => {
        objectStore.add(object)
      })

      location.reload()
      //const request2 = objectStore.add(tempoO)
    }
  }
}



//this initiates the game!
function startGame(){
  //if we're coming from a completed game, the user should be able to modify the player list if they want
  //first let's reset with all the same players\
  var pr = "Are you sure you would like to start a game with these players?"
  if (sn < 2){
    activePlayers = []
      //change every player's status to normal, their rn to 0, and their box loses its opacity      
      for (var i = 1; i < OSlength; i++){
        var pID = "player" + i
        var pNum = "player" + i + "Number"
        var pSt = "player" + i + "Status"
        var pL = "player" + i + "Lives"
        document.getElementById(pID).style.opacity = 1
        document.getElementById(pNum).innerHTML = 0
        document.getElementById(pSt).innerHTML = "normal"
        document.getElementById(pL).innerHTML = 3
        sn = OSlength - 1
      }
      document.getElementById("playAgain").style.display = "none"
      document.getElementById("victoryMessage").style.display = "none"
      pr = "Would you like to start another game with these players?"
      resetOS()
  } 
    
  var s = prompt(pr, "")

    
  if ((s == "yes") || (s == "y")){
      //game is started!
      console.log("the game has begun!")
      document.getElementById("start").style.display = "none"
      document.getElementById("addPlayer").style.display = "none"
      document.getElementById("deletePlayer").style.display = "none"
      document.getElementById("nextTurn").style.display = "block"
      populateActivePlayers()
      
  } else {
      document.getElementById("start").style.display = "block"
      document.getElementById("addPlayer").style.display = "inline"
      document.getElementById("deletePlayer").style.display = "inline"
  }

}

function populateActivePlayers(){
  const request = window.indexedDB.open("ColorTestDB", 5);

      request.onerror = (event) =>{
        //somthing went wrong. figure out how to handle it
        //this should do whatever is needed
        console.error(`Database error: ${event.target.errorCode}`);
      };

      request.onsuccess = (event) =>{
        db = event.target.result;
        const transaction = db.transaction(["players"], "readwrite")

        transaction.oncomplete = (event) => {
          console.log("update transaction complete")
        }

        transaction.onerror = (event) => {
          console.log("transaction failed")
        }

        const objectStore = db.transaction(["players"], "readwrite").objectStore("players");

        objectStore.openCursor().onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            var name = cursor.value.name
            activePlayers.push(name)
            cursor.continue();
          } else {
            console.log("list complete");
          }
        }
      }
}

//this is the big one: each press triggers the next turn!
function nextTurn(){
  console.log(sn)
  var playerCounter = 0
    const request = window.indexedDB.open("ColorTestDB", 5);

    request.onerror = (event) =>{
      //somthing went wrong. figure out how to handle it
      //this should do whatever is needed
      console.error(`Database error: ${event.target.errorCode}`);
    };


    request.onsuccess = (event) =>{
      db = event.target.result;
      const transaction = db.transaction(["players"], "readwrite")

      transaction.oncomplete = (event) => {
        console.log("view transaction complete")
      }

      transaction.onerror = (event) => {
        console.log("transaction failed")
      }

      const objectStore = db.transaction(["players"], "readwrite").objectStore("players");

        objectStore.openCursor().onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            console.log(playerCounter)
            //the entire turn plays out in here
            //lets start by grabbing everything pertinent

            //creating the ids of elements that will be updated
            var player = cursor.key
            var id = "player" + player
            var pNum = id + "Number"
            var pStatus = id + "Status"
            //status or lives will be modified if needed
            //grabbing info from the db for each player
            var name = cursor.value.name
            var rn = cursor.value.rn
            var sts = cursor.value.status
            var lives = cursor.value.lives
            var frn = cursor.value.duration
            var twy = cursor.value.twenty
            
            console.log(frn)

            var randomNumber1 = 0
            var randomNumber2 = 0
            var color = "black"

            if (rn == 0){
              console.log("You can't lose on turn 1!")
              rn += 1
              document.getElementById(pNum).innerHTML = rn
              updateOS(rn, "rn", player)
              //new info: we have to update the rn value in the database!
            } else {
              //the next comparison is what the player's status is
              if (sts == "normal"){
                document.getElementById(id).style.borderColor = "black"
                document.getElementById(pStatus).innerHTML = "normal"
                document.getElementById(pStatus).style.color = "black"
                console.log(name + " is normal!")
                randomNumber1 = Math.floor(Math.random() * 100)
                if (twy == "yes"){
                  randomNumber1 += 20
                  console.log("twenty!" + randomNumber1 + " "  + (randomNumber1 - 20))
                  updateOS("no", "twy", player)
                }
                randomNumber2 = Math.floor(Math.random() * 100)
                if (randomNumber1 >= rn){
                  //safe! roll the second roll
                  color = returnColor(randomNumber2)
                } else if ((randomNumber1 < rn) && (lives > 1)){
                  //lose a life. so sad. Still roll the second roll
                  var pLives = id + "Lives"
                  console.log("life lost!")
                  lives -= 1
                  updateOS(lives, "lives", player)
                  document.getElementById(pLives).innerHTML = lives
                  color = returnColor(randomNumber2)
                  //change lives number in the DB and the HTML
                } else {
                  sn -= 1
                  console.log(sn)
                  var pLives = id + "Lives"
                  console.log("life lost!")
                  lives -= 1
                  updateOS(lives, "lives", player)
                  updateOS("eliminated", "status", player)
                  document.getElementById(id).style.borderColor = "black"
                  document.getElementById(pLives).innerHTML = lives
                  document.getElementById(pStatus).innerHTML = "eliminated"
                  document.getElementById(id).style.opacity = 0.5
                  color = "black"
                }

                //this switch just determines how much is added to the rn, if any
                switch(color){
                  case "beige":
                    //do beige
                    console.log(color)
                    var num3 = 0
                    num3 = Math.floor(Math.random() * 100);
                    if (num3 >= 50){
                      rn+=1
                      document.getElementById(pNum).innerHTML = rn
                      updateOS(rn, "rn", player)
                    } else {
                      console.log("you got lucky!")
                    }
                    document.getElementById(id).style.borderColor = "black"
                    break;
                  case "maroon":
                    //do maroon
                    console.log(color + ". Oh no!")
                    rn+=2
                    document.getElementById(pNum).innerHTML = rn
                    updateOS(rn, "rn", player)
                    document.getElementById(id).style.borderColor = "maroon"
                    break;
                  case "pink":
                    console.log(color + ". Could be helpful")
                    rn+=1
                    document.getElementById(pNum).innerHTML = rn
                    updateOS(rn, "rn", player)
                    updateOS("yes", "twy", player)
                    document.getElementById(id).style.borderColor = "pink"
                    break;
                  case "blue":
                    console.log(color + ". BRRR!")
                    rn+=2
                    document.getElementById(pNum).innerHTML = rn
                    updateOS(rn, "rn", player)
                    updateOS("frozen", "status", player)
                    updateOS(2, "dur", player)
                    document.getElementById(id).style.borderColor = "blue"
                    document.getElementById(pStatus).innerHTML = "frozen"
                    document.getElementById(pStatus).style.color = "blue"
                  default:
                    console.log(color)
                    //black is the default case. It doesn't change the number at all
                }

                //case thing to finish out turn
                //normal turn
                //for a normal turn a random number less than 100 is rolled.
                //if the number is less than the player's number, then they are out kkkkk!
                //if it is higher they are safe
                //from there they might:
                //get beige; 50% chance to add 1
                //get maroon; add 2
                //get blue; will become frozen for 3 turns
                //get pink; add 20 to the next number compared to the rn
                playerCounter++
              } else if (sts == "frozen"){
                //first off, change the number and status, if needed
                console.log(name + " is frozen!")
                console.log(frn)
                var pStatus = id + "Status"
                frn -= 1
                console.log(frn)
                if (frn > 0){
                  updateOS(frn, "dur", player)
                } else {
                  console.log("the ice has thawed!")
                  updateOS("normal", "status", player)
                  updateOS(0, "dur", player)
                }

                randomNumber1 = Math.floor(Math.random() * 100)

                if (randomNumber1 >= rn){
                  console.log("safe!")
                  rn += 2
                  updateOS(rn, "rn", player)
                  document.getElementById(pNum).innerHTML = rn
                  //safe! roll the second roll
                } else if ((randomNumber1 < rn) && (lives > 1)){
                  //lose a life. so sad. Still roll the second roll
                  var pLives = id + "Lives"
                  console.log("life lost!")
                  lives -= 1
                  updateOS(lives, "lives", player)
                  document.getElementById(pLives).innerHTML = lives
                  rn += 2
                  updateOS(rn, "rn", player)
                  document.getElementById(pNum).innerHTML = rn
                  //change lives number in the DB and the HTML
                } else {
                  sn -= 1
                  console.log(sn)
                  var pLives = id + "Lives"
                  console.log("life lost!")
                  lives -= 1
                  updateOS(lives, "lives", player)
                  updateOS("eliminated", "status", player)
                  document.getElementById(id).style.borderColor = "black"
                  document.getElementById(pLives).innerHTML = lives
                  document.getElementById(pStatus).innerHTML = "eliminated"
                  document.getElementById(pStatus).style.color = "black"
                  document.getElementById(id).style.opacity = 0.5
                }
                
                //rn roll still happens, along with its fallout
                playerCounter++
              } else {
                //with luck, this should only affect the active player array
                if ((sn != activePlayers.length) && (sts == "eliminated") && (name == activePlayers[playerCounter])){
                  console.log(activePlayers[playerCounter] + " was eliminated last turn!")
                  //break as I research how to remove values from an array by value instead of popping
                  activePlayers.splice(playerCounter, 1);
                  console.log(activePlayers)
                }
                //if a player is eliminated, skip them
                //eliminated player; don't carry out turn
              }
              //console.log("past turn 1")
              //check for eliminated or frozen
              //do the turn
              //update what must be updated
              //next player!
            }

            //now we have all the data. Time to play out the turn!

            //console.log(`Lives for ` + name + ` is ` + lives + `. ` + id);
            cursor.continue();
          } else {
            console.log(activePlayers.length);
            if (sn <= 1){
              //at game over: one or more people are still alive
              //they are declared the winner(s)
              //the new game button appears
              if (sn < 1){
                //a tie between some number of players
                var tieMessage = "There is a tie! "
                console.log(activePlayers.length)
                var len = activePlayers.length
                for (var i = 0; i < len; i++){
                  console.log(i)
                  if (i == (len - 1)){
                    console.log("late Winner" + i)
                    tieMessage += "and " + activePlayers[i]
                  } else if (i == (len - 2)){
                    console.log("mid Winner")
                    tieMessage += activePlayers[i]
                    if (len > 2){
                      tieMessage += ","
                    }
                    tieMessage += " "
                  } else {
                    console.log("earliest Winner")
                    tieMessage += activePlayers[i] + ", "
                  }
                }
                tieMessage += " are tied for this game!"
                document.getElementById("victoryMessage").innerHTML = tieMessage
                console.log("there is a tie!")
              } else {
                //one winner
                //problem: if one winner, the array still has the last other remaining player(s).
                //How to fix this...
                for (var i = 1; i < OSlength; i++){
                  var playerThatMaybeWon = "player" + i + "Name"
                  var statusThatMaybeWon = "player" + i + "Status"
                  var playerThatMaybeWonHTML = document.getElementById(playerThatMaybeWon).innerHTML
                  var statusThatMaybeWonHTML = document.getElementById(statusThatMaybeWon).innerHTML
                  if (statusThatMaybeWonHTML != "eliminated"){
                    document.getElementById("victoryMessage").innerHTML = playerThatMaybeWonHTML + " is the winner!"
                  }
                }
                console.log("the game is over!")
              }
  
              document.getElementById("nextTurn").style.display = "none"
              document.getElementById("playAgain").style.display = "block"
              document.getElementById("victoryMessage").style.display = "block"
              
            }
          }
          
        }
    }

    function returnColor(number){
      //there will be more colors soon
      if (number < 70){
        return "beige"
      } else if ((number >= 70) && (number < 80)){
        return "maroon"
      } else if ((number >= 80) && (number < 90)){
        return "blue" 
      } else {
        return "pink"
      }


    }

    //this runs any time the data store needs to be updated
    //it takes the data and type to be updated as parameters
    function updateOS(newData, type, playerToBeUpdated){
      const request = window.indexedDB.open("ColorTestDB", 5);

      request.onerror = (event) =>{
        //somthing went wrong. figure out how to handle it
        //this should do whatever is needed
        console.error(`Database error: ${event.target.errorCode}`);
      };

      request.onsuccess = (event) =>{
        db = event.target.result;
        const transaction = db.transaction(["players"], "readwrite")

        transaction.oncomplete = (event) => {
          console.log("update transaction complete")
        }

        transaction.onerror = (event) => {
          console.log("transaction failed")
        }

        const objectStore = db.transaction(["players"], "readwrite").objectStore("players");

        const req = objectStore.get(playerToBeUpdated);
              req.onerror = (event) => {
              // Handle errors!
                console.log("error")
              };

              req.onsuccess = (event) => {
                // Get the old value that we want to update
                const data = event.target.result;
       
                switch(type){
                  case "rn":
                    data.rn = newData
                    break;
                  case "status":
                    data.status = newData
                    break; 
                  case "lives":
                    data.lives = newData
                    break; 
                  case "twy":
                    data.twenty = newData
                    break;
                  case "dur":
                    data.duration = newData
                    break;
                }
                
      
                // Put this updated object back into the database.
                const requestUpdate = objectStore.put(data);
                requestUpdate.onerror = (event) => {
                  // Do something with the error
                  console.log("update error")
                };

                requestUpdate.onsuccess = (event) => {
                  // Success - the data is updated!
                  console.log("update successful")
                };
              };
      }
    }

}


//Run this function for when the page has loaded
$(document).ready(function(){

  // ---------------------Globals---------------------
  //Declare variable to monitor the position of the clay pigeon and the container where the clay pigeon exists
  var pigeon;
  var board;

  //Declare size of the clay pigeon
  var pigeonWidth = 100;
  var pigeonHeight = 50;

  //Declare size of the container where the pigeon can be shot
  var xBoard = $(".container-top").width();
  var yBoard = $(".container-top").height();

  //Coordinates of the pigeon
  var pigeonLeft;
  var pigeonTop;
  var pigeonRight;

  //Coordinates of the board
  var boardLeft;
  var boardTop;
  var boardRight;

  //Coordinates of the pigeon starting from the left
  var xLeftPos;
  var yLeftPos;

  //Coordinates of the pigeon starting from the right
  var xRightPos;
  var yRightPos;

  //Define variables for the interval times
  var leftInterval;
  var rightInterval;

  //Variable which determines whether the pigeon is released from the right or the left
  var sideChoice;

  //Initialise score as 0
  var score = 0;

  //Count the number of pigeons that have been released
  var pigeonCount;

  //Variable which retains the previous score
  var previousScore = 0;

  // ------------------End of Globals------------------

  // ---------------------Run Game--------------------
  //Apply on-click functionality to change either the background or the difficulty of the game

  //Change background display to day
  $("#day").click(function(){
    $(".container-top").css({
      "background-image": "radial-gradient(circle at top right, orange 5%, yellow 15%, lightskyblue 18%)"
    });
    $(".container-bottom").css({
      "background-image": "linear-gradient(lightgreen 20%, forestgreen)"
    });
    $("#btn").css({
      "background-color": "lightskyblue"
    })
  });

  //Change background display to night
  $("#night").click(function(){
    $(".container-top").css({
      "background-image": "radial-gradient(circle at top right, white 5%, #fafafa 15%, midnightblue 18%)"
    });
    $(".container-bottom").css({
      "background-image": "linear-gradient(to top, black 5%, darkgreen)"
    });
    $("#btn").css({
      "background-color": "midnightblue"
    })
  });

  //Change difficulty to easy
  $("#easy").click(function(){
    $("button").removeClass("diff");
    $(this).addClass("diff");
    $(".container-top, .container-bottom, .gameInstructions").css({
      "width": "800px"
    });
    $(".container-top").css({
      "height": "450px"
    });
    $(".gameInstructions").css({
      "height": "100px"
    });
    pigeonWidth = 100;
    pigeonHeight = 50;
    xBoard = $(".container-top").width();
    yBoard = $(".container-top").height();
    $("p").css({
      "line-height": yBoard + "px"
    });
  });

  //Change difficulty to medium
  $("#medium").click(function(){
    $("button").removeClass("diff");
    $(this).addClass("diff");
    $(".container-top, .container-bottom, .gameInstructions").css({
      "width": "700px"
    });
    $(".container-top").css({
      "height": "350px"
    });
    $(".gameInstructions").css({
      "height": "100px"
    });
    pigeonWidth = 80;
    pigeonHeight = 40;
    xBoard = $(".container-top").width();
    yBoard = $(".container-top").height();
    $("p").css({
      "line-height": yBoard + "px"
    });
  });

  //Change difficulty to hard
  $("#hard").click(function(){
    $("button").removeClass("diff");
    $(this).addClass("diff");
    $(".container-top, .container-bottom, .gameInstructions").css({
      "width": "500px"
    });
    $(".container-top").css({
      "height": "200px"
    });
    $(".gameInstructions").css({
      "height": "120px"
    });
    pigeonWidth = 60;
    pigeonHeight = 30;
    xBoard = $(".container-top").width();
    yBoard = $(".container-top").height();
    $("p").css({
      "line-height": yBoard + "px"
    });
  });

  //Click the start button to run the game
  $("#btn").click(function(){
    reset();
    playGame();
  });
  // --------------------End of Run Game-------------------

  // ---------------------Functions--------------------
  //Play game
  function playGame(){

    //Hide the options for difficulty and the game instructions whilst the game is playing
    $("#btn").hide();
    $(".leftBtn").hide();
    $(".rightBtn").hide();
    $(".gameInstructions").hide();

    //Apply an event listener so that when the user clicks, a gun sound is executed
    gunShotListener();

    var pull = setInterval(function(){
      //If the pigeon doesn't exist, then create it and initialise the movement
      if(($("#clayPigeonImage").length == 0) && (pigeonCount < 5)){
        createPigeon();
        pigeonMovement();
        pigeonCount++;
      }
      else if ((pigeonCount >= 5) && ($("#clayPigeonImage").length == 0)){
        clearInterval(pull);
        $("#btn").show();
        $(".rightBtn").show();
        $(".leftBtn").show();
        $("#container-top").append("<p>GAME OVER! You scored " + score + " points");
        $("p").css({
          "line-height": yBoard + "px"
        });
        $("#btn").html("Play Again")
      }
    }, 1000)
  }

  //Function which controls the movement of the clay pigeon
  function pigeonMovement(){
    //Determine whether the pigeon is released from the left or the right
    sideChoice = pigeonStartSide();
    //Pigeon starts from the left
    if (sideChoice == 1){
      //Initialise the coordinates of the pigeon
      xLeftPos = 1;
      yLeftPos = (yBoard - 1 - pigeonHeight);
      //Set up interval to move the pigeon
      leftInterval = setInterval(function(){
        //Move ball up and right
        pigeon.css({
          "left": xLeftPos + "px",
          "top": yLeftPos + "px"
        });
        //Adjust the position of the clay pigeon
        xLeftPos = newXLeft(xLeftPos);
        yLeftPos = newY(yLeftPos);
        //Find the positions of the pigeon and board and then evaluate decide if the pigeon has either hit the board or now lies beyond the boundaries of the board
        var testColl = findPosition();
        //If testColl has the value of "1" then we want to stop the setinterval and move on to the next clay pigeon
        if (testColl == 1){
          clearInterval(leftInterval);
          $("#clayPigeonImage").remove();
          score = score - 10;
          $("h2").html("Score: " + score)
        }
      }, 10);
    }
    //Pigeon starts from the right
    else if (sideChoice == 2){
      //Initialise the coordinates of the pigeon
      xRightPos = (xBoard - pigeonWidth - 1);
      yRightPos = (yBoard - 1 - pigeonHeight);
      //Set up interval to move the pigeon
      rightInterval = setInterval(function(){
        //Move ball up and right
        pigeon.css({
          "left": xRightPos + "px",
          "top": yRightPos + "px"
        });
        //Adjust the position of the clay pigeon
        xRightPos = newXRight(xRightPos);
        yRightPos = newY(yRightPos);
        //Find the positions of the pigeon and board and then evaluate decide if the pigeon has either hit the board or now lies beyond the boundaries of the board
        var testColl = findPosition();
        //If testColl has the value of "1" then we want to stop the setinterval and move on to the next clay pigeon
        if (testColl == 1){
          clearInterval(rightInterval);
          $("#clayPigeonImage").remove();
          score = score - 10;
          $("h2").html("Score: " + score)
        }
      }, 10);
    }
  }

  //Finds the positions of the top-container and the clay-pigeon
  function findPosition(){
    //Find left and top edge of the pigeon
    pigeonLeft = pigeon.offset().left;
    pigeonTop = pigeon.offset().top;

    //Find right edge of the pigeon
    pigeonRight = pigeonLeft + pigeon.width();

    //Find left and top edge of the board
    boardLeft = board.offset().left;
    boardTop = board.offset().top;

    //Find right edge of the board
    boardRight = boardLeft + board.width();

    //Test whether or not the clay pigeon has collided with the boarder
    var coll = collide();

    //If the pigeon has hit or exceeds the boundaries of the board then have the "findPosition" function return the value "1"
    if(coll == "hit"){
      return 1;
    }
  }

  //Function which generates a random number to determine from which side the clay pigeon is shot from
  function pigeonStartSide(){
    //Generate a random number, either 1 or 2
    var side = Math.floor((Math.random() * 2) + 1);
    return side;
  }

  //Function which checks whether or not the pigeon has hit the boarder of the container
  function collide(){
    if ((pigeonLeft <= boardLeft) || (pigeonRight >= boardRight) || (pigeonTop <= boardTop)){
      return "hit";
    }
  }

  //Targets elements with the ID="clayPigeonImage". If this elements is clicked then the ID is removed to get rid of the pigeon as it has been "shot"
  function hitCheckListener(){
    $("#clayPigeonImage").click(function(){
      $(this).remove();
      score = score + 40;
      $("h2").html("Score: " + score)
    });
  }

  //Targets the top container where the pigeon may exist. This creates a div, which contains the pigeon class, which exists within the top container
  function createPigeon(){
    //Create a new div, within the div with ID="container-top", which has an ID="clayPigeonImage" that makes the pigeon
    $("#container-top").append("<div id=\"clayPigeonImage\"></div>");

    // //stop the previous sound of the gun shot so the game is ready to start the new sound
    // shot.stop();

    //Select the size of the pigeon depening on which difficulty mode is currently selected
    $("#clayPigeonImage").css({
      "height": pigeonHeight + "px",
      "width": pigeonWidth + "px"
    });

    //Initialise the listener for if the user misses the pidgeon
    toggleMissListener();

    //Target the ID="clayPigeonImage" so that the clay pigeon can be moved and also the ID="container-top" so that we can calculate collisions
    pigeon = $("#clayPigeonImage");
    board = $("#container-top");

    //Apply a click listener so that if the pigeon is clicked then we remove the pigeon from the screen
    hitCheckListener();
  }

  //If the container where the pigeon may exist is clicked AND the ID corresponding to the pigeon is still present within the HTML then disable the on-click event corresponding to the pigeon div
  function toggleMissListener(){
    $("#container-top").click(function(){
      //If you have clicked and the pigeon has not been hit then remove the ability to click the pigeon
      if($("#clayPigeonImage").length != 0){
        $("#clayPigeonImage").off("click");
      }
    });
  }

  //Function which compares two numbers and returns the largest number
  function highestNumber(num1, num2){
    if(num1 > num2){
      return num1;
    }
    else{
      return num2;
    }
  }

  //New x-coordinate for the pigeon that begins on the left hand side
  function newXLeft(xval){
    xval += 2;
    return xval;
  }

  //New y-coordinate for the pigeon that begins on the left hand side
  function newY(yval){
    yval -= 2;
    return yval;
  }

  //New x-coordinate for the pigeon that begins on the right hand side
  function newXRight(xval){
    xval -= 2;
    return xval;
  }

  //Gun sound
  function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
  }

  //Gun sound event listener
  function gunShotListener(){
    $("#container-top").click(function(){
      //Create gun-audio variable
      var shot = new sound('sound/gunShot.mp3');
      //Play the sound
      shot.play();
    });
  }

  //Restart the game
  function reset(){
    //Reset the pigeon count after each game
    pigeonCount = 0;
    //Find the new potential high score
    var highScore = highestNumber(score, previousScore);
    //Update the highest score
    $("#highestScore").html("High Score: " + highScore);
    //Retain the value of the previous score so we can display the highest score
    previousScore = score;
    //Update the previous score value
    $("#previousScore").html("Previous Score: " + score);
    //Reset the score for the next game
    score = 0;
    //Update the initial score for the next game
    $("h2").html("Score: " + score);
    //Remove the final score text from the previous game
    $("p").remove();
  }

  // -------------------End of Functions------------------

});

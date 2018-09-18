//Run this function for when the page has loaded
$(document).ready(function(){

  // ---------------------Globals---------------------
  //Declare variable to monitor the position of the clay pigeon and the container where the clay pigeon exists
  var pigeon;
  var board;

  //Declare size of the clay pigeon
  var pigeonWidth;
  var pigeonHeight;

  //Declare size of the container where the pigeon can be shot
  var xBoard = 700;
  var yBoard = 300;

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
  $("#btn").click(function(){
    reset();
    playGame();
  });
  // --------------------End of Run Game-------------------

  // ---------------------Functions--------------------
  function playGame(){

    $("#btn").hide();

    var pull = setInterval(function(){
      //If the pigeon doesn't exist, then create it and initialise the movement
      if(($("#clayPigeonImage").length == 0) && (pigeonCount < 3)){
        createPigeon();
        pigeonMovement();
        pigeonCount++;
      }
      else if ((pigeonCount >= 3) && ($("#clayPigeonImage").length == 0)){
        clearInterval(pull);
        $("#btn").show();
        $("#container-top").append("<p>GAME OVER! You scored " + score + " points");
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
        yLeftPos = newYLeft(yLeftPos);
        //Find the positions of the pigeon and board and then evaluate decide if the pigeon has either hit the board or now lies beyond the boundaries of the board
        var testColl = findPosition();
        //If testColl has the value of "1" then we want to stop the setinterval and move on to the next clay pigeon
        if (testColl == 1){
          clearInterval(leftInterval);
          $("#clayPigeonImage").remove();
          score = score - 10;
          $("h2").html("Score: " + score)
        }
      }, 1);
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
        yRightPos = newYRight(yRightPos);
        //Find the positions of the pigeon and board and then evaluate decide if the pigeon has either hit the board or now lies beyond the boundaries of the board
        var testColl = findPosition();
        //If testColl has the value of "1" then we want to stop the setinterval and move on to the next clay pigeon
        if (testColl == 1){
          clearInterval(rightInterval);
          $("#clayPigeonImage").remove();
          score = score - 10;
          $("h2").html("Score: " + score)
        }
      }, 1);
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

    //Initialise the listener for if the user misses the pidgeon
    toggleMissListener();

    //Target the ID="clayPigeonImage" so that the clay pigeon can be moved and also the ID="container-top" so that we can calculate collisions
    pigeon = $("#clayPigeonImage");
    board = $("#container-top");

    //Declare size of the clay pigeon
    pigeonWidth = 70;
    pigeonHeight = 30;

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
    xval++;
    return xval;
  }

  //New y-coordinate for the pigeon that begins on the left hand side
  function newYLeft(yval){
    yval--;
    return yval;
  }

  //New x-coordinate for the pigeon that begins on the right hand side
  function newXRight(xval){
    xval--;
    return xval;
  }

  //New y-coordinate for the pigeon that begins on the right hand side
  function newYRight(yval){
    yval--;
    return yval;
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

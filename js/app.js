//Run this function for when the page has loaded
$(document).ready(function(){

  //Declare global variables

  //Target the ID="clayPigeonImage" so that the clay pigeon can be moved
  var pigeon = $("#clayPigeonImage");
  var board = $("#container-top");

  //Declare size of the clay pigeon
  var pigeonWidth = 30;
  var pigeonHeight = 10;

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

  //Set up a counter to count the number of clay pigeons that have been released
  var missCount = 0;

  //Variable which determines whether the pigeon is released from the right or the left
  var sideChoice;

  //Targets the element with ID=btn and assigns it to a variable named "startBtn"
  var startBtn = document.getElementById("btn");

  //When the start button is clicked then run the function
  startBtn.addEventListener("click", function(){
      pigeonMovement();
  });







  // -------------Functions-------------



  //Function which controls the movement of the clay pigeon
  function pigeonMovement(){
    //Determine whether the pigeon is released from the left or the right
    sideChoice = pigeonStartSide();
    //Pigeon starts from the left
    if (sideChoice == 1){
      // //Initialise the interval time
      // clearInterval(leftInterval);
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
        xLeftPos+=2;
        yLeftPos--;
        //Find the positions of the pigeon and board and then evaluate decide if the pigeon has either hit the board or now lies beyond the boundaries of the board
        var testColl = findPosition();
        console.log(testColl);
        //If testColl has the value of "1" then we want to stop the setinterval and move on to the next clay pigeon
        if (testColl == 1){
          clearInterval(leftInterval);
          $("#clayPigeonImage").remove();
        }
      }, 1);
    }
    //Pigeon starts from the right
    else if (sideChoice == 2){
      // //Initialise the interval time
      // clearInterval(rightInterval);
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
        xRightPos-=2;
        yRightPos--;
        //Find the positions of the pigeon and board and then evaluate decide if the pigeon has either hit the board or now lies beyond the boundaries of the board
        var testColl = findPosition();
        console.log(testColl);
        //If testColl has the value of "1" then we want to stop the setinterval and move on to the next clay pigeon
        if (testColl == 1){
          clearInterval(rightInterval);
          $("#clayPigeonImage").remove();
        }
      }, 1);
    }
  }

  //Finds the positions of the top-container and the clay-pigeon
  function findPosition(){
    //Find left and top edge of the pigeon
    pigeonLeft = pigeon.offset().left;
    console.log("pigeon left = " + pigeonLeft);
    pigeonTop = pigeon.offset().top;
    console.log("pigeonTop = " + pigeonTop);

    //Find right edge of the pigeon
    pigeonRight = pigeonLeft + pigeon.width();
    console.log("pigeonRight = " + pigeonRight);

    //Find left and top edge of the board
    boardLeft = board.offset().left;
    console.log("boardLeft = " + boardLeft);
    boardTop = board.offset().top;
    console.log("boardTop = " + boardTop);

    //Find right edge of the board
    boardRight = boardLeft + board.width();
    console.log("boardRight = " + boardRight);

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
      $("clayPigeonImage").remove();
    });
  }

  //Targets the top container where the pigeon may exist. This creates a div, which contains the pigeon class, which exists within the top container
  function createPigeon(){
    $("#container-top").append("<div id=\"clayPigeonImage\"></div>");
    hitCheckListener();
  }








});

//------------The Game-----------

//Create a second container which will be the "grass" and where the gun will be placed.

//The clay pidgeon will be shot randomly from the far left and far right of the grass/sky boundary

//The user has one shot to hit the pidgeon

//If the pidgeon is hit, then it disapears and the user gets x points. If the pidgeon is not hit, when it reaches the boundary of the container then it disapears

//If the user misses then he loses points and when the pidgeon hits the boundary of the container it disapears and the gun reloads with a single bullet again for the next Pidgeon

//There is an interval of time, say 5 seconds, where the pidgeon will be released

//Each round will consist of a number of pidgeons, say 10, rather than a time limit

//Have a condition where if either the clay pidgeon has been clicked or the pidgeon has hit the boarder of the container then start the next event of a pidgeon being released

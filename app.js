let config = {
  width:300,
  height:600,
  rows:6,
  cols:4,
  speed:4,
  interval:20,
 
}


config.height = window.innerHeight-2;
config.defaultSpeed = config.speed;
var score = 0;
var scoreElement;
var startGameElement,endGameElement;
var scoreElement;
var gameLoop;
var tileRows = [];
var gameCanvas;
var gameContext;
var isGameStarted = false;
var audio = new Audio('audio.mp3');
var badaudio = new Audio('sad_piano.mp3');


function playAudio() { 
  audio.play(); 
} 
function playBad() { 
  badaudio.play(); 
} 

function stopAudio() { 
  audio.pause(); 
} 
document.addEventListener("DOMContentLoaded",function(){
 
nav=document.querySelector("nav");
  gameCanvas=document.getElementById("gameCanvas");
  scoreElement = document.getElementById("score");
  startGameElement = document.getElementById("gameStart");
  endGameElement = document.getElementById("gameEnd");
  gameContext=gameCanvas.getContext("2d");
  gameCanvas.style.width=config.width+"px";
  gameCanvas.style.height=config.height+"px";
  gameCanvas.setAttribute("width",config.width);
  gameCanvas.setAttribute("height",config.height);
  gameContext.lineWidth = 0.5;
  initGame();
},null);

function addRow() {
  var black_index = Math.floor(Math.random()*config.cols);
  var tile_width = config.width/config.cols;
  var tile_height = config.height/config.rows;
  var y = config.height;
  if(tileRows.length>0){
    var lastRow = tileRows[tileRows.length-1];
    y = lastRow.y + lastRow.height;
  }
  var row = {
    x:0,
    y:y,
    width:config.width,
    height:config.height/config.rows,
    tileWidth:tile_width,
    tileHeight:tile_height,
    color:"#FFFFFF",
    text:["A","S","D"],
    black:{
      index:black_index,
      color:"#000000"
    },
    increament:function(){
      if(this.y<=0){
       
        if(!this.isValid){
     
          stopGameLoop();
          this.y-=config.speed;
          displayWrongTile(this,this.black.index);
          return;
        }
      }
      this.y = this.y - config.speed;

    },
    decreament:function(){
      this.y = this.y + config.speed;
    },
    isValid:false
  };
  tileRows.push(row);
}


function displayRow(row) {
  gameContext.fillStyle = row.color;
  gameContext.fillRect(0,row.y,row.width,row.height);
  for(var i=0;i<config.cols;i++){
    gameContext.strokeRect(i*row.tileWidth,
      row.y,
      row.tileWidth,
      row.tileHeight)
      ;

      if(row.black.index==i){
   
        gameContext.fillStyle = row.black.color;
        gameContext.fillRect(i*row.tileWidth,
          row.y,
          row.tileWidth,
          row.tileHeight);
        }
      }
      row.increament();
    }
    function startGameLoop() {
      gameLoop = setInterval(function(){
        displayAllRow();
      },config.interval);
    }
    function displayAllRow() {
      gameContext.clearRect(0,0,config.width,config.height);
      for(var i=0;i<tileRows.length;i++){
        displayRow(tileRows[i]);
      }
    }

    function stopGameLoop() {
      clearInterval(gameLoop);
      gameCanvas.removeEventListener("click",handleGameUserInput);
      document.querySelector(".total").innerText=`your score :${score}`;
    

      endGameElement.style.display="block";

      stopAudio();
      playBad();
    }

    function handleGameUserInput(e) {
      if(!isGameStarted){
        isGameStarted = true;
        startGameLoop();
        audio.currentTime=2.5;
        playAudio();
      }
      var tile_width = config.width/config.cols;
      var tile_height = config.height/config.rows;
      var x = e.clientX - gameCanvas.offsetLeft;
      var y = e.clientY - gameCanvas.offsetTop;
      var clicked_row = Math.ceil(y/tile_height) - 1;
      var clicked_col = Math.ceil(x/tile_width) - 1;
      
     
 
      for(var i=0;i<tileRows.length;i++){
        var row = tileRows[i];
        if (row.y<y && row.y+row.height>y) {
          if(clicked_col===row.black.index){
            if(!row.isValid){
              row.isValid = true;
              row.black.color="#AAAAAA";
              score++;
              scoreElement.innerHTML = score;
              document.querySelector(".score").innerText=` score :${score}`;
              addRow();
            }
            else{
              stopGameLoop();
              displayWrongTile(row,clicked_col);
        
              stopAudio();
            }
          }else{
            stopGameLoop();

            displayWrongTile(row,clicked_col);
          
            stopAudio();

          }
          break;
        }
      }
    }

    function displayWrongTile(row,col_number) {
      gameContext.fillStyle = "#FF0000";
      row.decreament();
      gameContext.fillRect(col_number*row.tileWidth,row.y,row.tileWidth,row.tileHeight);
    }

    function initGame() {
      gameContext.clearRect(0,0,config.width,config.height);
      for(var i=0;i<config.rows;i++){
        addRow();
      }
      for(var j=0;j<50;j++){
        for(var i=0;i<tileRows.length;i++){
          tileRows[i].increament();
        }
      }
      for(var i=0;i<tileRows.length;i++){
        displayRow(tileRows[i]);
      }
    }


    function startGame() {
      endGameElement.style.display="none";
      startGameElement.style.display="none";
      gameCanvas.addEventListener("click",handleGameUserInput);
nav.style.display='none';
      // audio.currentTime=2;
      // playAudio();
    }
    function restartGame() {
      tileRows = [];
      score = 0;
      isGameStarted = false;
      config.speed = config.defaultSpeed;
      scoreElement.innerHTML = score;
      endGameElement.style.display="none";


      initGame();
      startGame();
      // setTimeout(startGame,1000);

    }







    /////////////////////




  

  

    
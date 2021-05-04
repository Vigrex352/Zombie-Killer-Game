var PLAY = 1;
var END = 0;
var gameState = PLAY;
var bullet,bullImg;

var obstacle;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var bg;
var score,x=0;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;
  

function preload(){
  trex_running = loadImage("playerNew.png");
  trex_collided = loadImage("injured.png");
  bullImg=loadImage("bullet.png");
  groundImage = loadImage("ground2.png");
 
  cloudImage = loadImage("cloud.png");
 
  obstacle1 = loadImage("zombie1.png");
  obstacle2 = loadImage("zombie2.png");
  obstacle3 = loadImage("zombie3.png");
  obstacle4 = loadImage("zombie4.png");
  obstacle5 = loadImage("zombie5.png");
  obstacle6 = loadImage("zombie4.png");
 bg=loadImage("bg.jpg")
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
 
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  

  var message = "This is a message";
 console.log(message)
 
 
  obstacle=createSprite(500,190,10,10);
  obstacle.visible=false;
 
  trex = createSprite(50,190,20,50);
  trex.addImage(trex_running);
  trex.scale=0.1;

  
  bullet = createSprite(30,160,10,10);
  bullet.visible=false;
  bullet.addImage(bullImg);
  bullet.scale=0.1;
 
  ground = createSprite(300,-310,600,20);
  ground.addImage(bg);
  ground.scale=1.3
  ground.x = ground.width /2;
 
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
 
  restart = createSprite(300,140);
  restart.addImage(restartImg);
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
 
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
 
  //create Obstacle and Cloud Groups
  cloudsGroup = createGroup();

 
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false
 
  score = 0;
 
}

function draw() {
 
  background(bg);
  //displaying score
  text("Score: "+ score, 500,50);
 
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
   
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = x*10;
   
    if(score>0 && score%100 === 0){
       checkPointSound.play()
    }
   
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
   
    //jump when the space key is pressed
    if(keyDown("space")) {
      bullet.visible=true;
      bullet.velocityX=3;
    }
    
   
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
 
    //spawn the clouds
    spawnClouds();
    
      if (frameCount % 150 === 0){
   obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle          
    obstacle.scale = 0.1;
      }
   
    if(obstacle.isTouching(bullet)){
    console.log("inside");
      obstacle.destroy();
      bullet.destroy();
      x=x+1;
      
  bullet = createSprite(30,160,10,10);
  bullet.visible=false;
  bullet.shapeColor="orange";
  bullet.addImage(bullImg);
  bullet.scale=0.1;
      
    }
    
    if(obstacle.isTouching(trex)){
    console.log("inside");
      dieSound.play()
    gameState=END;
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
      ground.velocityX = 0;
      trex.velocityY = 0
      //set lifetime of the game objects so that they are never destroyed
 
     obstacle.velocityX=0;
    cloudsGroup.setLifetimeEach(-1);
     cloudsGroup.setVelocityXEach(0);
     
     if(mousePressedOver(restart)) {
      reset();
    }
   }
  //stop trex from falling down
  trex.collide(invisibleGround);

  drawSprites();
}

function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score=0
 
}


function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,60,40,10);
    cloud.y = Math.round(random(50,80));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
   
     //assign lifetime to the variable
    cloud.lifetime = 200;
   
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
   
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
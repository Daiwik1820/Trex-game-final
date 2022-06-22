var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0, score1=0;
var jumpSound, collidedSound;

var gameOver, gameOverImg, restart, replay, replayImg;

var heart1, heart2, heart3, heart1Img, heart2Img, heart3Img;

var ia = 0;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  backgroundImg = loadImage("backgroundImg.png")
  sunAnimation = loadImage("sun.png");
  
  trex_running = loadAnimation("trex_2.png","trex_1.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  replayImg = loadImage("replay.png")

  heart1Img = loadImage("heart1.png");
  heart2Img = loadImage("heart2.png");
  heart3Img = loadImage("heart3.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-100,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.15
  
  trex = createSprite(50,height-70,20,50);
  
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,350)
  trex.scale = 0.08
  // trex.debug=true
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = (6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);

  replay = createSprite(770, 300);
  replay.addImage(replayImg);

  heart1 = createSprite(130, 70);
  heart1.addImage(heart1Img);

  heart2 = createSprite(180, 70);
  heart2.addImage(heart2Img);

  heart3 = createSprite(230, 70);
  heart3.addImage(heart3Img);

  gameOver.scale = 0.5;
  restart.scale = 0.1;
  replay.scale = 0.3;
  heart1.scale = 0.1;
  heart2.scale = 0.1;
  heart3.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  replay.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,0,75);
    
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      jumpSound.play( )
      trex.velocityY = -10;
       touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        collidedSound.play()
        gameState = END;

    }
  }
  else if (gameState === END) {
    
    if(ia==0 || ia==1 || ia==2 ){
      gameOver.visible = false;
      restart.visible = true;
      replay.visible = true;

    }

    if (ia==3) {
      gameOver.visible= true
      gamestate= END
    }
   
    

    

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {  
      ia=ia+1;
      if(ia==1){
        text("IA Value"+ ia ,400,400);
        heart1.visible = true;
        heart2.visible = true;
        heart3.visible = false;
        reset();
        
      }
        if(ia==2){
          text("IA Value"+ ia ,400,400);
          heart1.visible = true;
          heart2.visible = false;
          heart3.visible = false;
          reset();
          
        }
     
        if (ia==3) {
          text("IA Value"+ ia ,400,400);
          heart1.visible = false;
          heart2.visible = false;
          heart3.visible = false;
          reset();
          
        }
        if(ia==4){
          
          restart.visible = false;
          replay.visible = false;
          obstaclesGroup.destroyEach();
          cloudsGroup.destroyEach();
          sun.visible=false;
          score=0;
          trex.visible=false;
          ground.visible=false;
          gameOver.visible = true;
          if (keyDown("space")) {
            gamestate=== END;
          }
        }
      
      touches = []
    }
    
  }

  
   drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

if(ia==4) {
  reset();
  gamestate= END
}
  


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  replay.visible = false
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
    
  score = 0;
  
}


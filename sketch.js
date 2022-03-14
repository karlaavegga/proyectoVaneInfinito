var PLAY = 1;
var END = 0;
var gameState = PLAY;

var gato, gato_running, gato_collided;
var ground, invisibleGround;
var obstaclesGroup, obstacle1;
var backgroundImg;
var score = 0;
var gameOver, restart;

function preload(){
  backgroundImg = loadImage("street.jpg");
  
  gato_running = loadAnimation("Gato/gato1.png","Gato/gato2.png","Gato/gato3.png","Gato/gato4.png", "Gato/gato5.png")

  gato_collided = loadAnimation("gatomojado.jpg","gatomojado.jpg");
  obstacle1 = loadImage("agua.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("reset.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  gato = createSprite(50,height-70,20,50);
  gato.addAnimation("running", gato_running);
  gato.addAnimation("collided", gato_collided);
  gato.setCollider('circle',0,0,350);
  gato.scale = 0.08;
  gato.debug = true;
  
  invisibleGround = createSprite(width/2, height/2-10,width,125);
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.x = width/2;
  ground.velocityX = -(6+3*score/100);
  
  gameOver = createSprite(width/2, height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;
  
  gameOver.visible = false;
  restart.visible = false;
  //invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  
  score = 0;
  
}

function draw() {
  gato.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black");
  text("Score: "+score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6+3*score/100);
    
    if((touches.lenght > 0 || keyDown("SPACE")) && gato.y > height-120){
      gato.velocityY = -10;
      touches = [];
    }
    
    gato.velocityY = gato.velocityY + 0.8;
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    gato.collide(invisibleGround);
    spawnObstacles();
    
    if (obstaclesGroup.isTouching(gato)){
      gameState = END;
    }
  }
  else if (gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    
    //set velocity of each game object to 0
    
    ground.velocityX = 0;
    gato.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    //change gato animation
    gato.changeAnimation("collided", gato_collided);
    
    //set lifetime to the game objects
    obstaclesGroup.setLifetimeEach(-1);
    
    if(touches.lenght>0 || keydown ("SPACE")){
      reset();
      touches = [];
    }
  }
  
  drawSprites();
}

function spawnObstacles (){
  if(frameCount % 60 === 0){
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45);
    obstacle.debug = true
    
    obstacle.velocityX = -(6+3*score/100);
    
    obstacle.scale = 0.9;
    obstacle.lifetime = 300;
    obstacle.depth = gato.depth;
    gato.depth +=1;
    
    obstaclesGroup.add(obstacle);
  }
}

function reset (){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  gato.changeAnimation("running",gato_running);
  
  score = 0;
}

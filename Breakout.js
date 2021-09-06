let screenWidth;
let screenHeight;

let ball_spX = 4;
let ball_spY = 4;
let ball_dia = 10;

let game;
let ball;
let bar;
let button1;
let blocks= [];
let blocks_ver= [];

function setup() {
  screenWidth = 400;
  screenHeight = 400;
  createCanvas(screenWidth, screenHeight);
  gameInit("ready");
}

function gameInit(mode){
  ball = new Ball(screenWidth / 2, screenHeight - 70, ball_spX, -ball_spY, ball_dia);
  bar = new Bar(screenWidth / 2, screenHeight - 60, 4, 20, 100);
  blocks = new Blocks();
  game = new Game(mode);
  blocks.init();
}

function draw() {
  background(255);
  game.play();
}

class Game {
  constructor(mode) {
    this.mode = mode
  }

  play() {
    switch(this.mode){
      case 'ready':
        this.ready()
        break;
      case 'play':
        this.start()
        break;
      case 'gameover':
        this.gameoverText()
        break;
    }
  }

  ready(){
    fill(0);
    textAlign(CENTER);
    text("BreakOut", screenWidth/2, screenHeight/2);
    fill(256);
    this.start_button(screenWidth/2, screenHeight/2)
  }

  start() {
    bar.display();
    ball.display();
    blocks.display();
  }
  
  end() {
    this.mode = "gameover";
  }

  gameoverText(){
    fill(0);
    textAlign(CENTER);
    text("Game Over", screenWidth/2, screenHeight/2);
    fill(256);
    this.return_button(screenWidth/2, screenHeight/2)
  }

  start_button(posX, posY){
    rect(posX - 45, posY + 100, 90, 30);
    fill(0);
    text("Start", posX, posY+120);
    fill(256);
    if(posX - 45 <= mouseX && mouseX <= posX + 55 &&
      posY + 100 <= mouseY && mouseY <= posY + 150
      ){
      if(mouseIsPressed){
        gameInit("play")
        this.mode = "play";
      }
    }
  }

  return_button(posX, posY){
    rect(posX - 45, posY + 100, 90, 30);
    fill(0);
    text("One More", posX, posY+120);
    fill(256);
    if(posX - 45 <= mouseX && mouseX <= posX + 55 &&
      posY + 100 <= mouseY && mouseY <= posY + 150
      ){
      if(mouseIsPressed){
        gameInit("play")
        this.mode = "play";
      }
    }
  }
}

class Ball {
  constructor(posX, posY, spX, spY, dia) {
    this._positionX = posX;
    this._positionY = posY;
    this._speedX = spX;
    this._speedY = spY;
    this._diameter = dia;
  }

  getPosX() {
    return this._positionX;
  }
  getPosY() {
    return this._positionY;
  }
  getDia() {
    return this._diameter;
  }

  setPositionX(posX){
    this._positionX = posX;
  }

  setPositionY(posY){
    this._positionY = posY;
  }

  display() {
    ellipse(this._positionX, this._positionY, this._diameter, this._diameter);
    this.move();
  }

  move() {
    // reflect x
    if (this._positionX > screenWidth - this._diameter / 2) {
      this.boundX();
    }
    if (this._positionX < this._diameter / 2) {
      this.boundX();
    }

    // reflect y
    if (this._positionY > screenHeight - this._diameter / 2) {
      this.boundY();
      game.end();
    }
    if (this._positionY < this._diameter / 2) {
      this.boundY();
    }
    this._positionX = this._positionX + this._speedX;
    this._positionY = this._positionY + this._speedY;
  }
  boundX() {
    this._speedX = -this._speedX;
  }
  boundY() {
    this._speedY = -this._speedY;
  }
}

class Bar {
  constructor(posX, posY, spX, bHeight, bWidth) {
    this._positionX = posX;
    this._positionY = posY;
    this._speedX = spX;
    this._barWidth = bWidth;
    this._barHeight = bHeight;
  }

  display() {
    this.collisionBallCheck();
    rect(this._positionX, this._positionY, this._barWidth, this._barHeight);
    this.move();
  }

  move() {
    if (keyIsPressed) {
      if (keyCode == RIGHT_ARROW) {
        this._positionX = this._positionX + this._speedX;
      }
      if (keyCode == LEFT_ARROW) {
        this._positionX = this._positionX - this._speedX;
      }
    }

    if (this._positionX < 0) {
      this._positionX = 0;
    }
    if (this._positionX + this._barWidth > screenWidth) {
      this._positionX = screenWidth - this._barWidth;
    }
  }

  collisionBallCheck() {
    if (
      // top collision
      ball._positionY + ball._diameter / 2 >= this._positionY &&
      ball._positionY - ball._diameter / 2 <= this._positionY + this._barHeight &&
      this._positionX <= ball._positionX &&
      ball._positionX <= this._positionX + this._barWidth
    ) {
      ball.boundY();
    } else if (
      // left collision
      ball._positionX + ball._diameter / 2 >= this._positionX &&
      ball._positionX - ball._diameter / 2 <=
        this._positionX + this._barWidth &&
      ball._positionY + ball._diameter / 2 >= this._positionY &&
      ball._positionY - ball._diameter / 2 <= this._positionY + this._barHeight
    ) {
      ball.boundX();
    } else if (
      // right collision
      ball._positionX - ball._diameter / 2 <=
        this._posiotionX + this._barWidth &&
      ball._positionX + ball._diameter / 2 >= this._positionX &&
      ball._positionY + ball._diameter / 2 >= this._positionY &&
      ball._positionY - ball._diameter / 2 <= this._positionY + this._barHeight
    ) {
      ball.boundX();
    } else if (
      // under collision
      ball._positionY - ball._diameter / 2 <=
        this._positionY + this._barHeight &&
      ball._positionY + ball._diameter / 2 >= this._positionY &&
      ball._positionX + ball._diameter / 2 >= this._positionX &&
      ball._positionX - ball._diameter / 2 <= this._positionX + this._barWidth
    ) {
      ball.boundY();
    }
  }
}

class Blocks{
  constructor(){
    this.blocks_0 = []; 
    this.blocks_1 = []; 
    this.blocks_2 = []; 
    this.blocks_line = 5
    this.block_width = 70;
    this.block_height = 30;
  }
  
  init(){
    for(let i = 0; i < this.blocks_line; i++){
      this.blocks_0.push(new Block(25 + i*this.block_width, 30, this.block_width, this.block_height));
      this.blocks_1.push(new Block(25 + i*this.block_width, 60, this.block_width, this.block_height));
      this.blocks_2.push(new Block(25 + i*this.block_width, 90, this.block_width, this.block_height));
    }
  }
  
  display(){
    for(let i = 0; i < this.blocks_line ;i++){
      this.blocks_0[i].display();
      this.blocks_1[i].display();
      this.blocks_2[i].display();
    }
  }
}

class Block {
  constructor(positionX, positionY, blockWidth, blockHeight) {
    this._positionX = positionX;
    this._positionY = positionY;
    this._blockWidth = blockWidth;
    this._blockHeight = blockHeight;
    this.visible = true;
  }
  display() {
    if (this.visible) {
      this.collisionBallCheck();
      rect(
        this._positionX,
        this._positionY,
        this._blockWidth,
        this._blockHeight
      );
    }
  }
  collisionBallCheck() {
  if (
      // top collision
      ball._positionY + ball._diameter / 2 >= this._positionY &&
      ball._positionY - ball._diameter / 2 <= this._positionY + this._blockHeight &&
      this._positionX <= ball._positionX &&
      ball._positionX <= this._positionX + this._blockWidth
    ) {
      ball.boundY();
      this.visible = false;
    } else if (
      // left collision
      ball._positionX + ball._diameter / 2 >= this._positionX &&
      ball._positionX - ball._diameter / 2 <=
        this._positionX + this._blockWidth &&
      ball._positionY + ball._diameter / 2 >= this._positionY &&
      ball._positionY - ball._diameter / 2 <= this._positionY + this._blockHeight
    ) {
      ball.boundX();
      this.visible = false;
    } else if (
      // right collision
      ball._positionX - ball._diameter / 2 <=
        this._posiotionX + this._blockWidth &&
      ball._positionX + ball._diameter / 2 >= this._positionY &&
      ball._positionY + ball._diameter / 2 >= this._positionY &&
      ball._positionY - ball._diameter / 2 <= this._positionY + this._blockHeight
    ) {
      ball.boundX();
      this.visible = false;
    } else if (
      ball._positionY - ball._diameter / 2 <=
        this._positionY + this._blockHeight &&
      ball._positionY + ball._diameter / 2 >= this._positionY &&
      ball._positionX + ball._diameter / 2 >= this._positionX &&
      ball._positionX - ball._diameter / 2 <= this._positionX + this._blockHeight
    ) {
      ball.boundY();
      this.visible = false;
    }
  }
}

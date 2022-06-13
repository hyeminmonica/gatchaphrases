//해야할 것들....
//코딩이해하고 이미지 넣기...!
//셔플링 되는 것 이해하기. let ballNum = [];


//let extraCanvas;
let balls = []; 
let bigBubble; 
let index = 0;
let number = 0;
let words = [
  "피할 수 없으면 즐겨라.",
  "언제나 현재에 집중할 수 있다면 행복할 것이다.",
  "내 비장의 무기는 아직 손 안에 있다. 그것은 희망이다.",
  "지옥을 겪고 있다면 계속 겪어 나가라.",
  "작은 일에도 최대한 기뻐하라. 마치 어린아이들처럼 싱글벙글 웃어라.",
  "무슨 일을 하더하도 자신을 사랑하는 것으로부터 시작하라.",
  "그냥 좀 해! Just Do It!",
  "Stay Hungry! Stay Foolish! 안주하지 말라.",
  "모든 열쇠는 내가 쥐고 있다.",
  "다른 사람의 마음을 발견함으로써 스스로를 넓혀간다.",
  "아직 늦지 않았어요, 록스타가 되기에!"
];

// let src1,src2,src3,src4,src5,src6,src7,src8,src9,src10,src11; 

let src = [];
function preload(){
  customFont1 = loadFont("designhouseOTFLight.otf");
  customFont2 = loadFont("IBMPlexSansKR-Regular.otf");
  customFont3 = loadFont("designhouseOTFBold.otf");
  src[0] = createImg("0.png");
  src[1] = loadImage("1.png");
  src[2] = loadImage("2.png");
  src[3] = loadImage("3.png");
  src[4] = createImg("4.png");
  src[5] = loadImage("5.png");
  src[6] = loadImage("6.png");
  src[7] = createImg("7.png");
  src[8] = loadImage("8.png");
  src[9] = loadImage("9.png");
  src[10] = loadImage("10.png");
  
  // img.loadPixels();
}

let ballNum = [];

//*******************************************
function setup() {
  createCanvas(windowWidth, windowHeight);
  // extraCanvas = createGraphics(windowWidth,windowHeight);
  // extraCanvas.clear();
  
   //src배열의 인덱스 값들을 무작위한 순서로 가지고 있을 배열입니다. 
  let tempIndexArr = []; // 0, 1, 2, ..10 순서의 배열이
  for (let i = 0; i < 11; i++){
    tempIndexArr.push(i);
  }
  shuffle(tempIndexArr, true); // 무작위로 섞이게 됩니다
  
  for(let i=0; i<11; i++){
  balls.push(new Ball(
    createVector(random(width),random(height)),
    p5.Vector.random2D().mult(random(10)),
    // tempIndexArr[i]: 무작위순서의 인덱스를 보내줬으니 사진도 무작위 (하지만 반복이 없는)하게 배정. 
    random(30,65), color(random(255),random(255),random(255)), tempIndexArr[i]));  
  }
  
  bigBubble = new Bubble(width/2, height/2, 260);
  imageMode(CENTER);
  
}

//*******************************************
function draw() {
  background(255);

  
  if (index == 0){
    bigBubble.draw(); 
    textAlign(CENTER, CENTER);
    fill(255, 140, 242);
    textFont(customFont1);
    textSize(50);
    text("catch the phrase!", windowWidth/2, windowHeight/2);
    if (mouseIsPressed) {
       index++; 
    }
  } else {
      
    
    for(let i=0; i<balls.length; i++){
      if (!balls[i].clicked){
        for(let j=0; j<balls.length; j++){
          if (i!=j && !balls[j].clicked){
            balls[i].collide(balls[j]);
          }
        }
      }
      
      balls[i].move();
      balls[i].draw();
    }

    for(let i=0; i<ballNum.length; i++){
      //+텍스트 순서대로 하나씩 display....
        /*
        if (mouseIsPressed === true){
            image(src[ballNum[i]],mouseX,mouseY,250,250);
        }
      
        */
        strokeWeight(1);
        textAlign(CENTER,CENTER);
        textFont(customFont1);
        textSize(27);
        fill(0);
        text(words[ballNum[i]],width/2,55*i +90);
    }
  } 
}

function mousePressed(){  
  for (let i = 0; i <balls.length; i++){
     if (!balls[i].clicked) {
       if (balls[i].contains(mouseX,mouseY)) {
         balls[i].clicked = true;
         ballNum.push(i);
         break;
        }
       }
  }
}

//*******************************************
//intro화면의 스타트를 위한 버블
class Bubble{
  constructor(x,y,r){
    this.x = x; 
    this.y = y;
    this.r = r; 
    //this.color = color;
  }
  
  draw(){
    fill(204, 255, 84);
    noStroke();
    ellipse(this.x,this.y,this.r*2);
  }
 }

//*******************************************
//유영하는 뽑기 캡슐들...
class Ball{
  constructor(pos, vel, radius, color, imageIndex){
    this.pos = pos; 
    this.vel = vel; 
    this.radius = radius; 
    this.color = color; 
    this.clicked = false; 
    // 덕 - src 배열에 있는 이미지의 인덱스
    this.imageIndex = imageIndex;
   }
  
  
  
  //서로 부딫히는 원들
  collide(other){
    if(other == this){
      return;
    }
    let relative = p5.Vector.sub(other.pos, this.pos);
    let gap = relative.mag() - (this.radius + other.radius);
    if(gap<0){
      let movement = relative.copy().setMag(abs(dist/2));
      this.pos.sub(movement);
      other.pos.add(movement);
      
      let thisToOtherNormal = relative.copy().normalize();
      let approachSpeed = this.vel.dot(thisToOtherNormal) + -other.vel.dot(thisToOtherNormal);
      let approachVector = thisToOtherNormal.copy().setMag(approachSpeed);
      this.vel.sub(approachVector);
      other.vel.add(approachVector);
   }
  }
  
  move(){
    if (!this.clicked){
      this.vel.y -= 0.1; //중력 더하기
      this.pos.add(this.vel);

      //랩핑, 화면 안에서 바운스 되게끔 하기
      if(this.pos.x < this.radius){
        this.pos.x = this.radius; 
        this.vel.x = -this.vel.x;
      }
       if(this.pos.x > width-this.radius){
        this.pos.x = width-this.radius; 
        this.vel.x = -this.vel.x;
      }
      if(this.pos.y < this.radius) {
        this.pos.y = this.radius; 
        this.vel.y = -this.vel.y;
      }
      if(this.pos.y > height-this.radius){
        this.pos.y = height-this.radius; 
        this.vel.y = -this.vel.y;
     }
    }
    //클릭이 된 상태에서는 더이상 위치를 갱신할 필요가 X
  }
  
  draw(){
   
    if (!this.clicked){
      fill(this.color);
      ellipse(this.pos.x, this.pos.y, this.radius*2);
    }
 
    else{
      
      image(src[this.imageIndex], this.pos.x, this.pos.y, 150, 150);
    }
  }
  
  
  contains(px, py){
    let d = dist(px, py, this.pos.x, this.pos.y);
    if (d < this.radius){ 
      this.clicked = true;
      
      return true;
    } else {
      return false;
    }
   }
  }


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
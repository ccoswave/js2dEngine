
var canvas = document.getElementById('surf');
var ctx = canvas.getContext('2d');
var W = canvas.width;
var H = canvas.height;

var sin = Math.sin;
var cos = Math.cos;
var angle = Math.atan2;
var sqrt = Math.sqrt
var pow = Math.pow;
var rand = Math.random;
var pi = Math.PI;
var tau = Math.PI*2;
var floor = Math.floor;
var abs = Math.abs;

function pointDir (x0,y0,x1,y1) {
  return angle(x1-x0,y0-y1);}

function pointDist (x0,y0,x1,y1) {
  return sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1));}

function dist (obj1,obj2) {
  return pointDist(obj1.x,obj1.y,obj2.x,obj2.y);}


var k_up = false
var k_down = false
var k_left = false
var k_right = false
var k_ctrl = false
var k_A = false
var k_B = false
var k_C = false


function keydown(evt) {
  console.log('key: ',evt.key)
  if (evt.key == 'ArrowUp') {k_up = true}
  if (evt.key == 'ArrowDown') {k_down = true}
  if (evt.key == 'ArrowLeft') {k_left = true}
  if (evt.key == 'ArrowRight') {k_right = true}
  if (evt.key == 'Shift') {k_A = true}
  if (evt.key == 'z') {k_B = true}
  if (evt.key == 'x') {k_C = true}
  if (evt.key == 'Control') {k_ctrl = true}}
window.addEventListener('keydown',keydown,false)


function keyup(evt) {
  if (evt.key == 'ArrowUp') {k_up = false}
  if (evt.key == 'ArrowDown') {k_down = false}
  if (evt.key == 'ArrowLeft') {k_left = false}
  if (evt.key == 'ArrowRight') {k_right = false}
  if (evt.key == 'Shift') {k_A = false}
  if (evt.key == 'z') {k_B = false}
  if (evt.key == 'x') {k_C = false}
  if (evt.key == 'Control') {k_ctrl = false}}
window.addEventListener('keyup',keyup,false)

// sounds
var audio = new Audio('wntic.wav');






function Controller() {
  this.move = [0,0]
  this.jump = 0
  this.punch = 0}
Controller.prototype.update = function () {
  this.move = [0,0]
  this.jump = 0
  this.punch = 0
  if (k_up) {this.move[1]=-1}
  if (k_down) {this.move[1]=1}
  if (k_left) {this.move[0]=-1}
  if (k_right) {this.move[0]=1}
  if (k_ctrl) {this.jump = 1}
  if (k_A) {this.punch = 1}}

function PlayerBot() {}

function Drone(x,y) {
  this.type = 'drone'
  this.x = x
  this.y = y
  this.z = 0
  this.zsp = 0
  this.strike = 0
  this.tgt = player1
  this.health = 20}
Drone.prototype.update = function () {
  if (this.strike>0) {this.strike--}
  if (this.strike==0) {
      audio.play();
      this.strike = 16}
  if (this.y>this.tgt.y) {
    this.y--}
  if (this.y<this.tgt.y) {
    this.y++}
  if (this.x-32>this.tgt.x) {
    this.x--}
  if (this.x+32<this.tgt.x) {
    this.x++}
  if (this.tgt.strike==16&&dist(this,this.tgt)<=32) {this.health-=10}
  for (oc=0;oc<objects.length;oc++) {
    if (objects[oc]!=this) {
      if (objects[oc].type=='fighter') {
        if (abs(objects[oc].x-this.x)<16
          &&abs(objects[oc].y-this.y)<16) {}}}}
  if (this.health<=0) {this.destroy()}}
Drone.prototype.destroy = function () {
  index = objects.indexOf(this)
  objects.splice(index,1)}
Drone.prototype.render = function () {
  ctx.fillStyle = '#ff0000'
  ctx.beginPath();
  ctx.arc(this.x,this.y-this.z,16,0,2*Math.PI);
  ctx.fill()
  ctx.strokeStyle = '#ff0000'
  ctx.beginPath();
  ctx.arc(this.x,this.y-this.z,16+this.strike,0,2*Math.PI);
  ctx.stroke()
}

function Fighter(inputs) {
  this.type = 'fighter'
  this.ctrl = inputs
  this.x = W/2
  this.y = H/2
  this.z = 0
  this.zsp = 0
  this.strike = 0
  this.health = 100}
Fighter.prototype.update = function () {
  this.ctrl.update()
  this.x += this.ctrl.move[0]
  this.y += this.ctrl.move[1]
  if (this.strike>0) {this.strike--}
  if (this.strike==0) {
    if (this.ctrl.punch) {
      audio.play();
      this.strike = 16}}
  if (this.z==0) {
    if (this.ctrl.jump) {this.zsp = 10}}
  else if (this.z>0) {this.zsp--} 
  this.z += this.zsp
  if (this.z<0) {
    this.zsp=0
    this.z=0}
  for (oc=0;oc<objects.length;oc++) {
    tgt = objects[oc]
    if (tgt.strike==16&&dist(this,tgt)<=32) {this.health-=10}}
  
  for (oc=0;oc<objects.length;oc++) {
    if (objects[oc]!=this) {
      if (objects[oc].type=='drone') {
        if (abs(objects[oc].x-this.x)<16
          &&abs(objects[oc].y-this.y)<16) {this.health--}}}}
  if (this.health<=0) {this.x=0;this.y=0;reset()}}
Fighter.prototype.render = function () {
  ctx.fillStyle = '#0000ff'
  ctx.beginPath();
  ctx.arc(this.x,this.y-this.z,16,0,2*Math.PI);
  ctx.fill()
  ctx.strokeStyle = '#0000ff'
  ctx.beginPath();
  ctx.arc(this.x,this.y-this.z,16+this.strike,0,2*Math.PI);
  ctx.stroke()
}

function Camera() {
  this.x = 0}



function reset() {
  console.log('reset')
  objects = []  
  player1 = new Fighter(new Controller())  
  objects.push(player1)
  }

reset()
var t=0
var camera = new Camera()
var player1 = new Fighter(new Controller())
var objects = []
objects.push(player1)

function execute () {
  function loop () {
    
    ctx.lineCap = 'round';
    ctx.lineWidth = 2
    ctx.strokeStyle = '#332722'
    ctx.fillStyle = '#332722'
    ctx.clearRect(0,0,W,H)
    ctx.strokeRect(0,0,W,H)
    ctx.lineWidth = 2

    ctx.strokeStyle = '#665544'

    if (objects.length<8) {
      objects.push(new Drone(Math.random()*W,Math.random()*H))}

    ctx.font = "12pt courier";
    for (o=0;o<objects.length;o++) {
      objects[o].update()}
    for (o=0;o<objects.length;o++) {
      objects[o].render()}
    ctx.strokeRect(8,8,100,8)
    ctx.fillRect(8,8,player1.health,8)
    t++
    setTimeout(loop,30)}
  loop()
}
execute()
        
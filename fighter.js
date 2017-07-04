
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
var menupopup = 0

function keydown(evt) {
  console.log('key: ',evt.key)
  if (evt.key == 'ArrowUp') {k_up = true}
  if (evt.key == 'ArrowDown') {k_down = true}
  if (evt.key == 'ArrowLeft') {k_left = true}
  if (evt.key == 'ArrowRight') {k_right = true}
  if (evt.key == 'Control') {k_ctrl = true}
  if (evt.key == 'Shift') {
    menupopup = 128
    ship.cycle()
  }
  }

window.addEventListener('keydown',keydown,false)

function keyup(evt) {
  if (evt.key == 'ArrowUp') {k_up = false}
  if (evt.key == 'ArrowDown') {k_down = false}
  if (evt.key == 'ArrowLeft') {k_left = false}
  if (evt.key == 'ArrowRight') {k_right = false}
  if (evt.key == 'Control') {k_ctrl = false}}
window.addEventListener('keyup',keyup,false)


function Controller() {
  this.move = [0,0]
  this.jump = 0}
Controller.prototype.update = function () {
  this.move = [0,0]
  this.jump = 0
  if (k_up) {this.move[1]=-1}
  if (k_down) {this.move[1]=1}
  if (k_left) {this.move[0]=-1}
  if (k_right) {this.move[0]=1}
  if (k_ctrl) {this.jump = 1}
}

function PlayerBot() {}

function Drone(x,y) {
  this.type = 'drone'
  this.x = x
  this.y = y
  this.z = 0
  this.zsp = 0
  this.tgt = player1
  this.health = 20}
Drone.prototype.update = function () {
  if (this.y>this.tgt.y) {
    this.y--}
  if (this.y<this.tgt.y) {
    this.y++}
  if (this.x>this.tgt.x) {
    this.x--}
  if (this.x<this.tgt.x) {
    this.x++}
  for (oc=0;oc<objects.length;oc++) {
    if (objects[oc]!=this) {
      if (objects[oc].type=='fighter') {
        if (abs(objects[oc].x-this.x)<16
          &&abs(objects[oc].y-this.y)<16) {this.health--}}}}
  if (this.health<=0) {this.destroy()}}
Drone.prototype.destroy = function () {
  index = objects.indexOf(this)
  objects.splice(index,1)}
Drone.prototype.render = function () {
  ctx.fillStyle = '#ff0000'
  ctx.beginPath();
  ctx.arc(this.x,this.y-this.z,16,0,2*Math.PI);
  ctx.fill()
}

function Fighter(inputs) {
  this.type = 'fighter'
  this.ctrl = inputs
  this.x = W/2
  this.y = H/2
  this.z = 0
  this.zsp = 0
  this.health = 100}
Fighter.prototype.update = function () {
  this.ctrl.update()
  this.x += this.ctrl.move[0]
  this.y += this.ctrl.move[1]
  if (this.z==0) {
    if (this.ctrl.jump) {this.zsp = 10}}
  else if (this.z>0) {this.zsp--} 
  this.z += this.zsp
  if (this.z<0) {
    this.zsp=0
    this.z=0}
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

    if (Math.random()*20<1) {
      objects.push(new Drone(Math.random()*W,Math.random()*H))}

    ctx.font = "12pt courier";
    for (o=0;o<objects.length;o++) {
      objects[o].update()}
    for (o=0;o<objects.length;o++) {
      objects[o].render()}
    t++
    setTimeout(loop,10)}
  loop()
}
execute()
        
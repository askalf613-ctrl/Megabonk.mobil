import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { createPlayer, updatePlayer, addXP, allBooks, allWeapons } from './player.js';
import { createWorld, updateWorld } from './world.js';

let scene=new THREE.Scene();
scene.background=new THREE.Color(0x0d1b2a);

let camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,3000);
let renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);

let world=createWorld(scene);
let player=createPlayer(scene);

camera.position.set(0,40,80);

let keys={};
document.addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);
document.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);

function animate(){
 requestAnimationFrame(animate);

 updatePlayer(player,keys);
 updateWorld(scene,world,player);

 if(player.gainXP){
  if(addXP(player,player.gainXP)){
   openLevelUp();
  }
  player.gainXP=0;
 }

 document.getElementById("wave").innerText=world.wave;
 document.getElementById("hp").innerText=Math.floor(player.health);
 document.getElementById("level").innerText=player.level;
 document.getElementById("bookCount").innerText=player.books.length;
 document.getElementById("weaponCount").innerText=player.weapons.length;

 let xpPercent=(player.xp/player.xpToNext)*100;
 document.getElementById("xpBar").style.width=xpPercent+"%";

 camera.position.lerp(
  new THREE.Vector3(player.position.x,player.position.y+40,player.position.z+80),
  0.08
 );
 camera.lookAt(player.position);

 renderer.render(scene,camera);
}

function openLevelUp(){

 let box=document.getElementById("levelUp");
 box.innerHTML="";
 box.style.display="flex";

 let options=[];

 while(options.length<3){
  if(Math.random()<0.5){
   let b=allBooks[Math.floor(Math.random()*30)];
   options.push({type:"book",data:b});
  }else{
   let w=allWeapons[Math.floor(Math.random()*10)];
   options.push({type:"weapon",data:w});
  }
 }

 options.forEach(opt=>{
  let div=document.createElement("div");
  div.className="choice";
  div.innerText=opt.type.toUpperCase()+": "+opt.data.name;
  div.onclick=()=>{
   if(opt.type==="book" && player.books.length<3){
    player.books.push(opt.data);
    opt.data.apply(player);
   }
   if(opt.type==="weapon" && player.weapons.length<2){
    player.weapons.push(opt.data);
   }
   box.style.display="none";
  };
  box.appendChild(div);
 });
}

animate();
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export let bullets=[];

export const allBooks = Array.from({length:30},(_,i)=>({
 name:"Book "+(i+1),
 apply:(player)=>{
  player.damage+=0.2;
  player.speed+=0.1;
 }
}));

export const allWeapons = [
 {name:"Blaster",rate:25,speed:4},
 {name:"Fast Shot",rate:10,speed:6},
 {name:"Heavy Shot",rate:40,speed:3},
 {name:"Laser",rate:5,speed:8},
 {name:"Spread",rate:30,speed:4},
 {name:"Cannon",rate:50,speed:2},
 {name:"MiniGun",rate:3,speed:5},
 {name:"Sniper",rate:60,speed:10},
 {name:"Plasma",rate:15,speed:6},
 {name:"Rocket",rate:70,speed:2}
];

let velocityY=0;
let onGround=true;
let shootCooldown=0;

export function createPlayer(scene){

 let player=new THREE.Mesh(
  new THREE.CapsuleGeometry(2,5,8,16),
  new THREE.MeshStandardMaterial({color:0x00aaff})
 );

 player.castShadow=true;

 player.health=100;
 player.level=1;
 player.xp=0;
 player.xpToNext=100;

 player.damage=1;
 player.speed=1;

 player.books=[];
 player.weapons=[allWeapons[0]];

 scene.add(player);
 return player;
}

export function updatePlayer(player,keys){

 let move=1.2+player.speed;

 if(keys['w']) player.position.z-=move;
 if(keys['s']) player.position.z+=move;
 if(keys['a']) player.position.x-=move;
 if(keys['d']) player.position.x+=move;

 if(keys[' '] && onGround){
  velocityY=0.7;
  onGround=false;
 }

 velocityY-=0.03;
 player.position.y+=velocityY;

 if(player.position.y<=0){
  player.position.y=0;
  velocityY=0;
  onGround=true;
 }

 if(shootCooldown>0) shootCooldown--;

 if(shootCooldown<=0){
  player.weapons.forEach(w=>{
   shoot(player,w);
  });
  shootCooldown=player.weapons[0].rate;
 }

 bullets.forEach(b=> b.position.z-=b.speed);
}

function shoot(player,weapon){

 let b=new THREE.Mesh(
  new THREE.SphereGeometry(0.6),
  new THREE.MeshStandardMaterial({color:0xffff00})
 );

 b.position.copy(player.position);
 b.speed=weapon.speed;
 b.damage=player.damage;

 player.parent.add(b);
 bullets.push(b);
}

export function addXP(player,amount){
 player.xp+=amount;
 if(player.xp>=player.xpToNext){
  player.xp=0;
  player.level++;
  player.xpToNext=Math.floor(player.xpToNext*1.4);
  return true;
 }
 return false;
}
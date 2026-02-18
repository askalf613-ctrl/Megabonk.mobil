import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { bullets } from './player.js';

export function createWorld(scene){

 const ground=new THREE.Mesh(
  new THREE.PlaneGeometry(4000,4000),
  new THREE.MeshStandardMaterial({color:0x1e5631})
 );
 ground.rotation.x=-Math.PI/2;
 scene.add(ground);

 return{ enemies:[], wave:1 };
}

export function updateWorld(scene,world,player){

 if(world.enemies.length===0){
  world.wave++;
  if(world.wave%10===0){
   spawnBoss(scene,world);
  }else{
   for(let i=0;i<5+world.wave*2;i++){
    spawnEnemy(scene,world);
   }
  }
 }

 world.enemies.forEach((e,ei)=>{

  let dir=new THREE.Vector3()
   .subVectors(player.position,e.position)
   .normalize();

  e.position.add(dir.multiplyScalar(0.05));

  bullets.forEach((b,bi)=>{
   if(e.position.distanceTo(b.position)<4){
    e.health-=b.damage;
    scene.remove(b);
    bullets.splice(bi,1);
   }
  });

  if(e.health<=0){
   scene.remove(e);
   world.enemies.splice(ei,1);
   player.gainXP=20;
  }
 });
}

function spawnEnemy(scene,world){

 let e=new THREE.Mesh(
  new THREE.BoxGeometry(4,6,4),
  new THREE.MeshStandardMaterial({color:0xaa0000})
 );

 e.position.set(
  (Math.random()-0.5)*2000,
  3,
  (Math.random()-0.5)*2000
 );

 e.health=3+world.wave;
 scene.add(e);
 world.enemies.push(e);
}

function spawnBoss(scene,world){

 let boss=new THREE.Mesh(
  new THREE.BoxGeometry(12,15,12),
  new THREE.MeshStandardMaterial({color:0x5500ff})
 );

 boss.position.set(0,8,0);
 boss.health=50+world.wave*5;
 scene.add(boss);
 world.enemies.push(boss);
}
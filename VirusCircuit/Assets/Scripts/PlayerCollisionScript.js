#pragma strict

var collisionWBC : AudioClip;
var collisionNPC : AudioClip;
var collisionBVW : AudioClip;
var TargetCell : AudioClip;


function OnCollisionEnter (other : Collider) {
		
		
		//Interact with White Blood Cell Collision
		if(other.gameObject.tag == "WBC"){
		
		audio.PlayOneShot(collisionWBC);
		Destroy(gameObject);
		Destroy(other.gameObject);
		
		}
		
		
		//Play audio for NPC Collision
		if(other.gameObject.tag == "NPC"){
		
		audio.PlayOneShot(collisionNPC);
		
		}


		//Play audio for Blood Vessel Wall Collision
		if(other.gameObject.tag == "BVW"){
		
		audio.PlayOneShot(collisionBVW);
		
		}


		//Play audio for Target Cell Collision
		if(other.gameObject.tag == "TargetCell"){
		
		audio.PlayOneShot(TargetCell);
		
		}
}

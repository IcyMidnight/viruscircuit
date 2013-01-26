#pragma strict
var collisionRBC = audio;
var collisionWBC = audio;
var collisionNPC = audio;
var collisionBVW = audio;
var TargetCell = audio;


function OnCollisionEnter (other : Collider) {

		//Play audio for Red Blood Cell Collision
		if(other.gameObject.tag == "RBC"){
		
		audio.PlayOneShot(CollisionRBC);
		
		}
		
		
		//Play audio for White Blood Cell Collision
		if(other.gameObject.tag == "WBC"){
		
		audio.PlayOneShot(CollisionWBC);
		
		}
		
		
		//Play audio for NPC Collision
		if(other.gameObject.tag == "NPC"){
		
		audio.PlayOneShot(CollisionNPC);
		
		}


		//Play audio for Blood Vessel Wall Collision
		if(other.gameObject.tag == "BVW"){
		
		audio.PlayOneShot(CollisionBVW);
		
		}


		//Play audio for Target Cell Collision
		if(other.gameObject.tag == "TargetCell"){
		
		audio.PlayOneShot(TargetCell);
		
		}
}

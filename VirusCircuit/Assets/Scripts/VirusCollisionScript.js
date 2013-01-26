#pragma strict
var collisionRBC = audio;
var collisionWBC = audio;
var collisionNPC = audio;
var collisionBVW = audio;
var TargetCell = audio;


function OnCollisionEnter (other : Collider) {

		//Play audio for Red Blood Cell Collision
		if(other.gameObject.Tag == "RBC"){
		
		audio.PlayOneShot(CollisionRBC);
		
		}
		
		
		//Play audio for White Blood Cell Collision
		if(other.gameObject.Tag == "WBC"){
		
		audio.PlayOneShot(CollisionWBC);
		
		}
		
		
		//Play audio for NPC Collision
		if(other.gameObject.Tag == "NPC"){
		
		audio.PlayOneShot(CollisionNPC);
		
		}


		//Play audio for Blood Vessel Wall Collision
		if(other.gameObject.Tag == "BVW"){
		
		audio.PlayOneShot(CollisionBVW);
		
		}


		//Play audio for Target Cell Collision
		if(other.gameObject.Tag == "TargetCell"){
		
		audio.PlayOneShot(TargetCell);
		
		}
}

#pragma strict

var collisionWBC : AudioClip;
var collisionNPC : AudioClip;
var collisionBVW : AudioClip;
var TargetCell : AudioClip;


function OnTriggerEnter (other : Collider) {
	
//		Debug.Log ("Collision");
		
		//Interact with White Blood Cell Collision
		if(other.gameObject.tag == "WBC"){
//		Debug.Log ("WBC");
		audio.PlayOneShot(collisionWBC);
		
//		Destroy(gameObject);
//		Destroy(other.gameObject);
		
		}else if(other.gameObject.tag == "NPC"){
		Debug.Log("RBC");
		audio.PlayOneShot(collisionNPC);
		
		} else if(other.gameObject.tag == "BVW"){
		
		audio.PlayOneShot(collisionBVW);
		
		}else if(other.gameObject.tag == "TargetCell"){
		
		audio.PlayOneShot(TargetCell);
		
		}
}

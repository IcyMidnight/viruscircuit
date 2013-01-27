#pragma strict

var collisionWBC : AudioClip;
var collisionNPC : AudioClip;
var collisionBVW : AudioClip;
var TargetCell : AudioClip;



function OnCollisionEnter (collision : Collision) {
	
		
		for (var contact : ContactPoint in collision.contacts){
		
		
		
			//Interact with White Blood Cell Collision
			if(collision.gameObject.tag == "WBC"){
			Debug.Log("WBC");
			audio.PlayOneShot(collisionWBC);
			
			}else if(collision.gameObject.tag == "NPC"){
			Debug.Log("NPC");
			audio.PlayOneShot(collisionNPC);
			
			} else if(collision.gameObject.tag == "BVW"){
			
			audio.PlayOneShot(collisionBVW);
			
			}else if(collision.gameObject.tag == "TargetCell"){
			
			audio.PlayOneShot(TargetCell);
			
			}
		}
}

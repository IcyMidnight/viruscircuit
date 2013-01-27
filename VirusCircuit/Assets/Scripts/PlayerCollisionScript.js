#pragma strict

var collisionWBC : AudioClip;
var collisionNPC : AudioClip;
var collisionBVW : AudioClip;
var TargetCell : AudioClip;



function OnCollisionEnter (other : Collision) {
	
		
//		for (var contact : ContactPoint in collision.contacts){
		
		
		
			//Interact with White Blood Cell Collision
			if(other.gameObject.tag == "WBC"){
			Debug.Log("WBC");
			audio.PlayOneShot(collisionWBC);

			
			}else if(other.gameObject.tag == "NPC"){
			Debug.Log("NPC");
			audio.PlayOneShot(collisionNPC);
			
			} else if(other.gameObject.tag == "BVW"){
			
			audio.PlayOneShot(collisionBVW);
			
			}else if(other.gameObject.tag == "TargetCell"){
			
			audio.PlayOneShot(TargetCell);
 		
		} 
//		}
}

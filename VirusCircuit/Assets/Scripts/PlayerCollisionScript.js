#pragma strict

var collisionWBC : AudioClip;
var collisionNPC : AudioClip;
var collisionBVW : AudioClip;
var TargetCellAttack : AudioClip;

var WBCCollisionCounter : int = 0;
var InfectionCounter : int = 0;

var radius = 3.0;
var power = 10.0;
var ExplosionLocation : GameObject;

function Update(){
	
	if(Input.GetButtonDown("Fire1")){
	
	Debug.Log("Boom!");
	
    var colliders : Collider[] = Physics.OverlapSphere (ExplosionLocation.transform.position, radius);
    
    for (var hit : Collider in colliders) {
        if (!hit)
            continue;
        
        if (hit.rigidbody)
            hit.rigidbody.AddExplosionForce(power, ExplosionLocation.transform.position,10, 3.0);
    }
    }
   }


function OnCollisionEnter (other : Collision) {
			
			
		
			//Interact with White Blood Cell Collision
			if(other.gameObject.tag == "WBC"){
			other.transform.position = Vector3(-10,0,0);
			audio.PlayOneShot(collisionWBC);
			WBCCollisionCounter++;

			
			}else if(other.gameObject.tag == "NPC"){
			
			audio.PlayOneShot(collisionNPC);
			
			} else if(other.gameObject.tag == "BVW"){
			
			audio.PlayOneShot(collisionBVW);
			
			}else if(other.gameObject.tag == "TargetCell"){
			
			InfectionCounter++;
			
			Destroy(other.gameObject, 3);
			
			audio.PlayOneShot(TargetCellAttack);
 		

}
}
#pragma strict

var PlayerColl: Collider;
var ShieldColl: Collider;
var WBC : GameObject;
var Shield : GameObject;
var collisionWBC : AudioClip;

// etc...

 

function OnCollisionEnter(coll: Collision) {

    if (coll == ShieldColl) {
    
    	if(coll.gameObject.tag == "WBC"){

        WBC.transform.position = Vector3(-10,0,0);
		Shield.transform.position = Vector3(-10,0,0);
		audio.PlayOneShot(collisionWBC);

    }

}
}
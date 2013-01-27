#pragma strict

var radius = 3.0;
var power = 10.0;

var Starter : GameObject;

function Start () {

    // Applies an explosion force to all nearby rigidbodies
    var explosionPos : Vector3 = Starter.transform.position;
    var colliders : Collider[] = Physics.OverlapSphere (explosionPos, radius);
    
    for (var hit : Collider in colliders) {
        if (!hit)
            continue;
        
        if (hit.rigidbody)
            hit.rigidbody.AddExplosionForce(power, explosionPos, radius, 3.0);
    }
}
#pragma strict

function Start () {

}

var speed : float = 100;

function Update () {
    var vMove : float = Input.GetAxis("Vertical")   * speed;
    var hMove : float = Input.GetAxis("Horizontal") * speed;
    
    vMove *= Time.deltaTime;
    hMove *= Time.deltaTime;
    
    transform.rigidbody.AddForce(hMove*3, 0, vMove*3);
}

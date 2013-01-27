#pragma strict

var ScriptHolder : GameObject;

function OnTriggerEnter(other : Collider){

	var temp : GameObject = other.gameObject;

	ScriptHolder.GetComponent(Overseer).CreateRedBloodCell(temp);
}
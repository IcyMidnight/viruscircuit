#pragma strict

var currentBloodSpeed : float = 1.0;

var redBloodCell : GameObject;
var BgTiles : GameObject[] = new GameObject[3];

private var BloodCellCounter : int = 0;

private var RedBloodPool : Array = new Array();

private var BgArray : Array = new Array();

function Start () {
	CreateRedBloodPool();
}

function Update () {

if(Input.GetButtonDown("Fire1")){
CreateRedBloodCell();
}

}

//Make a pool of all tiles that will be used as backgrounds
function CreateBgPool(){
	for(var x = 0; x<20; x++){
		var rand : int = Random.Range(0, BgTiles.length-1);
		BgArray[x] = Instantiate(BgTiles[rand], Vector3(0,0,30), Quaternion.identity);
	}
}





//Make a pool of blood cells to use as needed
function CreateRedBloodPool(){
	for(var x = 0; x < 50; x++){
	
		RedBloodPool[x] = Instantiate(redBloodCell, Vector3(0,0,20+x*1.5), Quaternion.identity);
		
		var temp : GameObject = RedBloodPool[x];
	}
}

function CreateRedBloodCell(){

	var RedBloodCell : GameObject = RedBloodPool[BloodCellCounter];
	RedBloodCell.transform.position = Vector3(0, 0, Random.Range(-5.0, 5.0));
	RedBloodCell.rigidbody.velocity = Vector3(0,0,0);
	RedBloodCell.transform.rotation = Vector3(0,0,0);
	RedBloodCell.rigidbody.AddForce(Vector3(-1,0,0), 3);
	
	if(BloodCellCounter<RedBloodPool.length){
		BloodCellCounter++;
	}
	else{
		BloodCellCounter = 0;
	}


}
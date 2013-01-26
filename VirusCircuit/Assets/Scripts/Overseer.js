#pragma strict

var currentBloodSpeed : float = 1.0;

var redBloodCell : GameObject;
var BgTiles : GameObject[] = new GameObject[3];

private var BloodCellCounter : int = 0;

private var RedBloodPool : GameObject[] = new GameObject[10];

private var BgArray : Array = new Array();
private var loopOfCells : boolean = false;

var levelLayout : int[] = new int[10];

function Start () {
	CreateRedBloodPool();
	CreateBgPool();
	StartRedBloodCells();
}

function Update () {

	for(x in RedBloodPool){
		CheckPosition(x, -10);
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
	for(var x = 0; x < RedBloodPool.length; x++){
	
		RedBloodPool[x] = Instantiate(redBloodCell, Vector3(0,0,20+x*1.5), Quaternion.identity);
		
		var temp : GameObject = RedBloodPool[x];
	}
}

//Set the background
//function StartBG(BackgroundMatrix : int[]){
//	For(var x : int = 0; x < BackgroundMatrix.length; x++){
		

function StartRedBloodCells(){
	var x : int = 0;
	while(loopOfCells == false){
		CreateRedBloodCell(RedBloodPool[x]);
		x++;
		yield WaitForSeconds(1.0);
		if(x==RedBloodPool.length-1){
			break;
		}
	}
}	

function CheckPosition(cell: GameObject, xDist : float){
	if(cell.transform.position.x < xDist){
		CreateRedBloodCell(cell);
	}
}


function CreateRedBloodCell(cell : GameObject){

	cell.transform.position = Vector3(10, 0, Random.Range(-4.5, 4.5));
	cell.rigidbody.velocity = Vector3(0,0,0);
	cell.transform.rotation.eulerAngles = Vector3(0,0,0);
	cell.rigidbody.AddForce(Vector3(-3,0,0), 1);
	
	if(BloodCellCounter < RedBloodPool.length-1){
		BloodCellCounter++;
	}
	else{
		BloodCellCounter = 0;
	}


}
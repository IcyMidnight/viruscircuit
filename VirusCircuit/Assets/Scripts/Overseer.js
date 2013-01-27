#pragma strict

var currentBloodSpeed : float = 1.0;

var Mover : GameObject;

var Player : GameObject;

var redBloodCell : GameObject;
var whiteBloodCell : GameObject;
var BgTiles : GameObject[] = new GameObject[3];

private var BloodCellCounter : int = 0;

private var RedBloodPool : GameObject[] = new GameObject[30];
private var WhiteBloodPool = new Array();

private var BgArray : GameObject[] = new GameObject[30];
private var loopOfCells : boolean = false;

var levelLayout : int[] = new int[10];

var lastWhiteCell = 0;

function Start () {
	CreateRedBloodPool();
	CreateBgPool();
	StartBG();
	StartRedBloodCells();
}

function Update () {

	PushWithFlow(Player);
	PlayerFlow(Player);

	MoveCamera();
	KeepPlayerInView();

	for(x in RedBloodPool){
		PushWithFlow(x);
		CheckPosition(x, Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(0,0,0)).x-2);
	}
	
	for(cell in WhiteBloodPool){
		PushWithFlow(cell);
		CheckPositionAndKill(cell, Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(0,0,0)).x-2);
	}

	var floorTime : int = Mathf.Floor(Time.fixedTime);
	if (floorTime > lastWhiteCell) {
		lastWhiteCell = floorTime;
		CreateWhiteBloodCell();
	}
}

//This keeps the player from moving off the screen in either the right or left directions
function KeepPlayerInView(){
	var farLeft : float = Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(50,100,0)).x;
	
	var farRight : float = Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(Screen.width-50,100,0)).x;
	

	if(Player.transform.position.x < farLeft){
		Player.transform.position.x = farLeft;
	}
	if(Player.transform.position.x > farRight){
		Player.transform.position.x = farRight;
	}
}

//Move the camera at a set speed
function MoveCamera(){
	Mover.transform.position.x = Time.time*4;
//	Mover.transform.position.x += Mathf.Abs(Mathf.Sin(Time.time))/10;
//	Mover.transform.position.x += HeartBeat(Time.time, 5)*.05;
}

function PushWithFlow(object : GameObject){
	object.rigidbody.AddForce(Flow.flowAt(Time.time, Vector3(1,0,0)));
}
	
function PlayerFlow(object : GameObject){
	object.rigidbody.AddForce(Vector3(2,0,0));
}
	
function OnGUI(){
	GUI.Box(Rect(0,0,200,200),"");
	}



//Make a pool of all tiles that will be used as backgrounds
function CreateBgPool(){
	for(var x = 0; x<BgArray.length; x++){
		BgArray[x] = Instantiate(BgTiles[Random.Range(0, BgTiles.length-1)], Vector3(0,0,30), Quaternion.identity);
	}
}

//Make a pool of blood cells to use as needed
function CreateRedBloodPool(){
	for(var x = 0; x < RedBloodPool.length; x++){
		RedBloodPool[x] = Instantiate(redBloodCell, Vector3(0,0,20+x*1.5), Quaternion.identity);
	}
}

//Make a pool of blood cells to use as needed
function CreateWhiteBloodPool(){
	for(var x = 0; x < RedBloodPool.length; x++){
		WhiteBloodPool[x] = Instantiate(whiteBloodCell, Vector3(0,0,20+x*1.5), Quaternion.identity);
	}
}

//Set the background
function StartBG(){

	for(var x = 0; x < BgArray.length; x++){
	
		BgArray[x].transform.position = Vector3(x*15,0,0);
		
	}
}
		
//Begin the flow of cells
function StartRedBloodCells(){
	var x : int = 0;
	while(loopOfCells == false){
		CreateRedBloodCell(RedBloodPool[x]);
		x++;
		yield WaitForSeconds(1.5);
		if(x==RedBloodPool.length-1){
			break;
		}
	}
}	

//Checks the location of the cells and restarts them 
function CheckPosition(cell: GameObject, xDist : float){
	if(cell.transform.position.x < xDist){
		CreateRedBloodCell(cell);
	}
}

function CheckPositionAndKill(cell: GameObject, xDist : float){
	if(cell.transform.position.x < xDist){
		WhiteBloodPool.Remove(cell);
		Destroy(cell);
	}
}

function CreateRedBloodCell(cell : GameObject){

	cell.transform.position = Vector3(Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(Screen.width,100,0)).x+5, 0, Random.Range(-4.5, 4.5));
	cell.rigidbody.velocity = Vector3(0,0,0);
	cell.transform.rotation.eulerAngles = Vector3(0,0,0);
	
	if(BloodCellCounter < RedBloodPool.length-1){
		BloodCellCounter++;
	}
	else{
		BloodCellCounter = 0;
	}
}

function CreateWhiteBloodCell(){
	var position : Vector3 = Vector3(Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(Screen.width,100,0)).x+5, 0, Random.Range(-4.5, 4.5));
	WhiteBloodPool.Push(Instantiate(whiteBloodCell, position, Quaternion.identity));

	//whiteBloodCell.transform.position = ;
	whiteBloodCell.rigidbody.velocity = Vector3(0,0,0);
	whiteBloodCell.transform.rotation.eulerAngles = Vector3(0,0,0);
}
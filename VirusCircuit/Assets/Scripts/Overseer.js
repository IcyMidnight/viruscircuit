#pragma strict
import System.Collections.Generic;

var currentBloodSpeed : float = 1.0;

var Mover : GameObject;

var Player : GameObject;

var redBloodCell : GameObject;
var backgroundRedBloodCell : GameObject;
var whiteBloodCell : GameObject;

var BgTiles : GameObject[] = new GameObject[3];

private var BloodCellCounter : int = 0;


private var RedBloodPool : GameObject[] = new GameObject[30];

private var WhiteBloodPoolSize : int = 30;  // Number of cells in the active and reserve pools.
private var ReserveWhiteBloodPool : List.<GameObject> = new List.<GameObject>();
private var ActiveWhiteBloodPool : List.<GameObject> = new List.<GameObject>();
private var WhiteBooldCellsToDeactivate : List.<GameObject> = new List.<GameObject>();

private var BackgroundRedBloodPool : GameObject[] = new GameObject[30];


private var BgArray : GameObject[] = new GameObject[30];
private var loopOfCells : boolean = false;

var levelLayout : int[] = new int[10];

var lastWhiteCell = 0;





//All of the initial instantiations
function Start () {
	CreateRedBloodPool();
	CreateWhiteBloodPool();
	CreateBgPool();
//	StartBG();
	StartRedBloodCells();
	StartBackgroundCells();
}

function Update () {

	PushWithFlow(Player);
	PlayerFlow(Player);

	MoveCamera();
	KeepPlayerInView();

	for(x in RedBloodPool){
		PushWithFlow(x);
		CheckPosition(x, Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(0,0,13)).x-2);
	}
	for(x in BackgroundRedBloodPool){
		PushWithFlow(x);
		CheckBackgroundPosition(x, Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(0,0,15)).x-2);
	}
	
	for(cell in ActiveWhiteBloodPool){
		PushWithFlow(cell);
		CheckPositionAndKill(cell, Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(0,0,13)).x-2);
	}
	
	for (var cell : GameObject in WhiteBooldCellsToDeactivate) {
		ActiveWhiteBloodPool.Remove(cell);
		ReserveWhiteBloodPool.Add(cell);
	}
	WhiteBooldCellsToDeactivate.Clear();

	var floorTime : int = Mathf.Floor(Time.fixedTime);
	if (floorTime > lastWhiteCell) {
		lastWhiteCell = floorTime;
		CreateWhiteBloodCell();
	}
	
	var segment = CameraUtils.GetCurrentLevelSegment(Mover.Find("Main Camera").camera);
	//Debug.Log("Segment: " + segment);
}

//This keeps the player from moving off the screen in either the right or left directions
function KeepPlayerInView(){
	var farLeft : float = Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(50,0,13)).x;
	
	var farRight : float = Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(Screen.width-50,0,13)).x;
	
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

		RedBloodPool[x] = Instantiate(redBloodCell, Vector3(300,0,20+x*1.5), Quaternion.identity);
		BackgroundRedBloodPool[x] = Instantiate(redBloodCell, Vector3(300,0,20+x*1.5), Quaternion.identity);
		BackgroundRedBloodPool[x].transform.localScale = Vector3(.8,.8,.8);
	}
}

//Make a pool of blood cells to use as needed
function CreateWhiteBloodPool(){
	for(var i = 0; i < WhiteBloodPoolSize; i++){
		ReserveWhiteBloodPool.Add(Instantiate(whiteBloodCell, Vector3(0,0,20+i*1.5), Quaternion.identity));
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
		WhiteBooldCellsToDeactivate.Add(cell);
	}
}

function CreateRedBloodCell(cell : GameObject){
	cell.transform.position = Vector3(Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(Screen.width,0,13)).x+5, 0, Random.Range(-4.5, 4.5));
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
	var position : Vector3 = Vector3(Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(Screen.width,0,13)).x+5, 0, Random.Range(-4.5, 4.5));
	
	var lastIndex : int = (ReserveWhiteBloodPool.Count - 1);
	
	if (lastIndex < 1) {
		Debug.Log("We're out of White Blood Cells");
		return;
	}
	
	var cell : GameObject = ReserveWhiteBloodPool[lastIndex];
	ReserveWhiteBloodPool.RemoveAt(lastIndex);
	ActiveWhiteBloodPool.Add(cell);

	cell.transform.position = position;
	cell.rigidbody.velocity = Vector3(0,0,0);
	cell.transform.rotation.eulerAngles = Vector3(0,0,0);
}

//Checks the location of the cells and restarts them 
function CheckBackgroundPosition(cell: GameObject, xDist : float){
	if(cell.transform.position.x < xDist){
		CreateBackgroundCell(cell);
	}
}

function CreateBackgroundCell(cell : GameObject){

	cell.transform.position = Vector3(Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(Screen.width,0,14)).x+5, Random.Range(-1,-3), Random.Range(-3, 3));
	cell.rigidbody.velocity = Vector3(0,0,0);
	cell.transform.rotation.eulerAngles = Vector3(0,0,0);
}

//Begin the flow of cells
function StartBackgroundCells(){
	var x : int = 0;
	while(loopOfCells == false){
		CreateBackgroundCell(BackgroundRedBloodPool[x]);
		x++;
		yield WaitForSeconds(1.5);
		if(x==BackgroundRedBloodPool.length-1){
			break;
		}
	}
}	


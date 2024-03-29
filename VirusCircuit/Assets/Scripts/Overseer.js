#pragma strict
import System.Collections.Generic;

var currentBloodSpeed : float = 1.0;

var Mover : GameObject;
var CameraSpeed = 4;
var CameraTravelVector : Vector3 = Vector3(CameraSpeed, 0, 0);
var CellVector : Vector3 = Vector3(CameraSpeed, 0, 0);
// 0 - Starting, 1 - entering target area, 2 - inside target aread, 3 - leaving target area, 4 - heading to end
var gamePhase : int = 0;

var CameraStartPositions : Hashtable = new Hashtable();
var CameraTargetPositions : Hashtable = new Hashtable();
var CameraEndPositions : Hashtable = new Hashtable();
var CameraAnimStartTime : float;

var LevelSegmentVectors : Hashtable = new Hashtable();

var Player : GameObject;

var redBloodCell : GameObject;
var backgroundRedBloodCell : GameObject;
var whiteBloodCell : GameObject;

var BgTiles : GameObject[] = new GameObject[3];

var pushLayerMask : LayerMask;

//For generation of cells ahead of player
var Generator : GameObject;
var FrontCamera : Camera;
var DestroyCam : Camera;
var Destroyer : GameObject;

private var cameraUtils : CameraUtils = new CameraUtils();


private var RedBloodPool : GameObject[] = new GameObject[60];

private var WhiteBloodPoolSize : int = 30;  // Number of cells in the active and reserve pools.
private var ReserveWhiteBloodPool : List.<GameObject> = new List.<GameObject>();
private var ActiveWhiteBloodPool : List.<GameObject> = new List.<GameObject>();
private var WhiteBooldCellsToDeactivate : List.<GameObject> = new List.<GameObject>();

private var BackgroundRedBloodPool : GameObject[] = new GameObject[60];


private var BgArray : GameObject[] = new GameObject[30];
private var loopOfCells : boolean = false;

var levelLayout : int[] = new int[10];

var lastWhiteCell = 0;


function StartPlayerMoving(){
	
	while(Player.rigidbody.velocity.x < 5){
		Player.rigidbody.AddForce(Vector3(25,0,0));
		Debug.Log("moving");
		yield;
		
		
	}
}


//All of the initial instantiations
function Start () {
	gamePhase = 0;

	Generator.transform.position.x = Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(Screen.width,0,13)).x+10;
	Destroyer.transform.position.x = Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(0,0,13)).x-15;
	
	Player.transform.position.x +=.25;

	CreateRedBloodPool();
	CreateWhiteBloodPool();
	CreateBgPool();
//	StartBG();
	StartRedBloodCells();
	StartBackgroundCells();
	
	CameraTargetPositions[Mover] = Vector3(320, 40, -80);
	CameraTargetPositions[Generator] = Vector3(272, -0.6213219, -71);
	CameraTargetPositions[Destroyer] = Vector3(312, -0.6213219, -39);
	
	CameraEndPositions[Mover] = Vector3(312, -0.6213219, -50);
	CameraEndPositions[Generator] = Vector3(312, -0.6213219, -28.15);
	CameraEndPositions[Destroyer] = Vector3(312, -0.6213219, -72.38);
}

function Update () {
	
	var mainCamera : Camera = Mover.Find("Main Camera").camera;

	PushWithFlow(Player);

	MoveCamera(mainCamera, Mover);
	MoveCamera(FrontCamera, Generator);
	
	MoveCamera(DestroyCam, Destroyer);
	
	KeepPlayerInView();

	for(x in RedBloodPool){
		PushFromVectorBelow(x);
//		PushWithFlow(x);
//		CheckPosition(x, mainCamera.camera.ScreenToWorldPoint(Vector3(0,0,13)).x-2);
	}
	for(x in BackgroundRedBloodPool){
		PushFromVectorBelow(x);
//		PushWithFlow(x);
		CheckBackgroundPosition(x, mainCamera.camera.ScreenToWorldPoint(Vector3(0,0,15)).x-2);
	}
	
	for(var cell : GameObject in ActiveWhiteBloodPool){
		PushFromVectorBelow(cell);
		WhiteCellUpdate(cell, mainCamera);
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
}

function WhiteCellUpdate(cell : GameObject, mainCamera : Camera) {
	if (CheckPositionAndKill(cell, mainCamera.camera.ScreenToWorldPoint(Vector3(0,0,13)).x-2)) {
//		PushWithFlow(cell);
		var playerPosition : Vector3 = Player.rigidbody.position;
	}
}

//This keeps the player from moving off the screen in either the right or left directions
function KeepPlayerInView(){
	
	
		var farLeft : float = Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(50,0,Mover.transform.position.y+13.6)).x;
		
		var farRight : float = Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(Screen.width-50,0,Mover.transform.position.y+13.6)).x;
		
		var farTop : float = Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(0,50,Mover.transform.position.y+13.6)).z;
		
		var farBottom : float = Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(0,Screen.height-50,Mover.transform.position.y+13.6)).z;
		
		
		if(Player.transform.position.x < farLeft){
			Player.transform.position.x = farLeft;
		}
		if(Player.transform.position.x > farRight){
			Player.transform.position.x = farRight;
		}	
		if(Player.transform.position.z > farBottom){
			Player.transform.position.z = farBottom;
		}
		if(Player.transform.position.z < farTop){
			Player.transform.position.z = farTop;
		}
	
}

//Move the camera at a set speed
function MoveCamera(mainCam : Camera, objectToMove : GameObject){
	if (gamePhase == 0 || gamePhase == 4) {
		var currentSegmentCollider : Collider = this.GetComponent(CameraUtils).GetCurrentLevelSegment(mainCam);
		var forwardVector : Vector3 = CameraTravelVector;
		var LerpPos : float;
		
		if (currentSegmentCollider != null) {
			//Debug.Log(LevelSegmentVectors[currentSegmentCollider]);
			var cachedValue = LevelSegmentVectors[currentSegmentCollider];
			if (cachedValue == null) {
				//Debug.Log("No forward vector");
				var segmentForward : Vector3 = currentSegmentCollider.transform.forward;
				var angleBetween : float = Vector3.Angle(CameraTravelVector, segmentForward);
				//Debug.Log(CameraTravelVector + " <-> " + segmentForward + " -- " + angleBetween);
				if (angleBetween < -90.0 || angleBetween > 90.0) {
					segmentForward *= -1;
				}
				segmentForward.Normalize();
				LevelSegmentVectors[currentSegmentCollider] = segmentForward;
				forwardVector = segmentForward;
			} else {
				if (gamePhase == 0 && currentSegmentCollider.transform.parent.CompareTag("TargetArea")) {
					enterTargetArea();
				} else {
					forwardVector = cachedValue;
					CameraTravelVector = forwardVector;
				}
				//Debug.Log("Cached Vector" + forwardVector);
			}
		}
	
		objectToMove.transform.Translate(Time.deltaTime * forwardVector * CameraSpeed);
		
		//Mover.transform.position.x = Player.transform.position.x;
		//Mover.transform.position.z = Player.transform.position.z;
	} else if (gamePhase == 1) {
		LerpPos = (Time.time - CameraAnimStartTime) / 3.0;
		if (LerpPos > 1.0) {
			gamePhase = 2;
		} else {
			objectToMove.transform.position = Vector3.Lerp(CameraStartPositions[objectToMove], CameraTargetPositions[objectToMove], LerpPos);
		}
	} else if (gamePhase == 3) {
		LerpPos = (Time.time - CameraAnimStartTime) / 4.0;
		if (LerpPos > 1.0) {
			gamePhase = 4;
		} else {
			objectToMove.transform.position = Vector3.Lerp(CameraTargetPositions[objectToMove], CameraEndPositions[objectToMove], LerpPos);
		}
	}
}

function enterTargetArea() {
	gamePhase = 1;
	CameraStartPositions[Mover] = Mover.transform.position;
	CameraStartPositions[Generator] = Generator.transform.position;
	CameraStartPositions[Destroyer] = Destroyer.transform.position;

	CameraAnimStartTime = Time.time;
}

function exitTargetArea() {
	gamePhase = 3;

	CameraAnimStartTime = Time.time;
}


function PushFromVectorBelow(object : GameObject){



	var hitInfo : RaycastHit;
	if (Physics.Raycast(object.transform.position, Vector3(0, -1, 0), hitInfo, Mathf.Infinity, pushLayerMask)) {

		var collider : Collider = hitInfo.collider;
		if (collider != null) {
			var currentSegmentCollider : Collider = collider;
		}
	}
			
	if (currentSegmentCollider != null) {
		var segmentForward : Vector3 = currentSegmentCollider.transform.forward;
		var angleBetween : float = Vector3.Angle(CellVector, segmentForward);
		//Debug.Log(CameraTravelVector + " <-> " + segmentForward + " -- " + angleBetween);
		if (angleBetween < -90.0 || angleBetween > 90.0) {
			segmentForward *= -1;
		}
		CellVector = CameraSpeed * segmentForward;
	}
	
	object.rigidbody.AddForce(Flow.flowAt(Time.time, CellVector));
	
}

function PushPlayerFromVectorBelow(object : GameObject){



	var hitInfo : RaycastHit;
	if (Physics.Raycast(object.transform.position, Vector3(0, -1, 0), hitInfo, Mathf.Infinity, pushLayerMask)) {

		var collider : Collider = hitInfo.collider;
		if (collider != null) {
			var currentSegmentCollider : Collider = collider;
		}
	}
			
	if (currentSegmentCollider != null) {
		var segmentForward : Vector3 = currentSegmentCollider.transform.forward;
		var angleBetween : float = Vector3.Angle(CellVector, segmentForward);
		//Debug.Log(CameraTravelVector + " <-> " + segmentForward + " -- " + angleBetween);
		if (angleBetween < -90.0 || angleBetween > 90.0) {
			segmentForward *= -1;
		}
		CellVector = CameraSpeed * segmentForward;
	}
	
	object.rigidbody.AddForce(Flow.flowAt(Time.time/2, CellVector));
	
}


function PushWithFlow(object : GameObject){
	object.rigidbody.AddForce(Flow.flowAt(Time.time, Vector3(1,0,0)));
}
	
function PlayerFlow(object : GameObject){
	object.rigidbody.AddForce(Vector3(2,0,0));
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
//		CreateRedBloodCell(cell);
	}
}

function CheckPositionAndKill(cell: GameObject, xDist : float){
	if(cell.transform.position.x < xDist){
		WhiteBooldCellsToDeactivate.Add(cell);
		return false;
	}
	return true;
}

function CreateRedBloodCell(cell : GameObject){
	cell.transform.position = RandomCircle(Generator.transform.position, 4.5);
	
//	cell.transform.position = Vector3(Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(Screen.width,0,13)).x+5, 0, Random.Range(-4.5, 4.5));
	cell.rigidbody.velocity = Vector3(0,0,0);
	cell.transform.rotation.eulerAngles = Vector3(0,0,0);
	
}

function CreateWhiteBloodCell(){
	var position : Vector3 = RandomCircle(Generator.transform.position, 4.5);
//	var position : Vector3 = Vector3(Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(Screen.width,0,13)).x+5, 0, Random.Range(-4.5, 4.5));
	
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

	cell.transform.position = RandomCircle(Generator.transform.position, 4.5);
//	cell.transform.position = Vector3(Mover.Find("Main Camera").camera.ScreenToWorldPoint(Vector3(Screen.width,0,14)).x+5, Random.Range(-1,-3), Random.Range(-3, 3));
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


function RandomCircle(center:Vector3, radius:float): Vector3 {
    // create random angle between 0 to 360 degrees
    var ang = Random.value * 360;
    var pos: Vector3;
    pos.x = center.x + radius * Mathf.Sin(ang * Mathf.Deg2Rad);
    pos.z = center.z + radius * Mathf.Cos(ang * Mathf.Deg2Rad);
    pos.y = center.y;
    return pos;
}
#pragma strict

var currentBloodSpeed : float = 1.0;

var Mover : GameObject;

var Player : GameObject;

var redBloodCell : GameObject;
var BgTiles : GameObject[] = new GameObject[3];

private var BloodCellCounter : int = 0;

private var RedBloodPool : GameObject[] = new GameObject[10];

private var BgArray : GameObject[] = new GameObject[10];
private var loopOfCells : boolean = false;

var levelLayout : int[] = new int[10];

function Start () {
	CreateRedBloodPool();
	CreateBgPool();
	StartBG();
	StartRedBloodCells();
}

function Update () {


	MoveCamera();
	KeepPlayerInView();

	for(x in RedBloodPool){
		CheckPosition(x, Mover.transform.position.x-10);
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
//	Mover.transform.position.x = Time.time*2;
//	Mover.transform.position.x += Mathf.Abs(Mathf.Sin(Time.time))/10;
	Mover.transform.position.x += fun1(Time.time)*.05;
}

function fun1(t : float) {
    t = t/5;
    t = t - Mathf.Floor(t);
    if (t < 0.25) {
        var x = t * 4 * Mathf.PI;
        return (0.75 * Mathf.Cos(x+Mathf.PI)) + 0.25;
    } else if (t > 0.9) {
        x = (t - 0.9) * 10 * Mathf.PI;
        return (0.75 * Mathf.Cos(x)) + 0.25;
    } else {
        return 1;
    }
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
		
		var temp : GameObject = RedBloodPool[x];
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
		yield WaitForSeconds(1.0);
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


function CreateRedBloodCell(cell : GameObject){

	cell.transform.position = Vector3(Mover.transform.position.x+10, 0, Random.Range(-4.5, 4.5));
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
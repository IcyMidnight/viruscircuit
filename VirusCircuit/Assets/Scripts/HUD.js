#pragma strict
var LoadingBar : Texture[] = new Texture[7];
private var LoadingBarRect : Rect;
private var LoadingBarNum : int = 0;

var HealthBar : Texture[] = new Texture[11];
private var HealthBarRect : Rect;
private var HealthBarNum : int = 9;
private var virusMeterOn : boolean = false;

var Player : GameObject;

var Skin : GUISkin;

private var GameOver : boolean = false;

function Start () {

LoadingBarRect = Rect(Screen.width-522,20,512,64);
HealthBarRect = Rect(-35,0,512,64);

}

function Update () {

HealthBarNum = 9 - Player.GetComponent(PlayerCollisionScript).WBCCollisionCounter;

LoadingBarNum = Player.GetComponent(PlayerCollisionScript).InfectionCounter;

if(HealthBarNum < 1){
	GameOver = true;
	}
	
if(Player.transform.position.x > 295){
		virusMeterOn = true;
	}

}

function OnGUI(){

	GUI.skin = Skin;


	if(virusMeterOn == true){
		var LoadingBarWin = GUI.Window(0, LoadingBarRect, LoadingBarWindow, "");
	}
	var HealthBarWin = GUI.Window(1, HealthBarRect, HealthBarWindow, "");
	
	if(GameOver == true){
		GUI.Box(Rect(20,20,Screen.width-40,Screen.height-40),"GAME OVER");
		Player.SetActive(false);
	}
}

	
function LoadingBarWindow (windowID : int) {

    if(LoadingBarNum >= 0){ 
	    GUI.DrawTexture(Rect(20,0,40,40), LoadingBar[6]);
	    GUI.DrawTexture(Rect(112,20,400,32), LoadingBar[0]);
    }
    if(LoadingBarNum >= 1) 
    
    GUI.DrawTexture(Rect(112,20,400,32), LoadingBar[1]);
    if(LoadingBarNum >= 2) 
    
    GUI.DrawTexture(Rect(112,20,400,32), LoadingBar[2]);
    if(LoadingBarNum >= 3) 
    
    GUI.DrawTexture(Rect(112,20,400,32), LoadingBar[3]);
    if(LoadingBarNum >= 4) 
    
    GUI.DrawTexture(Rect(112,20,400,32), LoadingBar[4]);
    if(LoadingBarNum >= 5) 
    
    GUI.DrawTexture(Rect(112,20,400,32), LoadingBar[5]);
    
}

function HealthBarWindow (windowID : int) {

    if(HealthBarNum >= 0){ 
	    GUI.DrawTexture(Rect(112,7,400,26), HealthBar[0]);
	    GUI.DrawTexture(Rect(50,0,40,40), HealthBar[10]);
    }
    if(HealthBarNum >= 1) 
    
    GUI.DrawTexture(Rect(112,7,400,26), HealthBar[1]);
    if(HealthBarNum >= 2) 
    
    GUI.DrawTexture(Rect(112,7,400,26), HealthBar[2]);
    if(HealthBarNum >= 3) 
    
    GUI.DrawTexture(Rect(112,7,400,26), HealthBar[3]);
    if(HealthBarNum >= 4) 
    
    GUI.DrawTexture(Rect(112,7,400,26), HealthBar[4]);
    if(HealthBarNum >= 5) 
    
    GUI.DrawTexture(Rect(112,7,400,26), HealthBar[5]);
    if(HealthBarNum >= 6) 
    
    GUI.DrawTexture(Rect(112,7,400,26), HealthBar[6]);
    if(HealthBarNum >= 7) 
    
    GUI.DrawTexture(Rect(112,7,400,26), HealthBar[7]);
    if(HealthBarNum >= 8) 
    
    GUI.DrawTexture(Rect(112,7,400,26), HealthBar[8]);
    if(HealthBarNum >= 9) 
    
    GUI.DrawTexture(Rect(112,7,400,26), HealthBar[9]);
    
}
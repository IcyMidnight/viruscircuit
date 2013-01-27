#pragma strict
// Manages the blood flow.
// Internally the the cycle time is [0, 1).

class Flow {
	private static var flowSpeed : float = 10;
	private static var forwardPeriod : float = 0.75;
	private static var flowPeriod : float = 2.5;
	
	// Returns a cyclic value based on t of the blood flow.
	// Starts at -0.25 and moves up to 1, then returns to -0.25
	public static function flowAt(t : float, direction : Vector3) {
		// Change the speed of the flow
	    t = t / flowPeriod;
	    
	    // Make t be [0, 1) so that the flow cycles over some unit of time,
	    // i.e. affected by the speed above.
	    t = t - Mathf.Floor(t);
	    
	    var flow = direction.normalized;
	    
	    if(t < forwardPeriod){
	    	return flow * flowSpeed;
	    }
	    
	    else{
	    	return flow * -flowSpeed;
	    }
	}
}
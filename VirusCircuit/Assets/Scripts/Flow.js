#pragma strict
// Manages the blood flow.
// Internally the the cycle time is [0, 1).
// Parameters to tune increasePeriod, decreasePeriod, flowSpeed

class Flow {
	// How long to spend increasing the flow [0, increasePeriod)
	private static var increasePeriod : float = 0.25;
	// The multiplier we need to make sure to get half of the cosign period over the course of
	// the inscreasing region.
	private static var increaseFunctionSelector : float = (1.0 / increasePeriod) * Mathf.PI;
	
	// How long to spend decreasing the flow [decreaseStart, decreaseStart + decreasePeriod)
	private static var decreasePeriod : float = 0.2;
	private static var decreaseStart : float = 1.0 - decreasePeriod;
	// The multiplier we need to make sure to get half of the cosign period over the course of
	// the decreasing region.
	private static var decreaseFunctionSelector : float = (1.0 / decreasePeriod) * Mathf.PI;
	
	private static var flowSpeed : float = 2.5;
	
	// Returns a cyclic value based on t of the blood flow.
	// Starts at -0.25 and moves up to 1, then returns to -0.25
	public static function flowAt(t : float) {
		// Change the speed of the flow
	    t = t / flowSpeed;
	    
	    // Make t be [0, 1) so that the flow cycles over some unit of time,
	    // i.e. affected by the speed above.
	    t = t - Mathf.Floor(t);
	    
	    if(t<.75){
	    	return 1;
	    }
	    
	    else{return-1;}
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    if (t < increasePeriod) {  // The region of the cycle where we increase.
	    	// Map (0, increasePeriod] into (0, PI/2]
	        t *= increaseFunctionSelector;
	        // Scale the cos to fit between -0.25 and 1, and move to the rising half of the cycle.
	        return (1* Mathf.Cos(t + Mathf.PI)) + 0.0;
	    } else if (t < decreaseStart) {  // The region of the function where we flow forward.
	        return 1;
	    } else  {  // The region of the function where we decrease and eventually drop below 0.
	    return -1;
	        t = (t - decreaseStart) * decreaseFunctionSelector;
	        // Map (decreaseStart, 1.0] into (0, PI/2]
	        // Scale the cos to fit between -0.25 and 1.
	        return (1 * Mathf.Cos(t)) + 0;
	    }
	}
}
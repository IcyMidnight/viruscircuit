#pragma strict

public var layerMask : LayerMask;

public function GetCurrentLevelSegment(origin : Camera) {
	var hitInfo : RaycastHit;
	if (Physics.Raycast(origin.transform.position, Vector3(0, -1, 0), hitInfo, Mathf.Infinity, layerMask)) {
		//var body : Rigidbody = hitInfo.rigidbody;
		var collider : Collider = hitInfo.collider;
		if (collider != null) {
			return collider;
		}
	}
	return null;
}

public function GetCurrentLevelSegment2(origin : Vector3) {
	var hitInfo : RaycastHit;
	if (Physics.Raycast(origin, Vector3(0, -1, 0), hitInfo, Mathf.Infinity, layerMask)) {
		//var body : Rigidbody = hitInfo.rigidbody;
		var collider : Collider = hitInfo.collider;
		if (collider != null) {
			Debug.Log(collider.transform.parent.tag + " - " + collider.bounds.size);
			return collider;
		}
	}
	return null;
}

public function GetCurrentLevelSegment(origin : GameObject) {
	var hitInfo : RaycastHit;
	if (Physics.Raycast(origin.transform.position, Vector3(0, -1, 0), hitInfo, Mathf.Infinity, layerMask)) {
		//var body : Rigidbody = hitInfo.rigidbody;
		var collider : Collider = hitInfo.collider;
		if (collider != null) {
			return collider;
		}
	}
	return null;
}

public function FindNextLevelSegment(currentSegment : Transform, forward : Vector3) {
	var length : int = 0;
	if (currentSegment.CompareTag("Straight")) {
		length = 8;
	} else if (currentSegment.CompareTag("Curve")) {
		length = 7;
	}
	var currentCentre : Vector3 = currentSegment.transform.position;
	var normalizedForward : Vector3 = forward.normalized;
	var newStart = currentCentre + (normalizedForward * length);
	//return GetCurrentLevelSegment(newStart);
}

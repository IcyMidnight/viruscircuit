#pragma strict

public var layerMask : LayerMask;

public function GetCurrentLevelSegment(origin : Camera) {
	var hitInfo : RaycastHit;
	if (Physics.Raycast(origin.transform.position, Vector3(0, -1, 0), hitInfo, Mathf.Infinity, layerMask)) {
		//var body : Rigidbody = hitInfo.rigidbody;
		var collider : Collider = hitInfo.collider;
		if (collider != null) {
			return collider.name;
		} else {
			return "no body";
		}
	}
	return "No Hit";
}

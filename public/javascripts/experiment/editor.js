
// start drawing line to connect to object
function startDrawLine(o){
	var pointer = canvas.getPointer(o.e);
	isDown = true;
	var points = [pointer.x, pointer.y, pointer.x, pointer.y];
	line = new fabric.Line(points, {
		strokeWidth: 1,
		stroke: '#3593CF'
	});
	line.selectable = false;
	canvas.add(line);
}

// while still drawing line
function onDrawLine(o){
	if(!isDown) return;
	var pointer = canvas.getPointer(o.e);
	line.set({ x2: pointer.x, y2: pointer.y});
	canvas.renderAll();
}

// finish drawing line
function stopDrawLine(){
	isDown = false;
}

// draw connector
function drawConnector(){
	// add connecting components to component properties
	currentObj.outputObj = connectingObj.id;
	connectingObj.inputObj = currentObj.id;

	// create polyline
	var connector = makeConnector();
	// create arrow tip
	var tip = makeTip();
	// console.log(tip);
	connector.tip = tip.id;

	// add polyline to canvas, remove old line
	canvas.remove(line);
	canvas.add(connector, tip);
	canvas.setActiveObject(connector);
	canvas.sendToBack(connector, tip);
	currentLine = connector;
	addLineToObj();
}

function makeConnector(){
	var obj1x, obj1y, obj2x, obj2y;

	// var current = getComponentFromId(currentObj.id);
	// var connecting = getComponentFromId(connectingObj.id);

	// set obj1x and obj2x based on connecting components location
	var connectForward = checkConnectionXPos(currentObj, connectingObj);
	if(connectForward){
		obj1x = currentObj.left + currentObj.width;
		obj2x = connectingObj.left;
	}
	else if(!connectForward) {
		obj1x = currentObj.left;
		obj2x = connectingObj.left + connectingObj.width;
	}
	obj1y = currentObj.top + (currentObj.height/2);
	obj2y = connectingObj.top + (connectingObj.height/2);

	// create polyline
	var connector = createPolyline(obj1x, obj1y, obj2x, obj2y); 

	return connector;
}

function createPolyline(obj1x, obj1y, obj2x, obj2y){
	var points = [
		{x: obj1x, y: obj1y},
		{x: (obj2x+obj1x)/2, y: obj1y},
		{x: (obj2x+obj1x)/2, y: obj2y},
		{x: obj2x, y: obj2y}
	];

	var connector = new fabric.ConnectorLine(points, {
		stroke: '#3593CF',
		strokeWidth: 2,
		fill: 'transparent',
		id: setComponentId("connector"),
		tip: null,
		startObj: currentObj.id,
		endObj: connectingObj.id,
		component_type: 'connector',
		hasControls: false,
		hasRotatingPoint: false,
		lockMovementY: true,
		lockMovementX: true
	});

	return connector;
}

function makeTip(){
	var obj1x, obj1y, obj2x, obj2y;

	// set c1x and c2x based on connecting components location
	var connectForward = checkConnectionXPos(currentObj, connectingObj);
	if(connectForward){
		obj2x = connectingObj.left + 5;
	}
	else {
		obj2x = connectingObj.left + connectingObj.width - 5;
	}
	obj2y = connectingObj.top + (connectingObj.height/2);

	// create arrow tip
	var arrowtip = createArrowTip(connectForward, obj2x, obj2y); 

	return arrowtip;
}

function createArrowTip(forward, obj2x, obj2y){

	var arrowtip = new fabric.ArrowTip({
		left:obj2x,
		top: obj2y,
		width: 12,
		height: 12,
		angle: 90,
		fill: '#3593CF',
		originX: 'center',
		id: setComponentId("tip"),
		component_type: "tip",
		hasControls: false,
		hasRotatingPoint: false,
		lockMovementX: true,
		lockMovementY: true
	});

	if(!forward){
		arrowtip.set('angle', 270);
	}

	return arrowtip;
}

function makeComponent(image, left, top, id, properties){


	var c = new fabric.ComponentImage(image, {
		left: left,
		top: top,
		width: 80,
		height: 80,
		padding: 5,
		line1: null,
		line2: null,
		inputObj: null,
		outputObj: null,
		id: setComponentId(id),
		component_type: id,
		hasControls: false,
		hasRotatingPoint: false,
		properties: properties,
		crossOrigin: 'anonymous'
	});


	canvas.setActiveObject(c);

	return c;
}

function addConnectorSymbol(component){
	var leftPos = component.left + component.width + 6;
	var topPos = component.top + (component.height/2) - 5;

	rectConnector = new fabric.Rect({
		left: leftPos,
		top: topPos,
		width: 10,
		height: 10,
		fill: '#3593CF',
		angle: 45
	});

	rectConnector.hasControls = rectConnector.hasBorders = false;
	rectConnector.lockMovementX = rectConnector.lockMovementY = true;

	canvas.add(rectConnector)
	rectConnector.bringToFront();
	canvas.renderAll();
}

function removeConnectorSymbol(){
	var activeObjects = canvas._activeObject;
	if(activeObjects != null){
		canvas.remove(rectConnector);
	}
}

function stopActiveObject(){
	var activeObjects = canvas._activeObject;
	if(activeObjects === null){
		canvas.remove(rectConnector);
		// hide properties panel
		// propertiesPanel.style.display = "none";
	}
}

function addLineToObj(){
	currentObj.line1 = currentLine.id;
	connectingObj.line2 = currentLine.id;
}

function moveConnectorSymbolWithComponent(component){
	var c = component;

	rectConnector.left = c.left + c.width + 6;
	rectConnector.top = c.top + (c.height/2) - 5;
}

function moveLineWithComponent(component){
	var c1 = component;
	var c2, polyline;
	
	if(c1.line1 != null){
		// Output Line
		c2 = getComponentFromId(c1.outputObj);
		polyline = getComponentFromId(c1.line1);
		moveOutputLine(polyline, c1, c2);
	}

	if(c1.line2 != null){
		// Input Line
		c2 = getComponentFromId(c1.inputObj);
		polyline = getComponentFromId(c1.line2);
		// console.log(polyline);
		moveInputLine(polyline, c1, c2);
	}
}

function moveOutputLine(line, c1, c2){
	var relativePoints;
	var lineCenter = line.getCenterPoint();

	// calculate new points
	relativePoints = calcNewPoints(line, c1, c2);
	// set the new points
	// set new left, top, width, and height of bounding box
	line.set({
		points: relativePoints,
		left: relativePoints[0].x + lineCenter.x,
		top: relativePoints[3].y + lineCenter.y,
		width: Math.abs(relativePoints[3].x - relativePoints[0].x),
		height: Math.abs(relativePoints[3].y - relativePoints[0].y)
	});
	line.setCoords();
}

function moveInputLine(line, c1, c2){
	var relativePoints;
	var lineCenter = line.getCenterPoint();

	// calculate new points
	relativePoints = calcNewPoints(line, c1, c2);
	// set the new points
	// set new left, top, width, and height of bounding box
	line.set({
		points: relativePoints,
		left: relativePoints[0].x + lineCenter.x,
		top: relativePoints[0].y + lineCenter.y,
		width: relativePoints[3].x - relativePoints[0].x,	
		height: relativePoints[3].y - relativePoints[0].y
	});
	line.setCoords();
}

function calcNewPoints(line, c1, c2){
	var relativePoints, c1x, c1y, c2x, c2y;

	// set c1x and c2x based on connecting components location
	var connectForward = checkConnectionXPos(c1, c2);
	if(connectForward){
		c1x = c1.left + c1.width;
		c2x = c2.left;
	}
	else {
		c1x = c1.left;
		c2x = c2.left + c2.width;
	}
	
	c1y = c1.top + (c1.height/2);
	c2y = c2.top + (c2.height/2);

	// get center point of line
	lineCenter = line.getCenterPoint();

	// calc and set new points
	line.set('points', [
		{x: c1x, y: c1y}, 
		{x: (c1x+c2x)/2, y: c1y}, 
		{x: (c1x+c2x)/2, y: c2y}, 
		{x: c2x, y: c2y}
	]);
	// translate points to use relative coordinates
	relativePoints = line.get('points').map(function(p){
		return {
			x: p.x - lineCenter.x,
			y: p.y - lineCenter.y
		};
	});

	return relativePoints;
}

function checkConnectionXPos(c1, c2){
	var forward;
	if(c2.left > c1.left){
		// c2 is forward on x axis
		forward = true;
	}
	else{
		// c2 is backward on x axis
		forward = false;
	}

	return forward;
}

function checkConnectionYPos(c1, c2){
	var above;
	if(c2.top > c1.top){
		// c2 is above c1
		above = true;
	}
	else{
		// c2 is below c1
		above = false;
	}

	return above;
}

function moveArrowTipWithComponent(c){
	var movingComponent, tip, forward, line;

	if(c.line1 != null){
		movingComponent = getComponentFromId(c.outputObj);
		line = getComponentFromId(c.line1);
		tip = getComponentFromId(line.tip);
		forward = checkConnectionXPos(c, movingComponent);
		setArrowTipPos(movingComponent, tip, forward);
	}

	if(c.line2 != null){
		var input = getComponentFromId(c.inputObj);
		movingComponent = c;
		line = getComponentFromId(c.line2);
		tip = getComponentFromId(line.tip);
		forward = checkConnectionXPos(input, movingComponent);
		setArrowTipPos(movingComponent, tip, forward);
	}
}

function setArrowTipPos(c, tip, forward){
	var cx, cy;

	if(forward){
		cx = c.left + 5;
	}
	else {
		cx = c.left + c.width - 5;
	}
	cy = c.top + (c.height/2);

	tip.set({
		left: cx,
		top: cy,
		angle: 90
	});

	if(!forward){
		tip.set('angle', 270);
	}
}

function showPropertiesPanel(name, component){
	console.log(name);
	propertiesPanel.style.display = "block";
	propertiesEmpty.style.display = "none";
	loadProperties(name, component);
	// propertyName.innerHTML = text;
}

function hidePropertiesPanel(){
	propertiesPanel.style.display = "none";
	propertiesEmpty.style.display = "block";
}

function checkIntersect(o){
	var intersectsObj;
	if(o.target != null){
		if(o.target.get('type') === "rect"){
			// check if line intersects
			intersectsObj = doesLineIntersect();

			// draw line if intersects
			ifLineIntersects(intersectsObj);
		}
	}
}

function doesLineIntersect(){
	var x2 = line.x2;
	var y2 = line.y2;
	intersectsObj = false;
	canvas.forEachObject(function(obj){
		if(obj.get('type') === "component-image"){
			// if line intersects with component
			if(x2 >= obj.left && x2 <= (obj.left + obj.width) && y2 >= obj.top && y2 <= (obj.top + obj.height)){
				intersectsObj = true;
				connectingObj = obj;
			}
		}
	});

	return intersectsObj;
}

function ifLineIntersects(intersectsObj){
	if(intersectsObj){
		if(currentObj === connectingObj){
			// to prevent component from connecting to itself
			canvas.remove(line);
			showErrorMessage("Component can't be connected to itself");
		}
		else if(currentObj.line1 === null && connectingObj.line2 === null){
			drawConnector();
		}
		else{
			canvas.remove(line);
			showErrorMessage("A component can only connect to one component.")
			// console.log("ERR: Component can only connect to one component.");
		}
	}
	else{
		canvas.remove(line);
		showErrorMessage("Please connect to a component.");
		// console.log("ERR: Please connect to a component.");
	}
}

function setComponentId(imageid){
	var num, id;

	// get number based on object type
	// increase num count and save to localstorage
	if(imageid === "connector"){
		if(localStorage.getItem('connectorcount') === null){
			num = 0;
		}
		else {
			num = localStorage.getItem('connectorcount');
		}
		num++;
		localStorage.setItem('connectorcount', num);
	}
	else if(imageid === "tip"){
		if(localStorage.getItem('tipcount') === null){
			num = 0;
		}
		else {
			num = localStorage.getItem('tipcount');
		}
		num++;
		localStorage.setItem('tipcount', num);
	}
	else{
		if(localStorage.getItem('componentcount') === null){
			num = 0;
		}
		else {
			num = localStorage.getItem('componentcount');
		}
		num++;
		localStorage.setItem('componentcount', num);
	}

	// canvas.forEachObject(function(obj){
	// 	if(obj.get('component_type') === imageid){
	// 		num++;
	// 	}
	// });

	id = imageid + "_" + num;

	return id;
}

function getComponentFromId(id){
	var component;
	canvas.forEachObject(function(obj){
		if(obj.get('id') === id){
			component = obj;
		}
	});

	return component;
}

function fixPositionAfterLoad(){
	console.log("fixing position")
	// move each object slightly left to fix position
	canvas.forEachObject(function(object){
		if(object.get('type') === 'component-image'){
			var x = object.get('left');
			object.set('left',x+1);
			object.setCoords();
			// canvas.renderAll();
			moveLineWithComponent(object);
		}
		
	});
}


function showErrorMessage(message){
	$(".canvas-notification.is-danger span").text(message);
	$(".canvas-notification.is-danger").addClass("show");
	setTimeout(function(){
		$(".canvas-notification.is-danger").removeClass("show");
	}, 4000);
}

function showSuccessMessage(message){
	$(".canvas-notification.is-primary span").text(message);
	$(".canvas-notification.is-primary").addClass("show");
	setTimeout(function(){
		$(".canvas-notification.is-primary").removeClass("show");
	}, 4000);
}






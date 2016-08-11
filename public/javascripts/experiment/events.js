
// variables
var activeComponent;
var startOffsetX, startOffsetY;
var rectConnector, line, isDown, currentObj, connectingObj, currentLine;
var panning = false;
var canvas, canvasContainer, components, propertiesPanel, propertiesEmpty, propertyName;

function initCanvasAndEvents(){

	console.log("initializing canvas")
	// initalize fabric js canvas
	canvas = new fabric.Canvas("qucs-editor");
	canvas.selection = false;
	fabric.Object.prototype.originX = "left";
	fabric.Object.prototype.originY = "top";

	// set event listeners for canvas
	canvas.on('object:selected', handleActiveObject);
	canvas.on('object:moving', handleMovingObject);
	canvas.on('mouse:up', handleMouseUp);
	canvas.on('mouse:down', handleMouseDown);
	canvas.on('mouse:move', handleMouseMove);

	// get canvas container
	canvasContainer = document.getElementsByClassName("canvas-container")[0];

	// set event listeners for canvas container
	canvasContainer.ondrop = handleDrop;
	canvasContainer.ondragover = handleDragOver;

	// get components
	components = document.querySelectorAll(".component-block");
	[].forEach.call(components, function(component){
		component.ondragstart = handleDragStart;
		component.ondragend = handleDragEnd;
	});

	// get properties panel
	propertiesPanel = document.getElementsByClassName("with-component")[0];
	propertiesEmpty = document.getElementsByClassName("without-component")[0];
	propertyName = document.getElementById("property-name");

	loadDesign();
}


// handle Event Listeners

// Canvas listeners
function handleDragStart(e){
	this.style.opacity = '0.4';
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/plain', this.id);
}

function handleDragEnd(e){
	this.style.opacity = '1';
	startOffsetX = e.offsetX;
	startOffsetY = e.offsetY;
}

function handleDragOver(e){
	e.preventDefault();
}

function handleDrop(e){
	e.preventDefault();

	// remove connector symbol from currently active objects
	removeConnectorSymbol();

	//get pos and id
	var dropX = e.offsetX / canvas.getZoom();
	var dropY = e.offsetY / canvas.getZoom();
	var id = e.dataTransfer.getData("text");
	console.log(id);
	var properties = getProperties(id);
	var dropElement = document.getElementById(id).getElementsByTagName('img')[0];

	// make and add component
	canvas.add(makeComponent(dropElement, dropX, dropY, id, properties));
	canvas.renderAll();
}

// Object listeners
function handleActiveObject(o){
	// remove connector symbol from currently active objects
	removeConnectorSymbol();

	if(o.target.get('type') === "component-image"){
		// Component is selected. Show connector symbol and properties panel
		currentObj = o.target;

		// show connector symbol
		addConnectorSymbol(o.target);

		// show properties panel
		activeComponent = currentObj;
		showPropertiesPanel(currentObj.component_type, currentObj)
	}
	else if(o.target.get('type') === "rect"){
		// Connector Symbol is selected. Start drawing line
		startDrawLine(o);
		canvas.remove(rectConnector);
	}
	else if(o.target.get('type') === "connector-line"){
		// Connector is selected. Show properties panel
		// showPropertiesPanel("connector");
	}
}

function handleMovingObject(o){

	if(o.target.get('type') === "component-image"){
		var component = o.target;

		// move connector symbol with component
		moveConnectorSymbolWithComponent(component);
		
		// move line with component
		moveLineWithComponent(component);
		moveArrowTipWithComponent(component);
	}

}

// Mouse listeners
function handleMouseUp(o){
	// remove connector symbol and properties panel from currently active component
	stopActiveObject();

	// stop drawing line
	stopDrawLine();

	// check if line ends at a component
	checkIntersect(o);

	// stop panning
	panning = false;
	
}

function handleMouseDown(o){
	// handle Mouse Down 

	// start panning
	if(!o.target){
		panning = true;

		// hide properties panel
		hidePropertiesPanel();
	}


	
}

function handleMouseMove(o){
	onDrawLine(o);

	// panning
	if(panning && o && o.e){
		var units = 10;
		var delta = new fabric.Point(o.e.movementX, o.e.movementY);
		canvas.relativePan(delta);
	}
}




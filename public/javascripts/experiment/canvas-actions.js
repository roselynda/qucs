
function canvasActions(){

	$("#save, .saveexit").on('click', function(){
		var currentZoom = canvas.getZoom();
		// deselect objects
		removeConnectorSymbol();
		canvas.deactivateAll().setZoom(1).renderAll();
		// save to json
		var savedcanvas = JSON.stringify(canvas);
		updateDesign(savedcanvas);
		// reset zoom
		canvas.setZoom(currentZoom);
	});

	$("#load").on('click', function(){
		var savedcanvas = localStorage.getItem('canvas');
		console.log("Loading canvas....");
		console.log(savedcanvas);
		canvas.clear();
		canvas.loadFromJSON(savedcanvas, canvas.renderAll.bind(canvas));
		setTimeout(fixPositionAfterLoad, 3000);
	});

	$("#zoom-in").on('click', function(){
		
		if(canvas.getZoom() < 1.34){
			showZoomSize(canvas.getZoom() * 1.1);
			canvas.setZoom(canvas.getZoom() * 1.1);
			canvas.renderAll();

			if(canvas.getZoom() > 0.5){
				$("#zoom-out").removeClass("is-disabled");
			}
		}
		else{
			$("#zoom-in").addClass("is-disabled");
		}
	});

	$("#zoom-out").on('click', function(){

		if(canvas.getZoom() > 0.5){
			showZoomSize(canvas.getZoom() / 1.1);
			canvas.setZoom(canvas.getZoom() / 1.1);
			canvas.renderAll();

			if(canvas.getZoom() < 1.34){
				$("#zoom-in").removeClass("is-disabled");
			}
		}
		else{
			$("#zoom-out").addClass("is-disabled");
		}
	});

	function showZoomSize(zoomsize){
		var size = zoomsize;
		size = Math.ceil(size * 10) * 10;

		$(".zoom-size").text(size + "%");
	}

	$("#print").click(function(){
		var currentZoom = canvas.getZoom();
		// deselect objects
		removeConnectorSymbol();
		canvas.deactivateAll().setZoom(0.5).renderAll();
		
		// save to json
		var savedcanvas = JSON.stringify(canvas);
		updateDesign(savedcanvas);

		// convert canvas to png
		// var canvasSvg = canvas.toDataURL('svg');
		// $("#printedcanvas").attr("src", canvasSvg);

		// open print dialog
		window.print();

		// reset to current zoom
		canvas.setZoom(currentZoom);

		
	});

	$("#reset").click(function(){
		canvas.clear();
	});

	$("#viewresults").click(function(){
		// save to json
		removeConnectorSymbol();
		canvas.deactivateAll().setZoom(1).renderAll();
		var savedcanvas = JSON.stringify(canvas);
		updateDesign(savedcanvas);

		// change view
		window.location = "/results";
	});

	$("#delete-component").on('click', function(){

		var activeObj = canvas.getActiveObject();
		var line, tip, connectingObj;

		if(activeObj.get('type') === "component-image"){
			// remove line connecting to component
			// remove line from connecting component properties
			if(activeObj.inputObj != null){
				connectingObj = getComponentFromId(activeObj.inputObj);
				connectingObj.line1 = null;
				connectingObj.outputObj = null;

				line = getComponentFromId(activeObj.line2);
				tip = getComponentFromId(line.tip);

				canvas.remove(line);
				canvas.remove(tip);
			}
			if(activeObj.outputObj != null){
				connectingObj = getComponentFromId(activeObj.outputObj);
				connectingObj.line2 = null;
				connectingObj.inputObj = null;

				line = getComponentFromId(activeObj.line1);
				tip = getComponentFromId(line.tip);

				canvas.remove(line);
				canvas.remove(tip);
			}

			// remove component
			canvas.remove(rectConnector);
			canvas.remove(activeObj);
		}
		else if(activeObj.get('type') === "connector-line"){
			// remove line from connecting components properties
			var startObj = getComponentFromId(activeObj.startObj);
			var endObj = getComponentFromId(activeObj.endObj);
			startObj.line1 = null;
			endObj.line2 = null;

			tip = getComponentFromId(activeObj.tip);

			// remove line
			canvas.remove(activeObj);
			canvas.remove(tip);
		}
		
	});


}
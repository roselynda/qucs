
// Components - inherinted from fabric.Image
fabric.ComponentImage = fabric.util.createClass(fabric.Image, {

	type: 'component-image',

	initialize: function(element, options){
		this.callSuper('initialize', element, options);
		this.set({
			line1: options.line1,
			line2: options.line2,
			inputObj: options.inputObj,
			outputObj: options.outputObj,
			id: options.id,
			component_type: options.component_type,
			hasControls: false,
			hasRotatingPoint: false,
			padding: 5,
			properties: options.properties,
			crossOrigin: 'anonymous'
		});
	},

	toObject: function(){
		return fabric.util.object.extend(this.callSuper('toObject'), {
			line1: this.get('line1'),
			line2: this.get('line2'),
			inputObj: this.get('inputObj'),
			outputObj: this.get('outputObj'),
			id: this.get('id'),
			component_type: this.get('component_type'),
			hasControls: this.get('hasControls'),
			hasRotatingPoint: this.get('hasRotatingPoint'),
			padding: this.get('padding'),
			properties: this.get('properties'),
			crossOrigin: this.get('crossOrigin')
		});
	},

	_render: function(ctx){
		this.callSuper('_render', ctx);

		ctx.font = "14px Arial";
		ctx.fillStyle = "#666";
		ctx.fillText(this.component_type.charAt(0).toUpperCase() + this.component_type.slice(1), -this.width/2, this.height-18);
		
	}

});

fabric.ComponentImage.fromObject = function(object, callback) {
  fabric.util.loadImage(object.src, function(img) {
    callback && callback(new fabric.ComponentImage(img, object));
  });
};

fabric.ComponentImage.async = true;


// Connector - inherited from fabric.Polyline

fabric.ConnectorLine = fabric.util.createClass(fabric.Polyline, {

	type: 'connector-line',

	initialize: function(points, options){
		this.callSuper('initialize', points, options);
		this.set({
			id: options.id,
			tip: options.tip,
			startObj: options.startObj,
			endObj: options.endObj,
			component_type: options.component_type,
			hasControls: false,
			hasRotatingPoint: false,
			lockMovementY: true,
			lockMovementX: true
		});
	},

	toObject: function(){
		return fabric.util.object.extend(this.callSuper('toObject'), {
			id: this.get('id'),
			tip: this.get('tip'),
			startObj: this.get('startObj'),
			endObj: this.get('endObj'),
			component_type: this.get('component_type'),
			hasControls: this.get('hasControls'),
			hasRotatingPoint: this.get('hasRotatingPoint'),
			lockMovementY: this.get('lockMovementY'),
			lockMovementX: this.get('lockMovementX'),
		});
	}	

});

fabric.ConnectorLine.fromObject = function(object, callback){
	fabric.util.enlivenObjects(object, function(enlivenedObjects){
		callback && callback(new fabric.ConnectorLine(enlivenedObjects, object));
	});
};

fabric.ConnectorLine.async = true;


// Connector Tip - inherited from fabric.Triangle

fabric.ArrowTip = fabric.util.createClass(fabric.Triangle, {

	type: 'arrow-tip',

	initialize: function(options){
		this.callSuper('initialize', options);
		this.set({
			id: options.id,
			component_type: options.component_type,
			hasControls: false,
			hasRotatingPoint: false,
			lockMovementX: true,
			lockMovementY: true
		});
	},

	toObject: function(){
		return	 fabric.util.object.extend(this.callSuper('toObject'), {
			id: this.get('id'),
			component_type: this.get('component_type'),
			hasControls: this.get('hasControls'),
			hasRotatingPoint: this.get('hasRotatingPoint'),
			lockMovementX: this.get('lockMovementX'),
			lockMovementY: this.get('lockMovementY')
		});
	}

});

fabric.ArrowTip.fromObject = function(object, callback){
	// return new fabric.ArrowTip(object);
	fabric.util.enlivenObjects(object, function(enlivenedObjects){
		callback && callback(new fabric.ArrowTip(object));
	});
}

fabric.ArrowTip.async = true;











var current_experiment = {
	"id": "",
	"name": "",
	"json": ""
}

var groupArr = [];

function createNewExperiment(){
	// console.log("creating...")
	var experiment_name = $("#input_experiment_name").val();

	if(experiment_name === ""){
		// show error notification
		console.log("please enter an experiment name");
	}
	else{
		var formdata = {
			"design[name]": experiment_name,
			"design[json]": "",
			"design[updated_by]": current_user['id']
		}

		// console.log(formdata);

		$.ajax({
			type: "POST",
			headers: {"Access-Control-Allow-Origin": "*"},
			url: "http://zaquantum-backend.herokuapp.com/api/v1/designs",
			dataType: "json",
			data: formdata,
			success: function(data){
				console.log("new experiment created");
				
				current_experiment['name'] = experiment_name;
				current_experiment['id'] =  data.design_id;
				design_edit_id = data.design_id;
				localStorage.setItem('current_experiment', JSON.stringify(current_experiment));

				// add current user to contributors list
				addCurrentUser();

				

				loadDesign();
			},
			error: function(data){
				// show error notification
				console.log("error: ");
				console.log(data);
			}
		})
	}
}

function openExperiment(id){
	// console.log(id);
	var exp_id = parseInt(id.substring(id.lastIndexOf('_') + 1, id.length));

	url = "http://zaquantum-backend.herokuapp.com/api/v1/designs/" + exp_id;

	// search for exp
	$.ajax({
		type: "GET",
		headers: {"Access-Control-Allow-Origin": "*"},
		url: url,
		dataType: "json",
		success: function(data){
			// console.log(data);
			var design = data.design;

			current_experiment['id'] = exp_id;
			design_edit_id = exp_id;
			current_experiment['name'] = design.name;
			current_experiment['json'] = design.json;
			localStorage.setItem('current_experiment', JSON.stringify(current_experiment));
			
			window.location = "/experiment";
		}
	})
}

function editExperiment(id){
	var exp_id = parseInt(id.substring(id.lastIndexOf('_') + 1, id.length));
	var selected_design_name;

	var url = "http://zaquantum-backend.herokuapp.com/api/v1/designs/" + exp_id;

	// search for exp
	$.ajax({
		type: "GET",
		headers: {"Access-Control-Allow-Origin": "*"},
		url: url,
		dataType: "json",
		success: function(data){
			var design = data.design;
			$("#input_exp_edit").val(design.name);
		}
	})

	$(".button_edit_name").click(function(){
		var newname = $("#input_exp_edit").val();
		console.log("changing name to: " + newname);
		if(newname !== selected_design_name){
			// update name 
			var expdata = {
				"design[id]": exp_id,
				"design[name]": newname
			}

			renameExperiment(expdata, exp_id);
		}
	});
}

function renameExperiment(newdata, id){

	var url = "http://zaquantum-backend.herokuapp.com/api/v1/designs/" + id;

	$.ajax({
		type: "PUT",
		headers: {"Access-Control-Allow-Origin": "*"},
		url: url,
		dataType: "json",
		data: newdata,
		success: function(data){
			$("#modal-edit").removeClass("is-active");
			$("body").removeClass("no-scroll");
			window.location.reload();
		},
		error: function(data){
			// show error notification
			console.log("error: ");
			console.log(data);
		}
	})
}

function updateExperimentName(){

	var exp_rename = $("#input_exp_rename").val();

	if(current_experiment['name'] !== exp_rename){
		var formdata = {
			"design[name]": exp_rename,
			"design[json]": current_experiment['json'],
			"design[updated_by]": current_user['id']
		}

		var url = "http://zaquantum-backend.herokuapp.com/api/v1/designs/" + current_experiment['id'];

		$.ajax({
			type: "PUT",
			headers: {"Access-Control-Allow-Origin": "*"},
			url: url,
			dataType: "json",
			data: formdata,
			success: function(data){
				
				current_experiment['name'] = exp_rename;
				localStorage.setItem('current_experiment', JSON.stringify(current_experiment));

				$("#modal-button-editname span").text(current_experiment['name']);
				$("#modal-editname").removeClass("is-active")
			},
			error: function(data){
				// show error notification
			}
		})
	}
}

function updateDesign(design){

	var savedcanvas = design;

	var formdata = {
		"design[name]": current_experiment['name'],
		"design[json]": savedcanvas,
		"design[updated_by]": current_user['id']
	}

	var url = "http://zaquantum-backend.herokuapp.com/api/v1/designs/" + current_experiment['id'];

	$.ajax({
		type: "PUT",
		headers: {"Access-Control-Allow-Origin": "*"},
		url: url,
		dataType: "json",
		data: formdata,
		success: function(data){
			console.log("experiment design updated");
			current_experiment['json'] = savedcanvas;
			localStorage.setItem('current_experiment', JSON.stringify(current_experiment));

			showSuccessMessage("Experiment saved.")
		},
		error: function(data){
			// show error notification
			showErrorMessage("Error: Couldn't save experiment");
		}
	})

}

function updateAndRunDesign(design){

	var savedcanvas = design;

	var formdata = {
		"design[name]": current_experiment['name'],
		"design[json]": savedcanvas,
		"design[updated_by]": current_user['id']
	}

	var url = "http://zaquantum-backend.herokuapp.com/api/v1/designs/" + current_experiment['id'];

	$.ajax({
		type: "PUT",
		headers: {"Access-Control-Allow-Origin": "*"},
		url: url,
		dataType: "json",
		data: formdata,
		success: function(data){
			console.log("experiment design updated");
			current_experiment['json'] = savedcanvas;
			localStorage.setItem('current_experiment', JSON.stringify(current_experiment));

			showSuccessMessage("Experiment saved.")
		},
		error: function(data){
			// show error notification
			showErrorMessage("Error: Couldn't save experiment");
		}
	})

	runExperiment();

}

function loadDesign(){
	console.log("loading experiment...")

	// update experiment name in editor view
	$("#modal-button-editname span").text(current_experiment['name']);
	$("#input_exp_rename").val(current_experiment['name']);

	console.log("loading canvas");
	var savedcanvas = current_experiment['json'];
	canvas.loadFromJSON(savedcanvas, canvas.renderAll.bind(canvas));
}

function reorderObjectsinJSON(savedcanvas){
	console.log("reordering")
	var current = JSON.parse(savedcanvas);

	$.each(current.objects, function(i, val) {
		console.log(i);
		console.log(val);
		if(val.type === 'connector-line'){
			console.log("pushing to back")
			var connectorObj = val;
			// delete current.objects[i];
			current.objects.splice(i, 1);
			current.objects.push(connectorObj);
		}
	});

	console.log(current);

	return JSON.stringify(current);
	
}

function reAddConnectors(){

	canvas.forEachObject(function(obj){
		if(obj.get('type') === 'connector-line'){
			console.log("removing...");
			console.log(obj);
			var connector = obj;
			canvas.remove(obj);
			canvas.add(connector);
		}
	});

}

function deleteExperiment(){
	var id = parseInt(temp_exp_id.substring(temp_exp_id.lastIndexOf('_') + 1, temp_exp_id.length));
	console.log(id);

	url = "http://zaquantum-backend.herokuapp.com/api/v1/designs/" + id;

	$.ajax({
		type: "DELETE",
		headers: {"Access-Control-Allow-Origin": "*"},
		url: url,
		dataType: "json",
		success: function(data){
			console.log("deleted experiment");
			window.location.reload();
		},
		error: function(data){
			// show error notification
			window.location.reload();
		}
	})
}

function runExperiment(){
	console.log("running exp.");


	var formdata = {
		"design": current_experiment.json
	};

	console.log("Sent JSON:" + formdata.design);
	var url = "http://128.199.96.91/qucserver2/";

	$.ajax({
		type: "POST",
		headers: {"Access-Control-Allow-Origin": "*"},
		url: url,
		dataType: "json",
		data: formdata,
		success: function(data){
			console.log("Response from server: " + JSON.stringify(data));
			localStorage.setItem('current_results', JSON.stringify(data));

			window.location = "/results";
			initGraph();
		},
		error: function(data){
			// show error notification
			console.log("error: ");
			// console.log(data.responseText);
		}
	})
}

function loadAllExperiments(){

	// var url = "http://zaquantum-backend.herokuapp.com/api/v1/designs";
	var url = "http://zaquantum-backend.herokuapp.com/api/v1/designs?user_id=" + current_user.id;
	console.log(url);
	$.ajax({
		type: "GET",
		headers: {"Access-Control-Allow-Origin": "*"},
		url: url,
		dataType: "json",
		success: function(data){
			console.log("loading all experiments");
			console.log(data);

			if(data.designs.length > 0){
				$("h3.no-experiments").hide();
				var table_header = '<thead><tr><th style="width: 30%">Project Name</th><th>Last Modified</th><th>Collaborators</th><th style="width: 20%"></tr></thead>';
				var table = '<table id="dashboard_list" class="table is-bordered table-dashboard">' + table_header + '<tbody class="list"></tbody></table>';
				$(".column-for-table").append(table);
			}

			for(var i = 0; i < data.designs.length; i++){
				var design = data.designs[i];

				// create table row
				var team_exp_row = '<div class="team" modal-button-edit"><div class="team-member"><span>A</span></div></div>';
				var button_open = '<a id="exp_' + design.id + '" class="button open-exp is-secondary is-outlined" onclick="openExperiment()">Open</a>';
				var button_edit = '<a id="exp_' + design.id + '" class="modal-button-edit button is-icon is-primary is-outlined extra-margin" onclick="loadContributorsWithId('+design.id+')"><i class="fa fa-edit"></i></a>';
				var button_delete = '<a id="exp_' + design.id + '" class="modal-button-deleteproject button is-icon is-primary is-outlined"><i class="fa fa-trash"></i></a>';
				var buttons_exp_row = button_open + button_edit + button_delete;
				var exp_row = '<tr id="row_'+ design.id +'"><td class="name"><span class="experiment-name-'+design.id+'">'+ design.name + '</span></td><td>lastmodified</td><td></td><td>'+ buttons_exp_row +'</td></tr>'
				$(exp_row).prependTo("#dashboard_list > tbody");
				
			}

		},
		error: function(data){
			// show error notification
		}
	})

}

function loadComponents(){

	var groups = groupArr;

	$.ajax({
		type: "GET",
		headers: {"Access-Control-Allow-Origin": "*"},
		url: "http://zaquantum-backend.herokuapp.com/api/v1/components",
		dataType: "json",
		success: function(data){
			console.log(data);

			// save components to localstorage for faster retrival
			var localcomponents = JSON.stringify(data.components);
			localStorage.setItem('allcomponents', localcomponents);

			for(var j=0; j < groups.length; j++){
				console.log(groups[j]);
				if(j === 0){
					var labelDiv = '<div class="components-group-label is-clearfix"><h4 class="text-gray text-uppercase is-pulled-left">' + groups[j][1] + '</h4><i class="fa fa-minus is-pulled-right"></i></div>';
					var container = '<div class="components-group-container active" id="'+groups[j][0]+'"></div>';
				}
				else{
					var labelDiv = '<div class="components-group-label is-clearfix"><h4 class="text-gray text-uppercase is-pulled-left">' + groups[j][1] + '</h4><i class="fa fa-plus is-pulled-right"></i></div>';
					var container = '<div class="components-group-container" id="'+groups[j][0]+'"></div>';
				}
				$(".components-accordion").append(labelDiv);
				$(".components-accordion").append(container);

				for(var i = 0; i < data.components.length; i++){
					var comp = data.components[i];

					if(comp.component_group_id === groups[j][0]){
						var id = comp.name.replace(/ /g, "_");

						var image = '<div class="image-container"><img src="'+ comp.picture.picture.url +'" /></div>';
						var title = '<h4 class="name">'+ comp.name + '</h4>';
						var componentDiv = '<div class="component-block" id="' + id + '" draggable="true">' + image + title +'</div>';
						
						
						$(".components-group-container#" + groups[j][0]).append(componentDiv);
					}
				}

			}

			// load canvas
			initCanvasAndEvents();

		},
		error: function(data){
			// show error notification
			console.log("error: ");
			console.log(data);
		}
	})
}

function loadComponentGroups(){

	$.ajax({
		type: "GET",
		headers: {"Access-Control-Allow-Origin": "*"},
		url: "http://zaquantum-backend.herokuapp.com/api/v1/component_groups",
		dataType: "json",
		success: function(data){

			var group = data.component_groups;

			for(var i = 0; i < group.length; i++){
				var compgroup = [group[i].id, group[i].name]
				groupArr.push(compgroup);
				console.log(groupArr[0][0] + ", " + groupArr[0][1]);
			}

			loadComponents();

		},
		error: function(data){
			// show error notification
			console.log("error: ");
			console.log(data);
		}
	})
}


function loadProperties(name, component){
	var comp_name = name;
	var currentComponent = component;

	console.log("in loadProperties function");
	console.log(comp_name);
	console.log(currentComponent);

	var namewithoutspace = comp_name.replace(/_/g," ");

	$.ajax({
		type: "GET",
		headers: {"Access-Control-Allow-Origin": "*"},
		url: "http://zaquantum-backend.herokuapp.com/api/v1/components",
		dataType: "json",
		success: function(data){

			var comp = data.components;
			$("div.property-row").remove();
			for(var i=0; i< comp.length; i++){

				if(comp[i].name === namewithoutspace){
					console.log("loading properties")
					
					// var properties = JSON.parse(currentComponent.properties);
					var properties = currentComponent.properties;
					console.log(properties)
					$("div.property-row").remove();

					for(var j=0; j < properties.length; j++){

						var name = '<p>' + properties[j].name + ' (' + properties[j].unit_type +')</p>'
						
						if(properties[j].value_type === "integer"){
							var input = '<input class="input" type="number" name="'+ properties[j].name +'" value="'+ properties[j].param_value +'" step="1" />';
						}
						else if(properties[j].value_type === "real"){
							var input = '<input class="input" type="number" name="'+ properties[j].name +'" value="'+ properties[j].param_value +'" step="0.1" />';
						}
						else if(properties[j].value_type === "string"){
							var input = '<input class="input" type="text" name="'+ properties[j].name +'" value="'+ properties[j].param_value +'" />';
						}

						var row = '<div class="property-row">' + name + input +'</div>'
						$(".with-component .properties-list").append(row);
					}

				}

			}
		},
		error: function(data){
			// show error notification
			console.log("error: ");
			console.log(data);
		}
	})

}

function getProperties(name){
	var components = JSON.parse(localStorage.getItem('allcomponents'));
	var properties;

	console.log(name);
	// replace underscore with space to match with components list from API
	// HTML5 dropzone requires there to be no space when dragging.
	var namewithoutspace = name.replace(/_/g," ");
	console.log("namewithoutspace: " + namewithoutspace);
	// console.log(components);

	for(var i=0; i < components.length; i++){

		if(components[i].name === namewithoutspace){
			properties = components[i].parameters;
		}
	}

	console.log("get properties")
	console.log(properties)

	// return JSON.stringify(properties);
	return properties;
}

function saveProperties(){
	var tempcomponents = JSON.parse(localStorage.getItem('allcomponents'));

	$(".properties-list input").each(function(){

		var prop_name = $(this).attr('name');
		var prop_val = $(this).val();
		savePropertyValueToJson(prop_name, prop_val, tempcomponents);
	});
}

function savePropertyValueToJson(name, value, components){
	var components = components;
	var properties;

	// get old properties
	for(var i=0; i < components.length; i++){
		console.log(activeComponent.component_type)
		var componenttype = activeComponent.component_type.replace(/_/g, " ");
		if(components[i].name === componenttype){
			properties = components[i].parameters;
		}
	}	

	// change values
	for(var j=0; j < properties.length; j++){
		if(properties[j].name === name){
			console.log("old: " + properties[j].param_value);
			properties[j].param_value = value;
			console.log("new: " + properties[j].param_value);
		}
	}
	console.log(JSON.stringify(properties));
	// save new properties to canvas and localstorage
	// activeComponent.properties = JSON.stringify(properties);
	activeComponent.properties = properties;
	console.log(activeComponent);
}






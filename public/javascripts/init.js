
$(document).ready(function(){

	// initialize js functions based on the order needed

	// Priority 1: Fabricjs Custom Objects, Tour, User Logins, Loading designs, Loading components
	// Priority 2: Canvas, events calling for canvas, Modals/Buttons
	// Priority 3: Editor/Canvas functionality, Results graph

	// check if there is a current user
	if(localStorage.getItem('current_user') !== null){
		current_user = JSON.parse(localStorage.getItem('current_user'));
	}

	// non page specific / global
	loginUser();
	logoutUser();
	loadUserDetails();

	initButtonsToggle();
	initDropdown();
	initPricing();

	
	if(window.location.pathname === "/dashboard"){
		// dashboard
		loadAllExperiments();
		setTimeout(initModals, 1000);
		setTimeout(function(){
			$(".open-exp").click(function(){
				var id = $(this).attr('id');
				console.log("open-exp clicked. id: " + id);
				openExperiment(id);
			});
		}, 3000);
	}
	else if(window.location.pathname === "/experiment" && localStorage.getItem('current_experiment') !== null ){
		// editor
		initShepherd();
		current_experiment = JSON.parse(localStorage.getItem('current_experiment'));
		loadComponentGroups();
		// note: components load after component groups. 
		// note: canvas loads after components
		setTimeout(componentsAccordion, 3000);
		canvasActions();
		setTimeout(initModals, 1000);
	}
	else if(window.location.pathname === "/results"){
		// results graph
		initGraph();
	}
})
var temp_exp_id;

function componentsAccordion(){
	// all component Groups
	var componentPanels = $(".components-accordion > .components-group-container");
	var componentIcons = $(".components-accordion > .components-group-label > i");

	// hide those that aren't active
	$(".components-accordion > .components-group-container").each(function(){
		if(!$(this).hasClass("active")){
			$(this).hide();
		}
	})

	// show on click
	$(".components-accordion > .components-group-label").click(function(){

		// check if it's not active before sliding down
		if(!$(this).next().hasClass("active")){
			componentPanels.removeClass("active").slideUp();
			componentIcons.removeClass("fa-minus").addClass("fa-plus");
			$(this).next().addClass("active").slideDown();
			var icon = $(this).find("i");
			$(icon).removeClass("fa-plus").addClass("fa-minus");
		}
	});
}

function initModals(){

	// Create experiment modal
	$("#modal-button-create").click(function(){
		$("#modal-create").addClass("is-active");
		$("body").addClass("no-scroll");
		$(".team.team-invite .team-member-user").remove();
		$("#modal-create .notification").hide();
	});

	$("#modal-create > .modal-background, #modal-create .modal-close").click(function(){
		$("#modal-create").removeClass("is-active");
		$("body").removeClass("no-scroll");
	});

	// Create experiment modal
	$("#modal-button-invite").click(function(){
		$("#modal-invite").addClass("is-active");
		$("body").addClass("no-scroll");
	});

	$("#modal-invite > .modal-background, #modal-invite .modal-close").click(function(){
		$("#modal-invite").removeClass("is-active");
		$("body").removeClass("no-scroll");
	});

	// Edit experiment modal
	$(".modal-button-edit").click(function(){
		$("#modal-edit").addClass("is-active");
		$("body").addClass("no-scroll");
		$("#modal-edit .notification").hide();
		var id = $(this).attr('id');
		editExperiment(id);
	});

	$("#modal-edit > .modal-background, #modal-edit .modal-close").click(function(){
		$("#modal-edit").removeClass("is-active");
		$("body").removeClass("no-scroll");
	});

	// Delete experiment modal
	$(".modal-button-deleteproject").click(function(){
		$("#modal-deleteproject").addClass("is-active");
		$("body").addClass("no-scroll");
		temp_exp_id = $(this).attr('id');
	});

	$("#modal-deleteproject > .modal-background, #modal-deleteproject .modal-close, #modal-deleteproject .modal-buttons > a").click(function(){
		$("#modal-deleteproject").removeClass("is-active");
		$("body").removeClass("no-scroll");
	});

	// Leave experiment modal
	$(".modal-button-leaveproject").click(function(){
		$("#modal-leaveproject").addClass("is-active");
		$("body").addClass("no-scroll");
	});

	$("#modal-leaveproject > .modal-background, #modal-leaveproject .modal-close, #modal-leaveproject .modal-buttons > a").click(function(){
		$("#modal-leaveproject").removeClass("is-active");
		$("body").removeClass("no-scroll");
	});

	

	// Edit name Modals
	$("#modal-button-editname").click(function(){
		$("#modal-editname").addClass("is-active");
		$("body").addClass("no-scroll");
	});

	$("#modal-editname > .modal-background, #modal-editname .modal-close, #modal-editname .modal-buttons > a").click(function(){
		$("#modal-editname").removeClass("is-active");
		$("body").removeClass("no-scroll");
	});

	// Run experiment Modal
	$("#modal-button-run").click(function(){
		$("#modal-run").addClass("is-active");
		$("body").addClass("no-scroll");

		// save
		removeConnectorSymbol();
		canvas.deactivateAll().setZoom(1).renderAll();
		var savedcanvas = JSON.stringify(canvas);
		updateAndRunDesign(savedcanvas);

		// runExperiment();
	});

	$("#modal-run > .modal-background, #modal-run .modal-close, #modal-run .modal-buttons > a").click(function(){
		$("#modal-run").removeClass("is-active");
		$("body").removeClass("no-scroll");
	});

	// Results Modal
	$("#modal-button-results").click(function(){
		$("#modal-results").addClass("is-active");
		$("body").addClass("no-scroll");
	});

	$("#modal-results > .modal-background, #modal-results .modal-close, #modal-results .modal-buttons > a").click(function(){
		$("#modal-results").removeClass("is-active");
		$("body").removeClass("no-scroll");
	});

	// help modal
	$("#canvas-help").click(function(){
		$("#modal-help").addClass("is-active");
		$("body").addClass("no-scroll");
	});

	$("#modal-help > .modal-background, #modal-help .modal-close, #modal-help .modal-buttons > a").click(function(){
		$("#modal-help").removeClass("is-active");
		$("body").removeClass("no-scroll");
	});

	// help modal
	$("#modal-button-reset").click(function(){
		$("#modal-reset").addClass("is-active");
		$("body").addClass("no-scroll");
	});

	$("#modal-reset > .modal-background, #modal-reset .modal-close, #modal-reset .modal-buttons > a").click(function(){
		$("#modal-reset").removeClass("is-active");
		$("body").removeClass("no-scroll");
	});

}

function initButtonsToggle(){
	$(".show-invite").click(function(){
		$(".invite-block").addClass("show");
	});	
}


function initPricing(){

	var priceacademic = true;

	$("li#academic").click(function(){
		if(!$(this).hasClass("is-active")){
			$(this).addClass("is-active");
			$("li#nonacademic").removeClass("is-active");

			// change price to academic
			changePriceType(true);
			priceacademic = true;

			// reset select to annual
			$("#basic select").val("year");
			$("#intermediate select").val("year");
			$("#advance select").val("year");

			// remove monthly option from basic select
			$("#basic select option[value='month']").remove();

		}
	});

	$("li#nonacademic").click(function(){
		if(!$(this).hasClass("is-active")){
			$(this).addClass("is-active");
			$("li#academic").removeClass("is-active");

			// change price to non-academic
			changePriceType(false);
			priceacademic = false;

			// reset select to annual
			$("#basic select").val("year");
			$("#intermediate select").val("year");
			$("#advance select").val("year");

			// add monthly option to basic select
			$("#basic select").append('<option value="month">Monthly</option>');
		}
	});

	$("#basic select").on('change', function(){
		var duration = $('#basic select').val();

		if(duration === "year" && priceacademic){
			changePriceDuration("#basic h1", "1,000");
		}
		else if(duration === "month" && !priceacademic){
			changePriceDuration("#basic h1", "300");
		}
		else if(duration === "year" && !priceacademic){
			changePriceDuration("#basic h1", "3,000");
		}
	});

	$("#intermediate select").on('change', function(){
		var duration = $('#intermediate select').val();

		if(duration === "month" && priceacademic){
			changePriceDuration("#intermediate h1", "300");
		}
		else if(duration === "year" && priceacademic){
			changePriceDuration("#intermediate h1", "3,000");
		}
		else if(duration === "month" && !priceacademic){
			changePriceDuration("#intermediate h1", "1,000");
		}
		else if(duration === "year" && !priceacademic){
			changePriceDuration("#intermediate h1", "10,000");
		}
	});

	$("#advance select").on('change', function(){
		var duration = $('#advance select').val();

		if(duration === "month" && priceacademic){
			changePriceDuration("#advance h1", "500");
		}
		else if(duration === "year" && priceacademic){
			changePriceDuration("#advance h1", "5,000");
		}
		else if(duration === "month" && !priceacademic){
			changePriceDuration("#advance h1", "2,000");
		}
		else if(duration === "year" && !priceacademic){
			changePriceDuration("#advance h1", "20,000");
		}
	});

}

function changePriceType(priceacademic){
	var academic = ["1,000", "3,000", "5,000"];
	var nonacademic = ["3,000", "10,000", "20,000"];

	if(priceacademic){
		$("#basic h1").html("<sup>RM</sup> " + academic[0]);
		$("#intermediate h1").html("<sup>RM</sup> " + academic[1]);
		$("#advance h1").html("<sup>RM</sup> " + academic[2]);
	}
	else{
		$("#basic h1").html("<sup>RM</sup> " + nonacademic[0]);
		$("#intermediate h1").html("<sup>RM</sup> " + nonacademic[1]);
		$("#advance h1").html("<sup>RM</sup> " + nonacademic[2]);
	}
}

function changePriceDuration(id, change){
	$(id).html("<sup>RM</sup> " + change);
}

function initDropdown(){
	$(".nav-current-user").click(function(){
		$("#dashboard-account").slideToggle();
	});
}









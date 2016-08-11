var current_user = {
		"auth_token": "",
		"id": "",
		"name": "",
		"email": "",
		"plantype": "1",
		"planname": "basic",
		"image": "",
	}

var design_edit_id;


function submitRegisterForm(){
	var usertype, company, name, email, password, confirmpassword;
	
	// get form values
	usertype = $("#registerform").find('select[name="usertype"]').val();
	company = $("#registerform").find('input[name="company"]').val();
	name = $("#registerform").find('input[name="fullname"]').val();
	email = $("#registerform").find('input[name="email"]').val();
	password = $("#registerform").find('input[name="password"]').val();
	confirmpassword = $("#registerform").find('input[name="confirmpassword"]').val();

	// validate input
	if(usertype === "" || company === "" || name === "" || email === "" || password === "" || confirmpassword === ""){
		// form incomplete
		$(".register-block .notification").show();
		$(".register-block .notification").text("Please fill up all fields.");
	}
	else if(password !== confirmpassword){
		// confirm password doesn't match
		$(".register-block .notification").show();
		$(".register-block .notification").text("Password and Confirm Password doesn't match. Please try again.");
	}
	else {
		var formdata = {
			"user[email]": email,
			"user[password]": password,
			"user[password_confirmation]": confirmpassword,
			"user[organization_name]": company,
			"user[is_student]": usertype,
			"user[name]": name,
			"user[plan_name": "Basic"
		};
		// postCorsRequest('http://zaquantum-backend.herokuapp.com/api/v1/users', formdata);
		$.ajax({
			type: "POST",
			headers: {"Access-Control-Allow-Origin": "*"},
			url: "http://zaquantum-backend.herokuapp.com/api/v1/users",
			dataType: "json",
			data: formdata,
			success: function(data){
				// save data to localStorage
				current_user['auth_token'] = data.auth_token;
				current_user['id'] = data.user_id;
				current_user['email'] = email;
				current_user['name'] = name;
				current_user['plantype'] = usertype;
				localStorage.setItem('current_user', JSON.stringify(current_user));
				
				console.log("registered");
				window.location = "/selectplan";
			},
			error: function(data){
				// show error notification
				console.log("error: please check form submission.");
				$(".register-block .notification").show();
			}
		})
	}
}

function loginUser(){
	var email, password;

	$("#loginuser").click(function(){
		email = $("#login_email").val();
		password = $("#login_password").val();

		var formdata = {
			"email": email,
			"password": password
		}

		$.ajax({
			type: "POST",	
			headers: {"Access-Control-Allow-Origin": "*"},
			url: "http://zaquantum-backend.herokuapp.com/api/v1/user_sessions",
			dataType: "json",
			data: formdata,
			success: function(data){
				current_user['auth_token'] = data.auth_token;
				current_user['email'] = email;
				current_user['id'] = data.user;
				localStorage.setItem('current_user', JSON.stringify(current_user));
				console.log("logged in");
				window.location = "/dashboard";
			},
			error: function(data){
				$(".register-block .notification").show();
			}
		})

	});

}

function logoutUser(){

	$("#logoutuser").click(function(){
		// destroy session
		console.log("signing out");
		localStorage.removeItem('current_user');
		window.location = "/";
	});
	
}


function redirects(){
	var pathname = window.location.pathname;

	if(pathname === "/register" || pathname === "/signin"){
		if(localStorage.getItem('current_user') !== null){
			window.location = "/dashboard";
		}
	}
	else if (pathname !== "/"){
		if(localStorage.getItem('current_user') === null){
			window.location = "/signin";
		}
	}
}

function loadUserDetails(){
	var current_user = JSON.parse(localStorage.getItem('current_user'));
	$(".nav-current-user h4").text(current_user.name);
	$("#dropdownname").text(current_user.name);
	$("#dropdownemail").text(current_user.email);
	$("#dropdownplanname").text(current_user.planname);
	$("#dropdownplanname").addClass("tag-" + current_user.planname.toLowerCase());

	if(current_user.image === "" || current_user.image === undefined){
		// show intials
		var initial = current_user.name.charAt(0);
		$(".nav-current-user .user span").text(initial);
		$(".dropdown-user .user span").text(initial);
		$(".account-user .user span").text(initial);
	}
	else {
		// show image
		$(".nav-current-user .user img").show();
		$(".nav-current-user .user span").hide();
		$(".nav-current-user .user img").attr('src', current_user.image);

		$(".dropdown-user .user img").show();
		$(".dropdown-user .user span").hide();
		$(".dropdown-user .user img").attr('src', current_user.image);

		$(".account-user .user img").show();
		$(".account-user .user span").hide();
		$(".account-user .user img").attr('src', current_user.image);
	}
}



function inviteuser(loc){

	var email = $("#input_invite_email_" + loc).val();

	checkIfUserExists(email);
	setTimeout(initRemoveModal, 3000);
}

function checkIfUserExists(user_email){
	var email = user_email;

	$.ajax({
		type: "GET",	
		headers: {"Access-Control-Allow-Origin": "*"},
		url: "http://zaquantum-backend.herokuapp.com/api/v1/users?email=" + email,
		dataType: "json",
		success: function(data){
			if(data === null){
				$("#modal-invite .notification").show();
				$("#modal-edit .notification").show();
				$("#modal-create .notification").show();
			}
			else{
				addUserToExperiment(data);
			}
		},
		error: function(data){
			
		}
	})
}

function addCurrentUser(){
	console.log("adding current user ")

	var formdata = {
		"contributor[user_id]": current_user.id,
		"contributor[design_id]": current_experiment.id,
		"contributor[is_owner]": 1
	}

	$.ajax({
		type: "POST",	
		headers: {"Access-Control-Allow-Origin": "*"},
		url: "http://zaquantum-backend.herokuapp.com/api/v1/contributors",
		dataType: "json",
		data: formdata,
		success: function(data){
			console.log(data.contributor_id)

			// Show user in modal
			var initial = current_user.name.charAt(0);
			var thumbnail = '<div class="team-member"><span>'+ initial +'</span></div>';
			var userblock = '<div class="team-member-container" id="c_id">'+ thumbnail + '<h4>'+ current_user.name + '</h4></div>';
			$(".team.team-invite").prepend(userblock);

			window.location = "/experiment";
		},
		error: function(data){
			console.log("not adding to contributors")
		}
	})

}

function addUserToExperiment(data){

	var invited_user = data;
	console.log(data)

	var formdata = {
		"contributor[user_id]": data.id,
		"contributor[design_id]": design_edit_id,
		"contributor[is_owner]": 0
	}

	$.ajax({
		type: "POST",	
		headers: {"Access-Control-Allow-Origin": "*"},
		url: "http://zaquantum-backend.herokuapp.com/api/v1/contributors",
		dataType: "json",
		data: formdata,
		success: function(data){
			console.log(data.contributor_id)

			// Show user in modal
			var initial = invited_user.name.charAt(0);
			var closebtn = '<a class="modal-button-confirmremove close"><i class="fa fa-times"></i></a>';
			var thumbnail = '<div class="team-member">'+ closebtn + '<span>'+ initial +'</span></div>';
			var userblock = '<div class="team-member-container" id="c_id">'+ thumbnail + '<h4>'+ invited_user.name + '</h4></div>';
			$(".team.team-invite").prepend(userblock);
		},
		error: function(data){
			console.log("failed to add collaborator")
		}
	})

}

function initRemoveModal(){
	// Confirm remove user modal
	$(".modal-button-confirmremove").on('click', function(){
		$("#modal-confirmremoveuser").addClass("is-active");
		$("body").addClass("no-scroll");

		// get contributor id
		var c_id = $(this).attr('id');

		// show contributor

		// remove contributor on confirm
	});

	$("#modal-confirmremoveuser > .modal-background, #modal-confirmremoveuser .modal-close, #modal-confirmremoveuser .modal-buttons > a").click(function(){
		$("#modal-confirmremoveuser").removeClass("is-active");
		$("body").removeClass("no-scroll");
	});
}

function loadContributors(){

	$.ajax({
		type: "GET",	
		headers: {"Access-Control-Allow-Origin": "*"},
		url: "http://zaquantum-backend.herokuapp.com/api/v1/contributors?design_id=" + current_experiment.id,
		dataType: "json",
		success: function(data){
			console.log(data);

			var contributors = data.contributors;

			for(var i=0; i<contributors.length; i++){
				getUserAndDisplayData(contributors[i]);
			}

		},
		error: function(data){
			
		}
	})

}

function loadContributorsWithId(id){
	design_edit_id = id;

	// remove current blocks
	$(".team.team-invite .team-member-user").remove();

	$.ajax({
		type: "GET",	
		headers: {"Access-Control-Allow-Origin": "*"},
		url: "http://zaquantum-backend.herokuapp.com/api/v1/contributors?design_id=" + design_edit_id,
		dataType: "json",
		success: function(data){
			// console.log(data);

			var contributors = data.contributors;

			for(var i=0; i<contributors.length; i++){
				getUserAndDisplayData(contributors[i]);
			}
		},
		error: function(data){
			
		}
	})
}

function getUserAndDisplayData(contributor){

	var user = contributor;

	// get user name
	$.ajax({
		type: "GET",	
		headers: {"Access-Control-Allow-Origin": "*"},
		url: "http://zaquantum-backend.herokuapp.com/api/v1/users/" + user.user_id,
		dataType: "json",
		success: function(data){

			// display user in invite block
			var initial = data.name.charAt(0);
			var thumbnail = '<div class="team-member"><span>'+ initial +'</span></div>';
			var userblock = '<div class="team-member-container team-member-user" id="c_id">'+ thumbnail + '<h4>'+ data.name + '</h4></div>';
			$(".team.team-invite").prepend(userblock);
		},
		error: function(data){
			
		}
	})
}











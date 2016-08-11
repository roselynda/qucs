

function initShepherd(){
	var tour;

	tour = new Shepherd.Tour({
		defaults: {
			classes: 'shepherd-theme-arrows',
			scrollTo: true
		}
	});

	tour.addStep('step-01-drag', {
		title: 'Components',
		text: 'Here are the components available to build a circuit.<br/> To start, drag a component to the editor canvas.',
		attachTo: '.components-container right',
		classes: 'shepherd-theme-arrows',
		buttons: [{
			text: 'Next',
			action: tour.next
		}]
	});

	tour.addStep('step-02-editor', {
		title: 'Editor',
		text: 'Clicking on a component in the editor will show<br> a blue indicator which will allow you to draw a connector.',
		attachTo: '',
		classes: 'shepherd-theme-arrows',
		buttons: [
			{	
				text: 'Back',
				action: tour.back,
				classes: 'shepherd-button-secondary'
			},
			{
				text: 'Next',
				action: tour.next
			}
		]
	});

	tour.addStep('step-03-properties', {
		title: 'Properties',
		text: 'The properties panel will show all properties of a component.<br> You can edit the properties, and save it.',
		attachTo: '.properties-container left',
		classes: 'shepherd-theme-arrows',
		buttons: [
			{	
				text: 'Back',
				action: tour.back,
				classes: 'shepherd-button-secondary'
			},
			{
				text: 'Next',
				action: tour.next
			}
		]
	});

	tour.addStep('step-04-run', {
		title: 'Run the Experiment',
		text: 'Once you\'ve build your circuit, run the experiment<br> to check if the circuit is working.',
		attachTo: '.editor-run left',
		classes: 'shepherd-theme-arrows',
		buttons: [
			{	
				text: 'Back',
				action: tour.back,
				classes: 'shepherd-button-secondary'
			},
			{
				text: 'Done',
				action: tour.complete
			}
		]
	});

	if(window.location.pathname === "/experiment"){
		var editoronboard;

		// check if it's the first time using the editor
		if(localStorage.getItem('editoronboarding') == null){
			editoronboard = true;
		}
		else {
			editoronboard = localStorage.getItem('editoronboarding')
		}

		// open modal if first time
		if(editoronboard === true){
			tour.start();
			localStorage.setItem('editoronboarding', false);
		}
	}
		
	
}

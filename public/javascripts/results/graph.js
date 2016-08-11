
function initGraph(){

	var resultsdata = JSON.parse(localStorage.getItem('current_results'));
	console.log(resultsdata);

	// bar chart
	/*var trace1 = {
		x: ["Energy", "Frequency", "Wavelength", "Momentum"],
		y: [resultsdata['Energy'], resultsdata['Frequency'], resultsdata['Wavelength'], resultsdata['Momentum']],
		type: 'bar',
		line: {
			color: 'rgb(53, 147, 207)'
		}
	};*/

// bar chart - Energy
	var trace1 = {
		x: ["Energy"],
		y: [resultsdata['Energy']],
		type: 'bar',
		line: {
			color: 'rgb(53, 147, 207)'
		}
	};

	var layout = {
		xaxis: {
			title: 'Type'
		},
		yaxis: {
			title: 'Value'
		},
		margin: {
			t: '50'
		},
		paper_bgcolor: '#F9FAFB',
	  	plot_bgcolor: '#F9FAFB',
	  	title: 'Results'
	};

	var data = [trace1];
	Plotly.newPlot('results-graph', data, layout);

/*
	#results-freq(style="width: 940px; height: 650px;")
				#results-momen(style="width: 940px; height: 650px;")
				#results-wave(style="width: 940px; height: 650px;")
*/

// bar chart - frequency
	var trace2 = {
		x: ["Frequency"],
		y: [resultsdata['Frequency']],
		type: 'bar',
		line: {
			color: 'rgb(53, 147, 207)'
		}
	};

	var layout = {
		xaxis: {
			title: 'Type'
		},
		yaxis: {
			title: 'Value'
		},
		margin: {
			t: '50'
		},
		paper_bgcolor: '#F9FAFB',
	  	plot_bgcolor: '#F9FAFB',
	  	title: 'Results'
	};

	var data = [trace2];
	Plotly.newPlot('results-freq', data, layout);

	// bar chart - momentum
	var trace3 = {
		x: ["Momentum"],
		y: [resultsdata['Momentum']],
		type: 'bar',
		line: {
			color: 'rgb(53, 147, 207)'
		}
	};

	var layout = {
		xaxis: {
			title: 'Type'
		},
		yaxis: {
			title: 'Value'
		},
		margin: {
			t: '50'
		},
		paper_bgcolor: '#F9FAFB',
	  	plot_bgcolor: '#F9FAFB',
	  	title: 'Results'
	};

	var data = [trace3];
	Plotly.newPlot('results-momen', data, layout);

	// bar chart - Wavelength
	var trace4 = {
		x: ["Wavelength"],
		y: [resultsdata['Wavelength']],
		type: 'bar',
		line: {
			color: 'rgb(53, 147, 207)'
		}
	};

	var layout = {
		xaxis: {
			title: 'Type'
		},
		yaxis: {
			title: 'Value'
		},
		margin: {
			t: '50'
		},
		paper_bgcolor: '#F9FAFB',
	  	plot_bgcolor: '#F9FAFB',
	  	title: 'Results'
	};

	var data = [trace4];
	Plotly.newPlot('results-wave', data, layout);


	// pie chart
	var colorArr = [];

	if(resultsdata['Polarization'] === 'H'){
		colorArr = ['rgb(53, 147, 207)', 'rgb(215, 215, 215)', 'rgb(215, 215, 215)', 'rgb(215, 215, 215)'];
	} else if (resultsdata['Polarization'] === 'V'){
		colorArr = ['rgb(215, 215, 215)', 'rgb(53, 147, 207)', 'rgb(215, 215, 215)', 'rgb(215, 215, 215)'];
	} else if (resultsdata['Polarization'] === 'LD'){
		colorArr = ['rgb(215, 215, 215)', 'rgb(215, 215, 215)', 'rgb(53, 147, 207)', 'rgb(215, 215, 215)'];
	} else if (resultsdata['Polarization'] === 'RD'){
		colorArr = ['rgb(215, 215, 215)', 'rgb(215, 215, 215)', 'rgb(215, 215, 215)', 'rgb(53, 147, 207)'];
	}

	var piedata = [{
		values: [25, 25, 25, 25],
		labels: ['H','V','LD','RD'],
		type: 'pie',
		marker: {
			colors: colorArr
		},
		textinfo: 'label'
	}];

	var pielayout = {
		height: 400,
		width: 900,
		showlegend: false,
		paper_bgcolor: '#F9FAFB',
	  	plot_bgcolor: '#F9FAFB',
	  	title: 'Polarization'
	};
	
	Plotly.newPlot('pie-chart', piedata, pielayout);

	// table data
	$("td#results-energy").text(resultsdata['Energy']);
	$("td#results-polorization").text(resultsdata['Polarization']);
	$("td#results-photon").text(resultsdata['']);
	$("td#results-frequency").text(resultsdata['Frequency']);
	$("td#results-wavelength").text(resultsdata['Wavelength']);
	$("td#results-momentum").text(resultsdata['Momentum']);

}


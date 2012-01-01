function initFileIO() {
	// Check for the various File API support.
	if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
	  alert('The File APIs are not fully supported in this browser.');
	  return -1;
	}
	if (DEBUG) {console.log('Initialize File IO complete.');}

	document.getElementById('fileInputs').addEventListener('change', handleFileSelect, false);
}
var JSONdata;
function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object

	// files is a FileList of File objects. List some properties.
	var output = [];
	for (var i = 0, f; f = files[i]; i++) {
		output.push('<li><strong>', f.name, '</strong> (', f.type || 'n/a', ') - ',
		f.size, ' bytes, last modified: ',
		f.lastModifiedDate.toLocaleDateString(), '</li>');

		var reader = new FileReader();

		reader.onload = function(e) {
			var text = e.target.result;
			try {
				jsData = parseInputText(text);
			}
			catch(e) {
				ERROR = e; // For console access
				alert('Couldn\'t Parse JSON from file : ',e.name,' : ',e.message);
				console.log('ERROR parsing: ',e.name,' : ',e.message);
				return -1;
			}
			
			loadSysFromJSON(jsData);
			if (DEBUG) {
				console.log("JSON FILE LOADED: ",jsData.name)
			}
		};
		reader.onerror = errorHandler;

		reader.readAsText(f);
		
	}
	document.getElementById('fileList').innerHTML = '<ul>' + output.join('') + '</ul>';
}

function errorHandler(evt) {
	switch(evt.target.error.code) {
		case evt.target.error.NOT_FOUND_ERR:
			alert('File Not Found!');
			break;
		case evt.target.error.NOT_READABLE_ERR:
			alert('File is not readable');
			break;
		case evt.target.error.ABORT_ERR:
			break; // noop
		case evt.target.error.SECURITY_ERR:
			alert('File Security Error, If running locally (ie. \'file://\' then need --allow-file-access-from-files for browser)');
			break;
		default:
			alert('An error occurred reading this file.');
	};
	if (DEBUG) {
		console.log("FILE LOADED UNSUCCESSFULLY: Error Code ",evt.target.error.code);
	}
}

function parseInputText(text) {
	lines = text.split('\n');
	for (i=0;i<lines.size;i++) {
		console.log(i,": ",lines[i]);
	}
	var jsObj = JSON.parse(text);
	return jsObj;
}

function loadSysFromJSON(jsonData) {
	// Constants
	MINMASS = typeof(jsData.Constants.MINMASS) != 'undefined' ? jsData.Constants.MINMASS : MINMASS;
	MAXMASS = typeof(jsData.Constants.MAXMASS) != 'undefined' ? jsData.Constants.MAXMASS : MAXMASS;
	G = typeof(jsData.Constants.G) != 'undefined' ? jsData.Constants.G : G;
	GFACTOR = typeof(jsData.Constants.GFACTOR) != 'undefined' ? jsData.Constants.GFACTOR : GFACTOR;
	ETA = typeof(jsData.Constants.ETA) != 'undefined' ? jsData.Constants.ETA : ETA;
	if (DEBUG) {
		console.log('MINMASS: ',MINMASS);
		console.log('MAXMASS: ',MAXMASS);
		console.log('G: ',G);
		console.log('GFACTOR: ',GFACTOR);
		console.log('ETA: ',ETA);
	}

	// Bodies
	for (i=0;i<jsData.Bodies.N;i++) {
		var b = jsData.Bodies.BodyData[i];
		//addBody(x,y,vx,vy,m) {
		addBody(b[1],b[2],b[3],b[4],b[0]);
	}
	refreshGraphics();
}
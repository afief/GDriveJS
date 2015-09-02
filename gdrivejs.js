var GDriveJS = function() {

	var that = this;
	var loaded = false;

	this.clientId = "";
	this.scopes = [];

	this.load = function(callback) {
		(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "https://apis.google.com/js/client.js?onload=GDriveCheckAuth";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'gapiclient'));

		window.addEventListener("gapiLoaded", onGapiLoaded);
		function onGapiLoaded() {
			loaded = true;
			if (callback)
				callback();
		}
	}

	this.checkAuth = function(callback) {
		if (!loaded) {
			callback(false);
			return;
		}

		gapi.auth.authorize(
		{
			'client_id': that.clientId,
			'scope': that.scopes,
			'immediate': true
		}, handleAuthResult);

		function handleAuthResult(authResult) {
			if (!authResult.error) {
				gapi.client.load('drive', 'v2', driveLoadResult);
			} else {
				callback(false);
			}
			function driveLoadResult() {
				callback(true);
			}
		}
	}
	this.searchFiles = function(name, callback) {
		var request = gapi.client.drive.files.list({
			'maxResults' : 10,
			'q': "mimeType != 'application/vnd.google-apps.folder' and title contains '" + name + "'"
		});
		request.execute(function(resp) {
			callback(resp.items);
		});
	}
	this.searchFolder = function(name, callback) {
		var request = gapi.client.drive.files.list({
			'maxResults' : 10,
			'q': "mimeType = 'application/vnd.google-apps.folder' and title contains '" + name + "'"
		});
		request.execute(function(resp) {
			callback(resp.items);
		});
	}
	this.getFiles = function(callback) {
		var request = gapi.client.drive.files.list({
			'maxResults' : 10
		});
		request.execute(function(resp) {
			callback(resp.items);
		});
	}
}

var GDriveCheckAuth = function() {
	window.dispatchEvent(new Event("gapiLoaded"))
}
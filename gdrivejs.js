var GDriveJS = function() {

	var that = this;
	var loaded = false;
	var isPickerLoaded = false;
	var oAuthToken = "";

	this.clientId = "";
	this.appId = "";
	this.scopes = [];

	function onPickerApiLoad() {
		console.info("picker api loaded");
		isPickerLoaded = true;
	}

	this.load = function() {
		var resPromise = function(resolve, reject) {
			(function(d, s, id){
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {return;}
				js = d.createElement(s); js.id = id;
				js.src = "https://apis.google.com/js/client.js?onload=GDriveCheckAuth";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'gapiclient'));

			window.addEventListener("gapiLoaded", onGapiLoaded);
			function onGapiLoaded() {
				console.info("gapi loaded");
				loaded = true;
				resolve();
				gapi.load('auth');
			}
		}
		return new Promise(resPromise);
	}

	this.checkAuth = function() {
		var resPromise = function(resolve, reject) {
			if (!loaded) {
				reject("not_loaded");
				return;
			}

			gapi.auth.authorize(
			{
				'client_id': that.clientId,
				'scope': that.scopes,
				'immediate': false
			}, handleAuthResult);

			function handleAuthResult(authResult) {
				if (!authResult.error) {
					oAuthToken = authResult.access_token;
					console.info("auth success ", oAuthToken);

					gapi.client.load('drive', 'v2', driveLoadResult);
					gapi.load('picker', {'callback': onPickerApiLoad});
				} else {
					reject("error");
				}
				function driveLoadResult() {
					console.info("drive api loaded");
					resolve(true);
				}
			}
		}
		return new Promise(resPromise);
	}
	this.searchFiles = function(name, maxResults, nextPageToken, isExact) {
		return new Promise(function(res, rej) {
			maxResults = maxResults || 10;

			if (!loaded) {
				reject("not_loaded");
				return;
			}

			var params = {
				maxResults : maxResults,
				q: "mimeType != 'application/vnd.google-apps.folder' and title contains '" + name + "'"
			}

			if (isExact)
				params.q = "mimeType != 'application/vnd.google-apps.folder' and title '" + name + "'";
			if (nextPageToken)
				params.pageToken = nextPageToken;

			var request = gapi.client.drive.files.list(params);
			request.execute(function(resp) {
				if (resp.items.length > 0)
					res(resp)
				else
					rej();
			});
		});

	}
	this.searchFolder = function(name, maxResults, nextPageToken, isExact) {
		return new Promise(function(res, rej) {
			maxResults = maxResults || 10;

			if (!loaded) {
				reject("not_loaded");
				return;
			}

			var params = {
				maxResults : maxResults,
				q: "mimeType = 'application/vnd.google-apps.folder' and title contains '" + name + "'"
			}

			if (isExact)
				params.q = "mimeType = 'application/vnd.google-apps.folder' and title '" + name + "'";
			if (nextPageToken)
				params.pageToken = nextPageToken;

			var request = gapi.client.drive.files.list(params);
			request.execute(function(resp) {
				if (resp.items.length > 0)
					res(resp)
				else
					rej();
			});
		});
	}
	this.getFiles = function() {
		return new Promise(function(res, rej) {

			if (!loaded) {
				reject("not_loaded");
				return;
			}

			var request = gapi.client.drive.files.list({
				'maxResults' : 10
			});
			request.execute(function(resp) {
				if (resp.items.length > 0)
					res(resp)
				else
					rej();
			});
		});
	}

	this.uploadFile = function(fileData, parentId) {

		var resPromise = function(resolve, reject) {

			if (!loaded) {
				reject("not_loaded");
				return;
			}

			var boundary = '-------314159265358979323846';
			var delimiter = "\r\n--" + boundary + "\r\n";
			var close_delim = "\r\n--" + boundary + "--";

			var reader = new FileReader();
			reader.readAsBinaryString(fileData);
			reader.onload = function(e) {

				var contentType = fileData.type || 'application/octet-stream';
				var metadata = {
					title: fileData.name,
					mimeType: contentType,
					description : "This file is created by Bunder"
				};
				if (parentId) {
					metadata.parents = [{id: parentId}];
					console.log("Insert Into Parent : ", metadata.parents);
				}

				var base64Data = btoa(reader.result);
				var multipartRequestBody = delimiter + 'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) +
				delimiter +
				'Content-Type: ' + contentType + '\r\n' +
				'Content-Transfer-Encoding: base64\r\n' +
				'\r\n' + base64Data + close_delim;

				var request = gapi.client.request({
					'path': '/upload/drive/v2/files',
					'method': 'POST',
					'params': {	uploadType: 'multipart'},
					'headers': {
						'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
					},
					'body': multipartRequestBody});

				callback = function(file) {
					if (file)
						resolve(file);
					else
						reject();
				};

				request.execute(callback);
			}
			reader.onerror = function() {
				reject("invalid_file");
			}

		}

		return new Promise(resPromise);
	}
	this.createFolder = function(folderName, parentId) {
		var resPromise = function(resolve, reject) {

			if (!loaded) {
				reject("not_loaded");
				return;
			}

			var boundary = '-------314159265358979323846';
			var delimiter = "\r\n--" + boundary + "\r\n";
			var close_delim = "\r\n--" + boundary + "--";
			var metadata = {
				title: folderName,
				mimeType: "application/vnd.google-apps.folder",
				description : "This file is created by Bunder"
			};
			if (parentId) {
				metadata.parents = [{id: parentId}];
				console.log("Insert Into Parent : ", metadata.parents);
			}

			var multipartRequestBody = delimiter + 'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) + close_delim;

			var request = gapi.client.request({
				'path': '/upload/drive/v2/files',
				'method': 'POST',
				'params': {	uploadType: 'multipart'},
				'headers': {
					'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
				},
				'body': multipartRequestBody});

			callback = function(folder) {
				if (folder)
					resolve(folder);
				else
					reject();
			};

			request.execute(callback);
		}
		return new Promise(resPromise);
	}

	this.openPicker = function() {
		var resPromise = function(resolve, reject) {
			if (isPickerLoaded && oAuthToken) {
				var view = new google.picker.View(google.picker.ViewId.DOCS);
				
				var picker = new google.picker.PickerBuilder()				
				.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
				.setAppId(that.appId)
				.setOAuthToken(oAuthToken)
				.addView(view)
				.addView(new google.picker.DocsUploadView())
				.setCallback(pickerCallback)
				.build();

				picker.setVisible(true);
			} else {
				reject("picker or oauth not loaded");
			}
			function pickerCallback(data) {
				console.info(data);
				if (data.action == "picked") {
					resolve(data);
				} else if ((data.action == "cancel") || (data.action == "error")) {
					reject(data);
				}
			}
		}
		return new Promise(resPromise);
	}
}

var GDriveCheckAuth = function() {
	window.dispatchEvent(new Event("gapiLoaded"))
}
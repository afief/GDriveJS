# GDriveJS
## Web Javascript Google Drive API Library

### LOAD SCRIPT

	<script src="gdrivejs.js" type="text/javascript" charset="utf-8"></script>

---

### GET AUTH CODE

1. Use [this wizard](https://console.developers.google.com/flows/enableapi?apiid=drive) to create or select a project in the Google Developers Console and automatically enable the API. Click the Go to credentials button to continue.
2. At the top of the page, select the OAuth consent screen tab. Select an Email address, enter a Product name if not already set, and click the Save button.
3. Back on the Credentials tab, click the Add credentials button and select OAuth 2.0 client ID.
4. Select the application type Web application.
5. In the Authorized JavaScript origins field, enter your base url of your project. You can leave the Authorized redirect URIs field blank.
6. Click the Create button.
7. Take note of the client ID and client secret in the resulting dialog. You will need these in a later step.

---

### SETUP

	var gdrive = new GDriveJS();

	gdrive.clientId = "[AUTH CODE]";
	gdrive.scopes.push("[SCOPE]");


---

### INIT

	gdrive.load().then(init);

	function init() {
		gdrive.checkAuth(function(res) {
			console.log(res, data)
		});
	}

---

### CHECK IF IT IS ALREADY AUTH OR NOT

	gdrive.checkAuth().then(function() {
		console.info("AUTH SUCCESS");
	}, function(err) {
		console.info("AUTH FAILED");
	});

---

### SEARCH FILE

	gdrive.searchFiles(filename, maxResults, nextPageToken, isExact).then(function(response) {
		//response
	});

more information about response object [https://developers.google.com/drive/v2/reference/files/list]

---

### SEARCH FOLDER

	gdrive.searchFiles(foldername, maxResults, nextPageToken, isExact).then(function(response) {
		//response
	});

---

#### UPLOAD FILE

	gdrive.uploadFile(fileObject, parentFolderId);

if parentFolderId not specified, file will be located at root

Response is Promise Object with Uploaded File Metadata

---

#### CREATE FOLDER

	gdrive.createFolder(folderName, parentFolderId);

if parentFolderId not specified, folder located at root

Response is Promise Object with Created Folder Metadata

---
# GDriveJS
## Web Javascript Google Drive API Library

### LOAD SCRIPT

	<script src="gdrivejs.js" type="text/javascript" charset="utf-8"></script>

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
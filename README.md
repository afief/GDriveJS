Web Javascript Google Drive Library

How To Use:

	<script src="gdrivejs.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript" charset="utf-8">
		
		var gdrive = new GDriveJS();

		gdrive.clientId = "[AUTH CODE]";
		gdrive.scopes.push("[SCOPE]");
		gdrive.scopes.push("[SCOPE]");

		gdrive.load(init);

		function init() {
			gdrive.checkAuth(function(res, data) {
				console.log(res, data)
			});
		}

	</script>

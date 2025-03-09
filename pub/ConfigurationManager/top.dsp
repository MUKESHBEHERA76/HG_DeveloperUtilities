<html>

<head>
	<title>webMethods Enterprise Web Services</title>
	<base target="main">
	<style>
		html,
		body {
			margin: 0 !important;
			padding: 0 !important;
			overflow: hidden;
		}

		.top-container {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 20px;
			background-color: #1e3c72;
			color: white;
		}

		.top-container img {
			height: 45px;
			width: 278px;
		}

		.top-right-menu {
			display: flex;
			gap: 10px;
		}

		.top-right-menu a {
			text-decoration: none;
			color: black;
			background-color: white;
			padding: 5px 10px;
			border-radius: 5px;
			font-weight: bold;
		}
	</style>
</head>

<body style="margin: 0 !important; padding: 0 !important; border: 0 !important; overflow: hidden;"></body>

<div class="top-container">
	<img src="images/logo.png" alt="Enterprise Web Services">
	<div class="top-right-menu">
		<a href="#" onclick="closeWindow(); return false;">Close Window</a>
		<a target="main" href="licence.html">Licence</a>
	</div>
</div>

</body>
<script>
    function closeWindow() {
        if (window.history.length > 1) {
            window.history.back(); // Go back if possible
        } else {
            window.close(); // Attempt to close the window
        }
    }
</script>
</html>
/**
 * @file header.js
 * @author Jakub Mikyšek (xmikys03)
 * @brief File for rendering header navigation for HTML files
 */

const header = document.getElementById('header');
header.innerHTML = `
	<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
	<a class="navbar-brand" href="#">IoT Management</a>
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
		aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	</button>
	<div class="collapse navbar-collapse" id="navbarCollapse">
		<ul class="navbar-nav mr-auto">
			<li class="nav-item active">
				<a class="nav-link" href="/">Home</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="users">Users</a>
			</li>
			<li class="nav-item">
            	<a class="nav-link" href="#">About</a>
          	</li>
		</ul>
		<button id="logoutButton" class="btn btn-outline-danger my-2 my-sm-0" type="button">Logout</button>
	</div>
	</nav>`

/**
 * @file header.js
 * @author Jakub Mikyšek (xmikys03), Gabriel Biel (xbielg00)
 * @brief File for rendering header navigation for HTML files
 */

// Profile
document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.getElementById('editUserButton');
    if (editButton) {
        editButton.addEventListener('click', async () => {
            window.location.href = '/users/edit';
        });
    }
});

// Logout
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/users/logout', {
                    method: 'POST',
                    credentials: 'include' // Include cookies with the request
                });
                if (response.ok) {
                    // Redirect to the login page after successful logout
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Logout failed:', error);
            }
        });
    }
});

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
		<button id="editUserButton" class="btn btn-outline-warning my-2 mr-2 my-sm-0" type="button">
			Profile <i class="fas fa-user"></i>
		</button>
		<button id="logoutButton" class="btn btn-outline-danger my-2 my-sm-0" type="button">Logout</button>
	</div>
	</nav>`

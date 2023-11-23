let systemId;

document.addEventListener('DOMContentLoaded', function () {
	loadSystemData();
});

async function loadSystemData() {
	try {
		const systemIdFromUrl = window.location.pathname.split('/').pop(); // Extract the system ID from the URL
		const response = await fetch(`/api/systems/${systemIdFromUrl}`);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const systemData = await response.json();

		systemId = systemData.id;
		document.getElementById('systemName').value = systemData.name;
		document.getElementById('systemDescription').value = systemData.description;
		document.getElementById('systemOwner').value = systemData.owner_id;

		const createdDate = new Date(systemData.created);
		const formattedDate = createdDate.toLocaleDateString();
		document.getElementById('systemCreated').value = formattedDate;
		
		document.getElementById('systemId').value = systemData.id;

		// wait for systemId to be set
		loadSystemUsers();
		loadNotSystemUsers();
	} catch (error) {
		console.error('Failed to load system data:', error);
	}
}

function loadSystemUsers() {
	// Fetch data from the server and print users in system
	fetch(`/api/user/system/${systemId}/users`)
		.then(response => response.json())
		.then(data => {
			const userSystemTableBody = document.getElementById('userSystemTableBody');

			data.forEach(user => {
				const row = document.createElement('tr');
				row.innerHTML = `
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.bio}</td>
                        <td>${new Date(user.created).toLocaleDateString()}</td>
						<td>
							<button class="btn btn-danger btn-sm" onclick="removeUser(${user.id})">
								<i class="fas fa-user-slash"></i>
							</button>
						</td>    
                    `;
				row.id = `userRow_${user.id}`;
				userSystemTableBody.appendChild(row);
			});
		})
		.catch(error => console.error('Error fetching data:', error));
}

function loadNotSystemUsers() {
	// Fetch data from the server and print users NOT in system
	fetch(`/api/user/system/${systemId}/users/not`)
		.then(response => response.json())
		.then(data => {
			const userNotSystemTableBody = document.getElementById('userNotSystemTableBody');


			data.forEach(user => {
				const row = document.createElement('tr');
				row.innerHTML = `
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.bio}</td>
						<td>
							<button class="btn btn-success btn-sm" onclick="addUser(${user.id})">
								<i class="fas fa-plus"></i>
							</button>
						</td>    
                    `;
				row.id = `userRow_${user.id}`;
				userNotSystemTableBody.appendChild(row);
			});
		})
		.catch(error => console.error('Error fetching data:', error));
}

function addUser(userId) {
	// Make a POST request to add User to System
	fetch(`/api/user/system/${systemId}/add-user`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ user_id: userId }),
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const deletedRow = document.getElementById(`userRow_${userId}`);
			if (deletedRow) {
				deletedRow.remove();
			}
		})
		.catch(error => console.error('Error adding user:', error));
}

function leaveSystem() {
	// Make a DELETE request to remove logged user from the system with the specified systemId
	// if the user is an owner of System -> DELETE System
	fetch(`/api/user/system/${systemId}/leave`, {
		method: 'DELETE',
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
		})
		.catch(error => console.error('Error leaving system:', error));
}

function removeUser(userId) {
	// Make a DELETE request to remove user from the system with the specified systemId
	fetch(`/api/user/system/${systemId}/remove-user`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ user_id: userId }),
	})
		.then(response => {
			if (!response.ok) {
				return response.json().then(data => {
					if (data.showPopup) {
						// Display a popup to the user
						alert('Cannot delete the owner!');
					} else {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
				});
			}

			const deletedRow = document.getElementById(`userRow_${userId}`);
			if (deletedRow) {
				deletedRow.remove();
			}
		})
		.catch(error => console.error('Error removing user:', error));
}

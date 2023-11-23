let systemId;
let ownerId;

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
		ownerId = systemData.owner_id;
		document.getElementById('systemOwner').value = systemData.owner_id;

		const createdDate = new Date(systemData.created);
		const formattedDate = createdDate.toLocaleDateString();
		document.getElementById('systemCreated').value = formattedDate;

		document.getElementById('systemId').value = systemData.id;

		// wait for systemId to be set
		loadSystemUsers();
		loadNotSystemUsers();
		loadSystemRequests()
	} catch (error) {
		console.error('Failed to load system data:', error);
	}
}

async function loadSystemUsers() {
    try {
		const userSystemList = document.getElementById('systemUsersList');
        const response = await fetch(`/api/user/system/${systemId}/users`);
        if (!response.ok) {
            console.error('Error fetching data:', response.statusText);
            return;
        }

        const data = await response.json();

		const user = await fetch(`/api/users/me`);
		const userResponse = await user.json();
		console.log("User:", userResponse);

		if (userResponse.id !== ownerId) {
			// show the request list only for owner or admin
			userSystemList.classList.add('d-none');
			return;
		}
		else {
			userSystemList.classList.add('mt-4', 'container');
		}

        // Create the table structure
		const heading = document.createElement('h2');
		heading.textContent = 'System Users List';

        const table = document.createElement('table');
        table.classList.add('table');
        const thead = document.createElement('thead');
        thead.classList.add('thead-light');
        thead.innerHTML = `
            <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Bio</th>
                <th>Created</th>
                <th></th>
            </tr>
        `;

        const tbody = document.createElement('tbody');

        // Fill the table with user data
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
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        // Clear existing content in userSystemTableBody and append the table
        userSystemList.innerHTML = '';
		userSystemList.appendChild(heading);
        userSystemList.appendChild(table);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function loadNotSystemUsers() {
    try {
		const userNotSystemList = document.getElementById('userNotSystemList');
        const response = await fetch(`/api/user/system/${systemId}/users/not`);
        if (!response.ok) {
            console.error('Error fetching data:', response.statusText);
            return;
        }

        const data = await response.json();

		const user = await fetch(`/api/users/me`);
		const userResponse = await user.json();
		console.log("User:", userResponse);

		if (userResponse.id !== ownerId) {
			// show the request list only for owner or admin
			userNotSystemList.classList.add('d-none');
			return;
		}
		else {
			userNotSystemList.classList.add('mt-4', 'container', );
		}

        // Create the table structure
		const heading = document.createElement('h2');
		heading.textContent = 'Users NOT in System List';
		const box = document.createElement('div');
		box.classList.add('table-wrapper-scroll-y', 'my-custom-scrollbar', 'table-fix-head');

        const table = document.createElement('table');
        table.classList.add('table');
        const thead = document.createElement('thead');
        thead.classList.add('thead-light');
        thead.innerHTML = `
            <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Bio</th>
                <th></th>
            </tr>
        `;

        const tbody = document.createElement('tbody');

        // Fill the table with user data
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
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
		box.appendChild(table);

        // Clear existing content in userNotSystemTableBody and append the table
        userNotSystemList.innerHTML = '';
        userNotSystemList.appendChild(heading);
        userNotSystemList.appendChild(box);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
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


// REQUESTS HANDLE
async function loadSystemRequests() {
	try {
		const requestList = document.getElementById('requestList'); // Get the requestList element
		const response = await fetch(`/api/user/system/${systemId}/requests`);

		if (!response.ok) {
			//hide the request list element
			requestList.classList.add('d-none');
			return;
		}

		const requests = await response.json();

		const user = await fetch(`/api/users/me`);
		const userResponse = await user.json();
		console.log("User:", userResponse);

		if (userResponse.id !== ownerId) {
			// show the request list only for owner or admin
			requestList.classList.add('d-none');
			return;
		}
		else {
			requestList.classList.add('mt-4', 'container');
		}

		// Create the table structure
		const heading = document.createElement('h2');
		heading.textContent = 'Request List';

		const table = document.createElement('table');
		table.classList.add('table', 'table-striped');
		const thead = document.createElement('thead');
		thead.classList.add('thead-light');
		thead.innerHTML = `
		<tr>
			<th>Created</th>
			<th>Message</th>
			<th>Username</th>
			<th>Email</th>
			<th>Status</th>
			<th></th>
			<th></th>
		</tr>
	  `;

		const tbody = document.createElement('tbody');
		tbody.id = 'systemRequestsList';

		// Fill the table with requests
		requests.forEach(request => {
			const row = document.createElement('tr');
			row.innerHTML += `
					<td>${new Date(request.created).toLocaleString()}</td>
					<td>${request.message}</td>
					<td>${request.username}</td>
					<td>${request.email}</td>
					<td>${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</td>
					<td>
						<button class="btn btn-success btn-sm" onclick="acceptRequest(${request.id})">
							<i class="fas fa-check"></i>
						</button>
					</td>                        
					<td>
						<button class="btn btn-danger btn-sm" onclick="rejectRequest(${request.id})">
							<i class="fas fa-trash"></i>
						</button>
					</td>
		`;

			row.id = `requestRow_${request.id}`;
			tbody.appendChild(row);
		});

		table.appendChild(thead);
		table.appendChild(tbody);

		// Clear existing content in requestList and append the table
		requestList.innerHTML = '';
		requestList.appendChild(heading);
		requestList.appendChild(table);
	} catch (error) {
		console.error('Failed to load requests:', error);
	}
}

function acceptRequest(requestId) {
	// Make a PUT request to accept user request to join System
	fetch(`/api/user/system/join-request/${requestId}`, {
		method: 'PUT',
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const deletedRow = document.getElementById(`userRow_${requestId}`);
			if (deletedRow) {
				deletedRow.remove();
			}
		})
		.catch(error => console.error('Error accepting request:', error));
}

function rejectRequest(requestId) {
	// Make a DELETE request to reject user request to join System
	fetch(`/api/user/system/join-request/${requestId}`, {
		method: 'DELETE',
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const deletedRow = document.getElementById(`userRow_${requestId}`);
			if (deletedRow) {
				deletedRow.remove();
			}
		})
		.catch(error => console.error('Error rejecting request:', error));
}

let systemId;
let ownerId;
let userId;
let isAdmin;

document.addEventListener('DOMContentLoaded', function () {
	systemId = window.location.pathname.split('/').pop();
	loadSystemData();
});

async function loadSystemData() {
	try {
		const response = await fetch(`/api/systems/${systemId}`);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const systemData = await response.json();

		systemId = systemData.id;
		document.getElementById('systemName').value = systemData.name;
		document.getElementById('systemDescription').value = systemData.description;
		ownerId = systemData.owner_id;
		document.getElementById('systemOwner').value = systemData.owner_name;

		const createdDate = new Date(systemData.created);
		const formattedDate = createdDate.toLocaleDateString();
		document.getElementById('systemCreated').value = formattedDate;

		// Get logged User
		const user = await fetch(`/api/users/me`);
		const userResponse = await user.json();
		userId = userResponse.id;
		isAdmin = userResponse.is_admin;

		// wait for systemId to be set
		loadSystemAddDeviceButton();
		loadSystemEditButton()
		loadSystemUsers();
		loadNotSystemUsers();
		loadSystemRequests();
		loadDevices();
	} catch (error) {
		console.error('Failed to load system data:', error);
	}
}

async function loadSystemEditButton() {
	try {
		const editSystemButton = document.getElementById('editSystem');

		if (userId !== ownerId && !isAdmin) {
			// show the edit button only for owner or admin
			editSystemButton.classList.add('d-none');
			return;
		}
		else {
			editSystemButton.classList.add('d-inline-block');
		}

		// Create button
		const button = document.createElement('button');
		button.textContent = 'Edit System';
		button.classList.add('btn', 'btn-warning');
		button.id = 'editSystemButton';

		editSystemButton.innerHTML = '';
		editSystemButton.appendChild(button);

		button.addEventListener('click', function () {
			// go to the edit system page
			window.location.href = `/systems/edit/${systemId}`;
		});
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

async function loadSystemAddDeviceButton() {
	try {
		const addDeviceButton = document.getElementById('addDevice');

		if (userId !== ownerId && !isAdmin) {
			// show the edit button only for owner or admin
			addDeviceButton.classList.add('d-none');
			return;
		}
		else {
			addDeviceButton.classList.add('d-inline-block');
		}

		// Create button
		const button = document.createElement('button');
		button.textContent = 'Add Device';
		button.classList.add('btn', 'btn-primary');
		button.id = 'addDeviceButton';

		addDeviceButton.innerHTML = '';
		addDeviceButton.appendChild(button);

		button.addEventListener('click', function () {
			// go to the add device page for this system
			window.location.href = `/device/create/${systemId}`;
		});
	} catch (error) {
		console.error('Error fetching data:', error);
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

		if (userId !== ownerId && !isAdmin) {
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
                <th>Added</th>
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

		if (userId !== ownerId && !isAdmin) {
			// show the add user input search only for owner or admin
			userNotSystemList.classList.add('d-none');
			return;
		}
		
		const searchResultsContainer = document.createElement('div');
		searchResultsContainer.classList.add('list-group', 'mt-2');

		// Add a search input field
		const heading = document.createElement('h2');
		heading.textContent = 'Add User';
		const searchInput = document.createElement('input');
		searchInput.setAttribute('type', 'text');
		searchInput.setAttribute('class', 'form-control mb-2');
		searchInput.setAttribute('placeholder', 'Search by username');
		searchInput.addEventListener('input', handleSearch);

		// Append the search input to userNotSystemList
		userNotSystemList.innerHTML = ''; // Clear existing content
		userNotSystemList.appendChild(heading);
		userNotSystemList.appendChild(searchInput);

		// Append the search results container to userNotSystemList
		userNotSystemList.appendChild(searchResultsContainer);

		// Fetch all users not in the system
		const response = await fetch(`/api/user/system/${systemId}/users/not`);

		if (!response.ok) {
			console.error('Error fetching data:', response.statusText);
			return;
		}

		const data = await response.json();

		// Function to handle search and suggestions
		function handleSearch() {
			const searchTerm = searchInput.value.toLowerCase();

			// Filter data based on the search term
			const filteredData = data.filter(user => user.username.toLowerCase().includes(searchTerm));

			// Display search results
			displayResults(filteredData);
		}

		// Function to display search results
		function displayResults(results) {
			searchResultsContainer.innerHTML = '';

			if (results.length === 0) {
				const noResultsMessage = document.createElement('div');
				noResultsMessage.classList.add('alert', 'alert-info', 'mb-0');
				noResultsMessage.textContent = 'Oops! No matching users found. Try a different search!';
				searchResultsContainer.appendChild(noResultsMessage);
			} else {
				results.forEach(user => {
					const resultItem = document.createElement('div');
					resultItem.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'justify-content-between', 'align-items-center', 'border', 'p-2');
					resultItem.innerHTML = `
                    <p class="mb-0">${user.username}</p>
                    <button class="btn btn-success btn-sm" onclick="addUser(${user.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                `;

					searchResultsContainer.appendChild(resultItem);
				});
			}
		}

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
			window.location.reload();
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
			window.location.href = '/systems';
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
			window.location.reload();
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

		if (userId !== ownerId && !isAdmin) {
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

		if (requests.length === 0) {
			const noRequestsRow = document.createElement('tr');
			const noRequestsCell = document.createElement('td');
			noRequestsCell.colSpan = "7"; // Set the colspan to span across all columns
			const noRequestsMessage = document.createElement('div');
			noRequestsMessage.classList.add('alert', 'alert-info', 'mb-0'); // Adjusted classes here
			noRequestsMessage.textContent = 'No pending requests at this time.';
			noRequestsCell.appendChild(noRequestsMessage);
			noRequestsRow.appendChild(noRequestsCell);
			tbody.appendChild(noRequestsRow);
		} else {
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
		}

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
			window.location.reload();
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

async function loadDevices() {
	try {
		const deviceList = document.getElementById('deviceList'); // Get the deviceList element
		const response = await fetch(`/api/systems/${systemId}/devices`);

		if (!response.ok) {
			//hide the device list element
			deviceList.classList.add('d-none');
			return;
		}

		const devices = await response.json();

		deviceList.classList.add('mt-4', 'container');

		const heading = document.createElement('h2');
		heading.textContent = 'System Device List';

		// Create the table structure
		const table = document.createElement('table');
		table.classList.add('table', 'table-bordered', 'p-3', 'mt-3');
		const thead = document.createElement('thead');
		thead.classList.add('thead-light');
		thead.innerHTML = `
		<tr>
		  <th scope="col">Alias</th>
		  <th scope="col">Type</th>
		  <th scope="col">Description</th>
		  ${(userId !== ownerId && !isAdmin) ? '' : '<th scope="col">Action</th>'}
		</tr>
	  `;

		const tbody = document.createElement('tbody');
		tbody.id = 'systemDevicesList';

		// Fill the table with devices
		devices.forEach(device => {
			const row = document.createElement('tr');
			const userAliasCell = document.createElement('td');
			const anchor = document.createElement('a');

			anchor.href = `/device/detail/${device.id}`; // Set the href attribute to '#' for now
			anchor.textContent = device.user_alias;
			anchor.setAttribute('data-device-id', device.id);

			userAliasCell.appendChild(anchor);

			row.appendChild(userAliasCell);
			row.innerHTML += `
			<td>${device.type_name}</td> <!-- Change this line -->
			<td>${device.description}</td>
			${(userId !== ownerId && !isAdmin) ? '' : `
				<td>
					<button class="btn btn-danger btn-sm" onclick="removeDevice(${device.id})">
						<i class="fas fa-trash"></i>
					</button>
				</td>`}
			`;

			row.id = `deviceRow_${device.id}`;
			tbody.appendChild(row);
		});

		table.appendChild(thead);
		table.appendChild(tbody);

		// Clear existing content in deviceList and append the table
		deviceList.innerHTML = '';
		deviceList.appendChild(heading);
		deviceList.appendChild(table);
	} catch (error) {
		console.error('Failed to load devices:', error);
	}
}

function removeDevice(deviceId) {
	// Make a DELETE request to remove device from System
	fetch(`/api/devices/${deviceId}/remove/${systemId}`, {
		method: 'DELETE',
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const deletedRow = document.getElementById(`deviceRow_${deviceId}`);
			if (deletedRow) {
				deletedRow.remove();
			}
		})
		.catch(error => console.error('Error rejecting request:', error));
}

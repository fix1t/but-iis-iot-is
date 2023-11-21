document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('createRequestForm').addEventListener('submit', handleSubmit);
});

const handleSubmit = async (event) => {
	event.preventDefault();
	const systemId = 5; // TO-DO GENERATED BY /api/systems/get
	const message = document.getElementById('userMessage').value;

	try {
		const response = await fetch(`/api/systems/${systemId}/join-request`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include', // To ensure cookies are included with the request
			body: JSON.stringify({ message })
		});

		if (!response.ok) {
			const errorText = await response.json();
			alert(errorText.error);
		} else {
			const responseBody = await response.json();
			console.log(responseBody.message);
			window.location.href = '/systems';
		}
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error);
	}
};

// Fetch data from the server and print users in system
fetch('/api/systems/5/users')
	.then(response => response.json())
	.then(data => {
		const userSystemTableBody = document.getElementById('userSystemTableBody');
		data.forEach(user => {
			const row = document.createElement('tr');
			row.innerHTML = `
                        <td>${user.username}</td>
                        <td>${user.email}</td>
						<td>${new Date(user.birth).toLocaleDateString()}</td>
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

// Fetch data from the server and print users NOT in system
fetch('/api/systems/5/users/not')
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

// Fetch data from the server and print all system requests
fetch('/api/systems/5/requests')
	.then(response => response.json())
	.then(data => {
		const requestTableBody = document.getElementById('requestTableBody');
		data.forEach(request => {
			const row = document.createElement('tr');
			row.innerHTML = `
						<td>${new Date(request.created).toLocaleString()}</td>
						<td>${request.message}</td>
                        <td>${request.username}</td>
                        <td>${request.email}</td>
						<td>${new Date(request.birth).toLocaleDateString()}</td>
                        <td>${request.bio}</td>
                        <td>${request.system_name}</td>
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
			row.id = `userRow_${request.id}`;
			requestTableBody.appendChild(row);
		});
	})
	.catch(error => console.error('Error fetching data:', error));

function addUser(userId) {
	let systemId = 5;
	// Make a POST request to add User to System
	fetch(`/api/systems/${systemId}/add-user`, {
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

function acceptRequest(requestId) {
	// Make a PUT request to accept user request to join System
	fetch(`/api/systems/join-request/${requestId}`, {
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
	fetch(`/api/systems/join-request/${requestId}`, {
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

function leaveSystem(systemId) {
	// Make a DELETE request to remove logged user from the system with the specified systemId
	fetch(`/api/systems/${systemId}/leave`, {
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
	let systemId = 5;
	fetch(`/api/systems/${systemId}/remove-user`, {
		method: 'DELETE',
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
		.catch(error => console.error('Error removing user:', error));
}

// Fetch data from the server and print user table
fetch('/api/users/getAll')
	.then(response => response.json())
	.then(data => {
		const usersTableBody = document.getElementById('usersTableBody');
		data.forEach(user => {
			const row = document.createElement('tr');
			row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.gender}</td>
                        <td>${user.bio}</td>
                        <td>${new Date(user.created).toLocaleString()}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
			row.id = `userRow_${user.id}`;
			usersTableBody.appendChild(row);
		});
	})
	.catch(error => console.error('Error fetching data:', error));

fetch('/api/systems/get')
	.then(response => response.json())
	.then(data => {
		const systemsTableBody = document.getElementById('systemsTableBody');
		data.forEach(system => {
			const row = document.createElement('tr');
			row.innerHTML = `
                        <td>${system.id}</td>
                        <td>${system.owner_name}</td>
                        <td>${system.name}</td>
                        <td>${system.description}</td>
                        <td>${new Date(system.created).toLocaleString()}</td>
						<td>
							<button class="btn btn-primary btn-sm" onclick="showSystemDetail(${system.id})">
								<i class="fas fa-info" style="padding: 0.25rem;"></i>
							</button>
						</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="deleteSystem(${system.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
			row.id = `userRow_${system.id}`;
			systemsTableBody.appendChild(row);
		});
	})
	.catch(error => console.error('Error fetching data:', error));

function deleteUser(userId) {
	// Make a DELETE request to delete the user with the specified userId
	fetch(`/api/users/${userId}`, {
		method: 'DELETE',
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
		.catch(error => console.error('Error deleting user:', error));
}

function deleteSystem(systemId) {
	// Make a DELETE request to delete the user with the specified userId
	fetch(`/api/systems/${systemId}`, {
		method: 'DELETE',
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const deletedRow = document.getElementById(`userRow_${systemId}`);
			if (deletedRow) {
				deletedRow.remove();
			}
		})
		.catch(error => console.error('Error deleting user:', error));
}

// Function to show system detail and redirect to another view
function showSystemDetail(systemId) {
    // Redirect to the system detail view with the specified systemId
    window.location.href = `/systems/detail/${systemId}`;
}

// Fetch data from the server and print user system table
fetch('/api/systems/in')
.then(response => response.json())
.then(userSystems => {
	const userSystemsTableBody = document.getElementById('userSystemsTableBody');
	userSystems.forEach(system => {
		const row = document.createElement('tr');
		row.innerHTML = `
			<td>${system.id}</td>
			<td>${system.name}</td>
			<td>${system.owner_name}</td>
			<td>${system.description}</td>
			<td>
				<button class="btn btn-primary btn-sm" onclick="showSystemDetail(${system.id})">
					<i class="fas fa-info" style="padding: 0.25rem;"></i>
				</button>
			</td>
		`;
		row.id = `userSystemRow_${system.id}`;
		userSystemsTableBody.appendChild(row);
	});

// Fetch data from the server and print system table
fetch('/api/systems/get')
	.then(response => response.json())
	.then(allSystems => {
		const systemsTableBody = document.getElementById('systemsTableBody');
		allSystems.forEach(system => {
			// Check if the system is not in userSystems
			if (!userSystems.find(userSystem => userSystem.id === system.id)) {
				const row = document.createElement('tr');
				let buttonHTML = '';
				if (window.location.pathname !== '/login') {
					buttonHTML = `
						<button class="btn btn-primary btn-sm" onclick="showSystemDetail(${system.id})">
							<i class="fas fa-info" style="padding: 0.25rem;"></i>
						</button>
					`;
				}
				row.innerHTML = `
					<td>${system.id}</td>
					<td>${system.name}</td>
					<td>${system.owner_name}</td>
					<td>${system.description}</td>
					<td>${buttonHTML}</td>
				`;
				row.id = `systemRow_${system.id}`;
				systemsTableBody.appendChild(row);
			}
		});
	})
	.catch(error => console.error('Error fetching data:', error));
})
.catch(error => console.error('Error fetching data:', error));

function deleteSystem(systemId) {
    // Make a DELETE request to delete the system with the specified systemId
    fetch(`/api/systems/${systemId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => Promise.reject(error));
            }
            return response.json();
        })
        .then(data => {
            // System deleted successfully, you can display a success message or perform other actions
            console.log(data.message);

            // Remove the row from the table
            const deletedRow = document.getElementById(`systemRow_${systemId}`);
            if (deletedRow) {
                deletedRow.remove();
            }
        })
        .catch(error => {
            // Display the error message on the page
            console.error('Error deleting system:', error);
            if (error && error.error) {
                alert(error.error);
            } else {
                alert('An error occurred while deleting the system.');
            }
        });
}

// Function to show system detail and redirect to another view
function showSystemDetail(systemId) {
    // Redirect to the system detail view with the specified systemId
    window.location.href = `/systems/detail/${systemId}`;
}
    
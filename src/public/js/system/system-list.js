// Fetch data from the server and print system table
fetch('/api/systems/get')
    .then(response => response.json())
    .then(data => {
        const systemsTableBody = document.getElementById('systemsTableBody');
        data.forEach(system => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${system.id}</td>
                        <td>${system.name}</td>
                        <td>${system.owner_id}</td>
                        <td>${system.owner_name}</td>
                        <td>${new Date(system.created).toLocaleString()}</td>
                        <td>${system.description}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="deleteSystem(${system.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
            row.id = `systemRow_${system.id}`;
            systemsTableBody.appendChild(row);
        });
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
    
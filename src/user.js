// Fetch data from the server and print user table
fetch('/getusers')
    .then(response => response.json())
    .then(data => {
        const usersTableBody = document.getElementById('usersTableBody');
        data.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.mail}</td>
                        <td>${user.role}</td>
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

function deleteUser(userId) {
    // Make a DELETE request to delete the user with the specified userId
    fetch(`/users/${userId}`, {
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
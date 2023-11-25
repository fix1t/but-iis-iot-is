let userId;
let isAdmin;


fetch('/api/types/get')
    .then(response => response.json())
    .then(types => {
        const tableBody = document.getElementById('typesTableBody');
        types.forEach(type => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${type.id}</td>
                <td>${type.name}</td>
                <td>${type.parameters.join(', ')}</td>
                <td></td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));

async function checkUserAdminStatus() {
	// Get logged User
	const user = await fetch(`/api/users/me`);
	const userResponse = await user.json();
	const userId = userResponse.id;
	const isAdmin = userResponse.is_admin;

	const createTypeButton = document.getElementById('createTypeButton');
	if (isAdmin) {
		// hide the create type button for non-admin users
		createTypeButton.classList.remove('d-none');
	}
}

// Call the function when the page loads
window.onload = checkUserAdminStatus;

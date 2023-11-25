let systemId;
let ownerId;
let userId;
let isAdmin;

// Get logged User
fetch(`/api/users/me`)
    .then(response => response.json())
    .then(userResponse => {
        userId = userResponse.id;
        isAdmin = userResponse.is_admin;
        const createTypeButton = document.getElementById('createTypeButton');
        if (isAdmin) {
			// show the create type button for admin users
			createTypeButton.classList.remove('d-none');
		} else {
			// hide the create type button for non-admin users
			createTypeButton.classList.add('d-none');
		}
    })
    .catch(error => console.error('Error:', error));

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('/api/types/get');
        const types = await response.json();
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

    } catch (error) {
        console.error('Error:', error);
    }
});

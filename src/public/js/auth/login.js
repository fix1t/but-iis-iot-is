document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', handleSubmit);
});

const handleSubmit = async (event) => {
    event.preventDefault();
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    const data = { email, password };

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // To ensure cookies are included with the request
            body: JSON.stringify(data)
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

fetch('/api/systems/get')
	.then(response => response.json())
	.then(userSystems => {
		const userSystemsTableBody = document.getElementById('systemsTableBody');
		userSystems.forEach(system => {
			const row = document.createElement('tr');
			row.innerHTML = `
				<td>${system.name}</td>
				<td>${system.owner_name}</td>
				<td>${system.description}</td>
			`;
			row.id = `userSystemRow_${system.id}`;
			userSystemsTableBody.appendChild(row);
		});
	})
	.catch(error => console.error('Error fetching data:', error));

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('systemCreateForm').addEventListener('submit', handleSubmit);
});

const handleSubmit = async (event) => {
	event.preventDefault();
	console.log('Form submitted!');
	const name = document.getElementById('systemName').value;
	const description = document.getElementById('systemDescription').value;

	const data = { name, description };

	try {
		const response = await fetch(`/api/systems/create`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			const errorText = await response.json();
			alert(errorText.error);
		} else {
			const responseBody = await response.json();
			console.log(responseBody.message);
			systemId = responseBody.system_id;
			window.location.href = `/systems/${systemId}`;
		}
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error);
	}
};

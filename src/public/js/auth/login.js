document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', handleSubmit);
});

const handleSubmit = async (event) => {
    event.preventDefault();
	console.log('submitting form');
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    const data = { email, password};

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

		if (!response.ok) {
			const errorText = await response.json();
			alert(errorText.error); 
		} else {
			const responseBody = await response.json();
			console.log(responseBody.message); 
			window.location.href = '/users';
		}
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registrationForm').addEventListener('submit', handleSubmit);
});

const handleSubmit = async (event) => {
    event.preventDefault();
	console.log('submitting form');
	const username = document.getElementById('userUsername').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const confPassword = document.getElementById('userConfPassword').value;
    const birth = document.getElementById('userBirth').value;
    const gender = document.getElementById('userGender').value;
	const bio = document.getElementById('userBio').value;

    const data = { username, email, password, confPassword, birth, gender, bio };

    try {
        const response = await fetch('/api/users/register', {
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

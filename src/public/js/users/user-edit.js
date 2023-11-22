let userId;

document.addEventListener('DOMContentLoaded', function() {
	loadUserData();
    document.getElementById('userEditForm').addEventListener('submit', handleSubmit);
});


async function loadUserData() {
    try {
        const response = await fetch(`/api/users/me`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const userData = await response.json();

		userId = userData.id;
        document.getElementById('userUsername').value = userData.username;
        document.getElementById('userEmail').value = userData.email;
        document.getElementById('userBirth').value = userData.birth.split('T')[0];
        document.getElementById('userGender').value = userData.gender;
        document.getElementById('userBio').value = userData.bio;
    } catch (error) {
        console.error('Failed to load user data:', error);
    }
}

const handleSubmit = async (event) => {
    event.preventDefault();
    const username = document.getElementById('userUsername').value;
    const email = document.getElementById('userEmail').value;
    const birth = document.getElementById('userBirth').value;
    const gender = document.getElementById('userGender').value;
    const bio = document.getElementById('userBio').value;

    const data = { username, email, birth, gender, bio };

    try {
		console.log(data);
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
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
            window.location.href = '/users';
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

function deleteUser() {
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
			window.location.href = '/login';
        })
        .catch(error => console.error('Error deleting user:', error));
}

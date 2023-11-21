let systemId;

document.addEventListener('DOMContentLoaded', function() {
	loadSystemData();
    document.getElementById('systemEditForm').addEventListener('submit', handleSubmit);
});

async function loadSystemData() {
    try {
        const systemIdFromUrl = window.location.pathname.split('/').pop(); // Extract the system ID from the URL
        const response = await fetch(`/api/systems/${systemIdFromUrl}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const systemData = await response.json();

        systemId = systemData.id;
        document.getElementById('systemName').value = systemData.name;
        document.getElementById('systemDescription').value = systemData.description;
    } catch (error) {
        console.error('Failed to load system data:', error);
    }
}

const handleSubmit = async (event) => {
    event.preventDefault();
    const name = document.getElementById('systemName').value;
    const description = document.getElementById('systemDescription').value;

    const data = { name, description };

    try {
        const response = await fetch(`/api/systems/${systemId}`, {
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
            window.location.href = '/systems'; // Redirect to the systems page after successful update
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

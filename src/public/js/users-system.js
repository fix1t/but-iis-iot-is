function leaveSystem(systemId) {
    // Make a DELETE request to remove logged user from the system with the specified systemId
    fetch(`/api/systems/${systemId}/leave`, {
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

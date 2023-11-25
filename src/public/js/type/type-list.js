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

// Add event listener to the form
document.getElementById('createTypeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the type name from the form
    const name = document.getElementById('typeName').value;

    fetch('/api/types/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        $('#createTypeModal').modal('hide');
        window.location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

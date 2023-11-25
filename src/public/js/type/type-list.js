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

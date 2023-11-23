fetch('/api/devices/my-devices')
    .then(response => response.json())
    .then(devices => {
        const tableBody = document.getElementById('userDevicesTableBody');
        devices.forEach(device => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${device.id}</td>
                <td>${device.name}</td>
                <td>${device.description}</td>
                <td>${device.user_alias}</td>
            `;
            tableBody.appendChild(row);
        });
    });

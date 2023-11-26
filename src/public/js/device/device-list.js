fetch('/api/devices/my-devices')
    .then(response => response.json())
    .then(devices => {
        const tableBody = document.getElementById('userDevicesTableBody');
        if (devices === null) {
            tableBody.innerHTML = '<tr><td colspan="4">You have no devices yet</td></tr>';
        } else {
            devices.forEach(device => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${device.name}</td>
                    <td>${device.description}</td>
                    <td>${device.user_alias}</td>
                    <td><a href="/${device.id}">Detail</a></td>
                `;
                tableBody.appendChild(row);
            });
        }
    });

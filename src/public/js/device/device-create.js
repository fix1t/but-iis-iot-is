let systemId = null;

document.addEventListener('DOMContentLoaded', function () {
	if (window.location.pathname !== '/device-create') {
		systemId = window.location.pathname.split('/').slice(-2, -1)[0];
	}
	loadTypes();
	loadFreeDevices();
});


document.getElementById('createDeviceButton').addEventListener('click', async () => {
	console.log('Create device button clicked!');
	const deviceName = document.getElementById('deviceName').value;
	const deviceDescription = document.getElementById('deviceDescription').value;
	const userAlias = document.getElementById('userAlias').value;
	const deviceType = document.getElementById('deviceType').value;
	console.log(deviceName, deviceDescription, userAlias, deviceType);

	let url = '/api/devices/create';
	let body = { name: deviceName, description: deviceDescription, type_id: deviceType, userAlias: userAlias };

	// Check if we are in a system
	if (systemId) {
		url += `/${systemId}`;
		body.system_id = systemId;
	}

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			const errorText = await response.json();
			alert(errorText.error);
			throw new Error('Network response was not ok');
		}

		const responseData = await response.json();

		// go to the device detail page
		if (systemId) {
			window.location.href = `/systems/${systemId}/${responseData.device_id}`;
		} else {
			window.location.href = `/${responseData.device_id}`;
		}
		return
	} catch (error) {
		console.error('Failed to create device:', error);
	}
});

async function loadTypes() {
	try {
		const deviceType = document.getElementById('deviceType');
		const response = await fetch(`/api/devices/types`);

		if (!response.ok) {
			const errorText = await response.json();
			alert(errorText.error);
			throw new Error('Network response was not ok');
		}

		const types = await response.json();
		console.log(types);

		deviceType.innerHTML = `
			<option value="">Select a type</option>
			${types.map(type => `<option value="${type.id}">${type.name}</option>`).join('')}
		`;
	} catch (error) {
		console.error('Failed to load types:', error);
	}
}

async function loadFreeDevices() {
	try {
		const freeDeviceList = document.getElementById('freeDevicesList');
		const response = await fetch(`/api/devices/all-my-free`);
		if (!response.ok) {
			freeDeviceList.classList.add('d-none');
			return;
		}

		const data = await response.json();

		// Create the table structure
		const heading = document.createElement('h2');
		heading.textContent = 'Add Device';
		const box = document.createElement('div');
		box.classList.add('table-wrapper-scroll-y', 'my-custom-scrollbar', 'table-fix-head');

		const table = document.createElement('table');
		table.classList.add('table');
		const thead = document.createElement('thead');
		thead.classList.add('thead-light');
		thead.innerHTML = `
            <tr>
                <th>User Alias</th>
                <th>Name</th>
                <th>Description</th>
                <th></th>
            </tr>
        `;

		const tbody = document.createElement('tbody');

		// Fill the table with user data
		data?.forEach(device => {
			const row = document.createElement('tr');
			row.innerHTML = `
                <td>${device.user_alias}</td>
                <td>${device.name}</td>
                <td>${device.description}</td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="addDevice(${device.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </td>    
            `;
			row.id = `deviceRow_${device.id}`;
			tbody.appendChild(row);
		});

		table.appendChild(thead);
		table.appendChild(tbody);
		box.appendChild(table);

		// Clear existing content in freeDeviceList and append the table
		freeDeviceList.innerHTML = '';
		freeDeviceList.appendChild(heading);
		freeDeviceList.appendChild(box);
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

function addDevice(deviceId) {
	// Make a POST request to add User to System
	fetch(`/api/devices/${systemId}/add-device`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ device_id: deviceId }),
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const deletedRow = document.getElementById(`deviceRow_${deviceId}`);
			if (deletedRow) {
				deletedRow.remove();
			}
			window.location.reload();
		})
		.catch(error => console.error('Error adding user:', error));
}

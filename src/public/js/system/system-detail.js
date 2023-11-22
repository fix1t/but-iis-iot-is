let systemId;

document.addEventListener('DOMContentLoaded', function () {
	systemId = window.location.pathname.split('/').pop();
	loadSystemData();
	loadDevices();
});

async function loadSystemData() {
	try {
		const response = await fetch(`/api/systems/${systemId}`);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const systemData = await response.json();

		systemId = systemData.id;
		document.getElementById('systemName').value = systemData.name;
		document.getElementById('systemDescription').value = systemData.description;
		document.getElementById('systemOwner').value = systemData.owner_id;
		document.getElementById('systemCreated').value = systemData.created;
		document.getElementById('systemId').value = systemData.id;
	} catch (error) {
		console.error('Failed to load system data:', error);
	}
}

async function loadDevices() {
	try {
		const deviceList = document.getElementById('deviceList'); // Get the deviceList element
		const response = await fetch(`/api/systems/${systemId}/devices`);

		if (!response.ok) {
			//hide the device list element
			deviceList.classList.add('d-none');
			return;
		}

		const devices = await response.json();

		// Create the table structure
		const table = document.createElement('table');
		table.classList.add('table', 'table-bordered');

		const thead = document.createElement('thead');
		thead.innerHTML = `
		<tr>
		  <th scope="col">Alias</th>
		  <th scope="col">Type</th>
		  <th scope="col">Description</th>
		  <th scope="col">Status</th>
		</tr>
	  `;

		const tbody = document.createElement('tbody');
		tbody.id = 'systemDevicesList';

		// Fill the table with devices
		devices.forEach(device => {
			const row = document.createElement('tr');
			const userAliasCell = document.createElement('td');
			const anchor = document.createElement('a');

			anchor.href = `/device/detail/${device.id}`; // Set the href attribute to '#' for now
			anchor.textContent = device.user_alias;
			anchor.setAttribute('data-device-id', device.id);

			userAliasCell.appendChild(anchor);

			row.appendChild(userAliasCell);
			row.innerHTML += `
		  <td>${device.type_id}</td>
		  <td>${device.description}</td>
		  <td>KPITODO</td>
		`;

			row.id = `deviceRow_${device.id}`;
			tbody.appendChild(row);
		});

		table.appendChild(thead);
		table.appendChild(tbody);

		// Clear existing content in deviceList and append the table
		deviceList.innerHTML = '';
		deviceList.appendChild(table);
	} catch (error) {
		console.error('Failed to load devices:', error);
	}
}

document.addEventListener('DOMContentLoaded', function () {
	const deviceId = window.location.pathname.split('/').pop();
	loadDeviceData(deviceId);
	loadParameters(deviceId);
});

async function loadDeviceData(deviceId) {
	const deviceInfo = document.getElementById('deviceInfo');
	const deviceManagement = document.getElementById('deviceManagement');
	try {
		const response = await fetch(`/api/devices/${deviceId}`);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const deviceData = await response.json();

		deviceInfo.innerHTML = `
			<div>
				<div class="row">
					<div class="col-12">
						<h3 class="text-center">Device Info</h3>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="deviceName" class="form-label">* Name</label>
						<input type="text" id="deviceName" class="form-control" value="${deviceData.name}" disabled required>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="userAlias" class="form-label">Alias</label>
						<input type="text" id="userAlias" class="form-control" value="${deviceData.user_alias}" disabled>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="deviceDescription" class="form-label">Description</label>
						<textarea id="deviceDescription" class="form-control" disabled>${deviceData.description}</textarea>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="deviceType" class="form-label">Type</label>
						<input type="text" id="deviceType" class="form-control" value="${deviceData.type_name}" disabled>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="deviceOwner" class="form-label">Owner</label>
						<input type="text" id="deviceOwner" class="form-control" value="${deviceData.owner_name}" disabled>
					</div>
				</div>
			</div>
		`;
		//add buttons for editing and deleting device
		if (deviceData.isOwner) {
			deviceManagement.innerHTML = `
				<div class="container">
					<div class="d-flex justify-content-center m-3">
						<button type="button" class="btn btn-primary mr-3" onclick="editDevice(${deviceId})">Edit</button>
						<button type="button" class="btn btn-danger " onclick="deleteDevice(${deviceId})">Delete</button>
					</div>
				</div>
			`;
		}

	} catch (error) {
		console.error('Failed to load devices:', error);
	}
}

async function loadParameters(deviceId) {
	// Get the parameters
	// Create a taable row for each parameter with clickable link to the parameter details
	const parameterList = document.getElementById('parameterList');
	try {
		const response = await fetch(`/api/devices/${deviceId}/parameters`);

		console.log(response.body);
		if (!response.ok) {
			console.log('Failed to load parameters.\n' + response.error);
			throw new Error('Network response was not ok');
		}

		const parameters = await response.json();

		parameterList.classList.add('mt-4', 'container');

		const heading = document.createElement('h2');
		heading.textContent = 'Parameter List';

		const table = document.createElement('table');
		table.classList.add('table', 'table-striped', 'table-bordered');

		const tbody = document.createElement('tbody');

		parameters.forEach(async (parameter) => {
			const name = parameter.parameter_name;
			const value = parameter.parameter_value;
			const unit_name = parameter.parameter_unit_name;
			const parameter_id = parameter.parameter_id;
			const device_id = parameter.device_id;

			const successResponse = await fetch(`/api/devices/${deviceId}/parameters/status`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: parameter_id,
					value: value,
				}),
			});

			const successData = await successResponse.json();
			const success = successData.success;
			let currentUrl = window.location.pathname;

			if (successData.errors)
				console.log(successData.errors);

			const row = document.createElement('tr');
			// Add a class based on the success status
			if (!successData.message) {
				row.classList.add(success ? 'bg-success' : 'bg-danger');
				row.classList.add('text-white');
			}

			row.innerHTML = `
				<td>${name}</td>
				<td>${value}</td>
				<td>${unit_name}</td>
				<td><a href="${currentUrl}/${parameter_id}" style="color: #0000FF;">Detail</a></td>
			`;
			tbody.appendChild(row);
		});
		table.appendChild(tbody);
		parameterList.appendChild(heading);
		parameterList.appendChild(table);
	} catch (error) {
		console.error('Failed to load parameters:', error);
	}
}

async function editDevice(deviceId) {
	const deviceNameElement = document.getElementById('deviceName');
	const deviceDescriptionElement = document.getElementById('deviceDescription');
	const userAliasElement = document.getElementById('userAlias');
	const deviceManagement = document.getElementById('deviceManagement');

	// Enable the input fields
	deviceNameElement.removeAttribute('disabled');
	deviceDescriptionElement.removeAttribute('disabled');
	userAliasElement.removeAttribute('disabled');

	// Replace the "Edit" button with "Save" and "Cancel" buttons
	deviceManagement.innerHTML = `
		<div class="container">
			<div class="d-flex justify-content-center m-3">
				<button type="button" class="btn btn-primary mr-3" onclick="saveDeviceChanges(${deviceId})">Save</button>
				<button type="button" class="btn btn-secondary" onclick="cancelEdit()">Cancel</button>
			</div>
		</div>
	`;
}


function cancelEdit() {
	// Simply reload the page to cancel the edit
	window.location.reload();
}

async function saveDeviceChanges(deviceId) {
	// Retrieve the updated values from the input fields
	const deviceName = document.getElementById('deviceName').value;
	const deviceDescription = document.getElementById('deviceDescription').value;
	const deviceType = document.getElementById('deviceType').value;
	const deviceOwner = document.getElementById('deviceOwner').value;
	const userAlias = document.getElementById('userAlias').value;

	try {
		// Send a PUT request to update the device data
		const response = await fetch(`/api/devices/${deviceId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: deviceName,
				description: deviceDescription,
				type_id: deviceType,
				owner_id: deviceOwner,
				user_alias: userAlias,
			}),
		});

		if (!response.ok) {
			alert('Failed to save device changes.\n' + response.error);
			throw new Error('Network response was not ok');
		}

		// Reload the page to reflect the updated device information
		window.location.reload();
	} catch (error) {
		console.error('Failed to save device changes:', error);
	}
}

async function deleteDevice(deviceId) {
	try {
		const response = await fetch(`/api/devices/${deviceId}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		window.location.href = '/';
	} catch (error) {
		console.error('Failed to delete device:', error);
	}
}

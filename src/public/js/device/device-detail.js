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
			<div class="container">
				<div class="row">
					<div class="col-12">
						<h3 class="text-center">Device Info</h3>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="deviceName" class="form-label">Name</label>
						<input type="text" id="deviceName" class="form-control" value="${deviceData.name}" disabled>
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
						<input type="text" id="deviceType" class="form-control" value="${deviceData.type_id}" disabled>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="deviceOwner" class="form-label">Owner</label>
						<input type="text" id="deviceOwner" class="form-control" value="${deviceData.owner_id}" disabled>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="userAlias" class="form-label">Alias</label>
						<input type="text" id="userAlias" class="form-control" value="${deviceData.user_alias}" disabled>
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

		parameters.forEach(parameter => {
			const row = document.createElement('tr');
			row.innerHTML = `
				<td>${parameter.parameter_name}</td>
				<td>${parameter.parameter_value}</td>
				<td>${parameter.parameter_unit_name}</td>
				<td><a href="/parameters/${parameter.parameter_id}/${parameter.device_id}">Detail</a></td>
			`;
			parameterList.appendChild(row);
		});
	} catch (error) {
		console.error('Failed to load parameters:', error);
	}
}

async function editDevice(deviceId) {
	window.location.href = `/devices/${deviceId}/edit`;
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

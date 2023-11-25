document.addEventListener('DOMContentLoaded', function () {
	const deviceId = window.location.pathname.split('/').pop();
	loadDeviceData(deviceId);
	loadParameters(deviceId);
});

async function loadDeviceData(deviceId) {
	try {
		const deviceInfo = document.getElementById('deviceInfo');
		const response = await fetch(`/api/devices/${deviceId}`);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const device = await response.json();

		deviceInfo.innerHTML = `
			<div>
				<div class="row">
					<div class="col-12">
						<h3 class="text-center">Device Info</h3>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="deviceName" class="form-label">Name</label>
						<input type="text" id="deviceName" class="form-control" value="${device.name}" disabled>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="deviceDescription" class="form-label">Description</label>
						<textarea id="deviceDescription" class="form-control" disabled>${device.description}</textarea>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="deviceType" class="form-label">Type</label>
						<input type="text" id="deviceType" class="form-control" value="${device.type_id}" disabled>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="deviceOwner" class="form-label">Owner</label>
						<input type="text" id="deviceOwner" class="form-control" value="${device.owner_id}" disabled>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="userAlias" class="form-label">Alias</label>
						<input type="text" id="userAlias" class="form-control" value="${device.user_alias}" disabled>
					</div>
				</div>
			</div>
		`;
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
			if (successData.errors)
				console.log(successData.errors);

			const row = document.createElement('tr');
			// Add a class based on the success status
			row.classList.add(success ? 'bg-success' : 'bg-danger');
			row.classList.add('text-white');

			row.innerHTML = `
				<td>${name}</td>
				<td>${value}</td>
				<td>${unit_name}</td>
				<td><a href="/parameters/${parameter_id}/${device_id}">Detail</a></td>
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

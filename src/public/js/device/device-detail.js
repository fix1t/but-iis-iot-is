document.addEventListener('DOMContentLoaded', function () {
	const deviceId = window.location.pathname.split('/').pop();
	loadDeviceData(deviceId);
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
			<div class="container">
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

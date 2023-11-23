document.addEventListener('DOMContentLoaded', function () {
	loadTypes();
});


document.getElementById('createDeviceButton').addEventListener('click', async () => {
	const deviceName = document.getElementById('deviceName').value;
	const deviceDescription = document.getElementById('deviceDescription').value;
	const userAlias = document.getElementById('userAlias').value;
	const deviceType = document.getElementById('deviceType').value;
	console.log(deviceName, deviceDescription, userAlias, deviceType);

	const systemId = window.location.pathname.split('/').pop();
	console.log(systemId);

	try {
		const response = await fetch(`/api/devices/create/${systemId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: deviceName, description: deviceDescription, type_id: deviceType, user_alias: userAlias, system_id: systemId })
		});

		if (!response.ok) {
			const errorText = await response.json();
			alert(errorText.error);
			throw new Error('Network response was not ok');
		}

		const responseData = await response.json();

		// go to the device detail page
		window.location.href = `/device/detail/${responseData.device_id}`;
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

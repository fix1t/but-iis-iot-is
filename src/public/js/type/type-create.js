document.addEventListener('DOMContentLoaded', function() {
		
	// Add event listener to the form
	document.getElementById('typeForm').addEventListener('submit', function(event) {
		event.preventDefault();

		// Get the type name and parameters from the form
		const typeName = document.getElementById('typeName').value;
		const parameterNames = Array.from(document.getElementsByClassName('parameterName')).map(input => input.value);
		const unitNames = Array.from(document.getElementsByClassName('unitName')).map(input => input.value);
		const parameters = parameterNames.map((name, index) => ({ name, unit_name: unitNames[index] }));

		fetch('/api/types/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: typeName, parameters })
		})
		.then(response => {
			if (!response.ok) {
				return response.json().then(data => { throw new Error(data.error) });
			}
			return response.json();
		})
		.then(data => {
			console.log('Success:', data);
			$('#createTypeModal').modal('hide');
			window.location.href = `/types`;
		})
		.catch((error) => {
			console.error('Error:', error.message);
			// Display the error message to the user
			const errorMessageDiv = document.getElementById('errorMessage');
			errorMessageDiv.textContent = error.message;
			errorMessageDiv.style.display = 'block';
		});
	});

	window.removeParameter = function () {
		console.log('Removing parameter');
		// Get all parameter forms
		var parameterForms = Array.from(document.getElementsByClassName('parameter'));

		// If there's more than one parameter form, remove the last one
		if (parameterForms.length > 1) {
			parameterForms[parameterForms.length - 1].remove();
		}

		// If only one parameter form is left, hide the "Remove Parameter" button
		parameterForms = Array.from(document.getElementsByClassName('parameter'));
		if (parameterForms.length <= 1) {
			document.getElementById('removeParameterButton').style.display = 'none';
		}
	}
	window.addParameter = function () {
		const parametersDiv = document.getElementById('parameters');
		const newParameterDiv = document.createElement('div');
		newParameterDiv.className = 'form-group parameter';
		newParameterDiv.innerHTML = `
			<hr style="border: 1px solid black;">
			<label for="parameterName">Parameter Name:</label>
			<input type="text" class="form-control parameterName" name="parameterName">
			<label for="unitName">Unit Name:</label>
			<input type="text" class="form-control unitName" name="unitName">
		`;
		parametersDiv.appendChild(newParameterDiv);
		// Show the "Remove Parameter" button
		document.getElementById('removeParameterButton').style.display = 'inline-block';
	}
});

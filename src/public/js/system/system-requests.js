function fetchDataAndPrintTableRows(url, tableBodyId, isMyRequests) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById(tableBodyId);

            if (data.length === 0) {
                const noRequestsMessage = document.createElement('tr');
                noRequestsMessage.innerHTML = '<td colspan="5">No requests available</td>';
                tableBody.appendChild(noRequestsMessage);
                return;
            }

            data.forEach(request => {
                const row = document.createElement('tr');
                let htmlContent = '';

                if (isMyRequests) {
                    const statusText = request.status.charAt(0).toUpperCase() + request.status.slice(1);
                    const textColor = request.status === 'accepted' ? 'green' : (request.status === 'rejected' ? 'red' : 'black');

                    htmlContent = `
                        <td>${request.system_name}</td>
                        <td>${request.owner_name}</td>
                        <td>${request.message}</td>
                        <td>${new Date(request.created).toLocaleString()}</td>
                        <td style="color: ${textColor}">${statusText}</td>
                    `;
                } else {
                    htmlContent = `
						<td>${request.system_name}</td>
                        <td>${new Date(request.created).toLocaleString()}</td>
                        <td>${request.message}</td>
                        <td>${request.username}</td>
                        <td>${request.email}</td>
                        <td>${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</td>
                        <td>
                            <button class="btn btn-success btn-sm" onclick="acceptRequest(${request.id}, 'accept')">
                                <i class="fas fa-check"></i>
                            </button>
                        </td>                        
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="rejectRequest(${request.id}, 'reject')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
                }

                row.innerHTML = htmlContent;
                row.id = `userRow_${request.id}`;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

function acceptRequest(requestId) {
	// Make a PUT request to accept user request to join System
	fetch(`/api/user/system/join-request/${requestId}`, {
		method: 'PUT',
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const deletedRow = document.getElementById(`userRow_${requestId}`);
			if (deletedRow) {
				deletedRow.remove();
			}
		})
		.catch(error => console.error('Error accepting request:', error));
}

function rejectRequest(requestId) {
	// Make a DELETE request to reject user request to join System
	fetch(`/api/user/system/join-request/${requestId}`, {
		method: 'DELETE',
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const deletedRow = document.getElementById(`userRow_${requestId}`);
			if (deletedRow) {
				deletedRow.remove();
			}
		})
		.catch(error => console.error('Error rejecting request:', error));
}

// Fetch and print system requests
fetchDataAndPrintTableRows('/api/user/system/requests', 'requestTableBody', false);

// Fetch and print user's requests
fetchDataAndPrintTableRows('/api/user/system/my-requests', 'myRequestTableBody', true);

document.addEventListener('DOMContentLoaded', function () {
	const back = document.getElementById('back');
	back.className = 'container mb-3';
	const backButton = document.createElement('button');
	backButton.className = 'btn btn-secondary';
	backButton.innerHTML = '&#8592; Go Back';
	back.appendChild(backButton);

	backButton.addEventListener('click', function () {
		const currentUrl = window.location.pathname;
		const urlSegments = currentUrl.split('/');
		urlSegments.pop();
		newUrl = urlSegments.join('/');
		if (urlSegments.length === 1)
			newUrl = '/';
		window.location.href = newUrl;
	});
});

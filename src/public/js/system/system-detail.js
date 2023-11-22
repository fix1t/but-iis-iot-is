let systemId;

document.addEventListener('DOMContentLoaded', function() {
	loadSystemData();
});

async function loadSystemData() {
  try {
      const systemIdFromUrl = window.location.pathname.split('/').pop(); // Extract the system ID from the URL
      const response = await fetch(`/api/systems/${systemIdFromUrl}`);
      
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

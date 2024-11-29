// Sample incident data
const incidents = [
  {
    id: 1,
    type: "Car Accident",
    severity: "High",
    location: "Downtown Main St",
  },
  { id: 2, type: "Fire", severity: "Medium", location: "Eastside Blvd" },
  {
    id: 3,
    type: "Medical Emergency",
    severity: "Critical",
    location: "North Avenue",
  },
];

// Add incidents to the UI
function loadIncidents() {
  const incidentList = document.getElementById("incidents");
  incidents.forEach((incident) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            <div>
                <strong>${incident.type}</strong> - ${incident.severity}
                <p>Location: ${incident.location}</p>
            </div>
        `;
    listItem.classList.add("incident-item");
    incidentList.appendChild(listItem);
  });
}

// Simulate interaction with resource cards
document.querySelectorAll(".resource-card").forEach((card) => {
  card.addEventListener("click", () => {
    alert(`You clicked on ${card.querySelector("h3").textContent}!`);
  });
});

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
  loadIncidents();
});

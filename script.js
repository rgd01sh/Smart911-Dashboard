document.addEventListener("DOMContentLoaded", () => {
  // Sidebar Navigation Logic
  const sidebarItems = document.querySelectorAll(".nav-list-item");
  const sections = document.querySelectorAll(".tab-section");

  sidebarItems.forEach((item) => {
    item.addEventListener("click", () => {
      sidebarItems.forEach((btn) => btn.classList.remove("active"));
      sections.forEach((section) => section.classList.remove("active"));

      item.classList.add("active");
      const targetTab = item.getAttribute("data-tab");
      document.getElementById(targetTab).classList.add("active");
    });
  });

  // Initialize Map for Yanbu Industrial City (Fixed to match Yanbu streets)
  const map = L.map("map").setView([24.0891, 38.0636], 13); // Central Yanbu Industrial City coordinates

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Data for Incidents in Yanbu Industrial City (Street-level)
  const incidents = [
    {
      id: 1,
      priority: "High",
      type: "Fire",
      location: "Al-Bathna Street",
      lat: 24.09,
      lon: 38.06,
      status: "Resolved",
    },
    {
      id: 2,
      priority: "Medium",
      type: "Accident",
      location: "Industrial Avenue",
      lat: 24.085,
      lon: 38.0655,
      status: "Pending",
    },
    {
      id: 3,
      priority: "Low",
      type: "Medical Emergency",
      location: "Al-Madina Road",
      lat: 24.088,
      lon: 38.07,
      status: "Resolved",
    },
    {
      id: 4,
      priority: "Medium",
      type: "Gas Leak",
      location: "Harbor Road",
      lat: 24.092,
      lon: 38.068,
      status: "Pending",
    },
    {
      id: 5,
      priority: "High",
      type: "Explosion",
      location: "Factory Road",
      lat: 24.086,
      lon: 38.062,
      status: "Resolved",
    },
  ];

  // Resource Data
  const resources = [
    { type: "Fire Unit", count: 3 },
    { type: "Ambulance", count: 5 },
    { type: "Emergency Team", count: 2 },
  ];

  // Render Resource Tracker
  function renderResourceTracker() {
    const resourceList = document.getElementById("resource-list");
    resourceList.innerHTML = resources
      .map(
        (resource) => `<li>${resource.type}: ${resource.count} available</li>`
      )
      .join("");
  }

  // Render Incident Table
  function renderIncidentTable() {
    const tableBody = document.getElementById("incident-table");
    tableBody.innerHTML = incidents
      .map(
        (incident) => `
          <tr>
            <td style="color: ${getPriorityColor(incident.priority)};">${
          incident.priority
        }</td>
            <td>${incident.type}</td>
            <td>${incident.location}</td>
            <td>${incident.status}</td>
          </tr>`
      )
      .join("");
  }

  // Get Priority Color
  function getPriorityColor(priority) {
    return priority === "High"
      ? "red"
      : priority === "Medium"
      ? "orange"
      : "green";
  }

  // Plot Incidents on Map
  function plotIncidentsOnMap() {
    incidents.forEach((incident) => {
      L.circleMarker([incident.lat, incident.lon], {
        color: getPriorityColor(incident.priority),
        radius: 8,
      }).addTo(map).bindPopup(`
          <strong>${incident.type}</strong><br>
          ${incident.location}<br>
          Priority: ${incident.priority}<br>
          Status: ${incident.status}`);
    });
  }

  // Render Incident History
  function renderIncidentHistory(filteredIncidents) {
    const historyTableBody = document.getElementById("history-table-body");
    historyTableBody.innerHTML = filteredIncidents
      .map(
        (incident) => `
          <tr>
            <td>${incident.id}</td>
            <td style="color: ${getPriorityColor(incident.priority)};">${
          incident.priority
        }</td>
            <td>${incident.type}</td>
            <td>${incident.location}</td>
            <td>${incident.status}</td>
          </tr>`
      )
      .join("");
  }

  // Add Search Functionality to Filter Incidents
  document
    .getElementById("history-search-input")
    .addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filteredIncidents = incidents.filter(
        (incident) =>
          incident.type.toLowerCase().includes(query) ||
          incident.location.toLowerCase().includes(query)
      );
      renderIncidentHistory(filteredIncidents);
    });

  // Render Charts
  function renderCharts() {
    const incidentPriorityChart = document
      .getElementById("incident-priority-chart")
      .getContext("2d");
    new Chart(incidentPriorityChart, {
      type: "bar",
      data: {
        labels: ["High", "Medium", "Low"],
        datasets: [
          {
            label: "Incident Priorities",
            data: [
              incidents.filter((i) => i.priority === "High").length,
              incidents.filter((i) => i.priority === "Medium").length,
              incidents.filter((i) => i.priority === "Low").length,
              incidents.filter((i) => i.priority === "Critical").length,
              incidents.filter((i) => i.priority === "Moderate").length,
            ],
            backgroundColor: [
              "#f43f5e",
              "#facc15",
              "#22c55e",
              "#8b5cf6",
              "#3b82f6",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });

    const resourceAvailabilityChart = document
      .getElementById("resource-availability-chart")
      .getContext("2d");
    new Chart(resourceAvailabilityChart, {
      type: "pie",
      data: {
        labels: resources.map((r) => r.type),
        datasets: [
          {
            data: resources.map((r) => r.count),
            backgroundColor: ["#3b82f6", "#34d399", "#8b5cf6"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });
  }

  // Handle Resource Allocation and Show Progress Bar
  document
    .getElementById("allocate-resource-button")
    .addEventListener("click", () => {
      const selectedResourceType =
        document.getElementById("resource-type").value;
      const selectedLocation =
        document.getElementById("incident-location").value;

      const resource = resources.find((r) => r.type === selectedResourceType);

      if (resource && resource.count > 0) {
        // Show the progress bar
        const progressBar = document.getElementById("progress-bar");
        const progressContainer = document.getElementById("progress-container");
        const allocationMessage = document.getElementById("allocation-message");

        allocationMessage.textContent = "Allocating resource... please wait.";
        allocationMessage.style.color = "orange";
        progressContainer.style.display = "block"; // Show progress container
        progressBar.value = 0; // Reset progress bar

        let progress = 0;

        // Simulate the resource allocation with a loading progress
        const progressInterval = setInterval(() => {
          progress += 10;
          progressBar.value = progress;

          if (progress >= 100) {
            clearInterval(progressInterval); // Stop the progress

            // Allocate the resource
            resource.count -= 1;

            // Update message
            allocationMessage.textContent = `${selectedResourceType} successfully allocated to incident at ${selectedLocation}.`;
            allocationMessage.style.color = "green"; // Success message color

            // Update Resource Tracker
            renderResourceTracker();

            // Show summary of allocation
            const allocationSummary =
              document.getElementById("allocation-summary");
            allocationSummary.innerHTML = `<strong>Allocated Resource:</strong> ${selectedResourceType} to ${selectedLocation}`;

            // Optionally show a toast message or notification
            alert(`${selectedResourceType} allocated to ${selectedLocation}.`);

            // Hide progress container after allocation
            progressContainer.style.display = "none";
          }
        }, 300); // Increase progress by 10% every 300ms
      } else {
        alert(`No ${selectedResourceType} available.`);
      }
    });

  // Render Resource Management Section
  function renderResourceManagementSection() {
    const resourceDropdown = document.getElementById("resource-type");
    resourceDropdown.innerHTML = resources
      .map(
        (resource) =>
          `<option value="${resource.type}">${resource.type}</option>`
      )
      .join("");

    const locationDropdown = document.getElementById("incident-location");
    locationDropdown.innerHTML = [
      "Al-Bathna Street",
      "Industrial Avenue",
      "City Road",
      "Port Road",
      "Factory Road",
    ]
      .map((location) => `<option value="${location}">${location}</option>`)
      .join("");
  }

  // Initialize Dashboard

  function initializeDashboard() {
    renderResourceTracker(); // Display available resources
    renderIncidentTable(); // Display incidents table
    renderResourceManagementSection(); // Populate dropdowns for resource and locations
    renderIncidentHistory(incidents); // Populate incident history with initial data
    renderCharts(); // Render charts
    plotIncidentsOnMap(); // Plot incidents on map

    // Gauge Chart Initialization
    const randomScalingFactor = () => Math.round(Math.random() * 100);
    const randomData = () => [
      randomScalingFactor(),
      randomScalingFactor(),
      randomScalingFactor(),
      randomScalingFactor(),
    ];
    const randomValue = (data) => Math.max(...data) * Math.random();

    const gaugeData = randomData();
    const gaugeValue = randomValue(gaugeData);

    const gaugeConfig = {
      type: "gauge",
      data: {
        datasets: [
          {
            data: gaugeData,
            value: gaugeValue,
            backgroundColor: ["green", "yellow", "orange", "red"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        title: { display: true, text: "AI Risk Analysis" },
        layout: { padding: { bottom: 30 } },
        needle: {
          radiusPercentage: 2,
          widthPercentage: 3.2,
          lengthPercentage: 80,
          color: "rgba(0, 0, 0, 1)",
        },
        valueLabel: { formatter: Math.round },
      },
    };

    const gaugeCanvas = document.getElementById("gauge-chart").getContext("2d");
    const gaugeChart = new Chart(gaugeCanvas, gaugeConfig);

    document.getElementById("update-gauge").addEventListener("click", () => {
      gaugeConfig.data.datasets.forEach((dataset) => {
        dataset.data = randomData();
        dataset.value = randomValue(dataset.data);
      });
      gaugeChart.update();
    });
  }
  initializeDashboard(); // Run the initialization functions
});

let map;
let markers = [];

function initMap() {
  map = L.map('map').setView([52.1, 5.1], 7); // Center on Netherlands
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

function updateMapMarkers(data) {
  // Remove old markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  data.forEach(item => {
    if (item.lat && item.lng) {
      const marker = L.marker([item.lat, item.lng])
        .addTo(map)
        .bindPopup(`<strong>${item.sport}</strong><br>${item.city}<br>Ages: ${item.age}`);
      markers.push(marker);
    }
  });
}

function displayResults(data) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = data.length
    ? data.map(item =>
        `<div class="result-card">
          <h3>${item.sport}</h3>
          <p><strong>City:</strong> ${item.city}</p>
          <p><strong>Age:</strong> ${item.age}</p>
        </div>`
      ).join('')
    : `<p>No results found.</p>`;
}

function applyFilters(data) {
  const query = document.getElementById('search').value.toLowerCase();
  const selectedSport = document.getElementById('filter-sport').value;
  const selectedCity = document.getElementById('filter-city').value;
  const selectedAge = document.getElementById('filter-age').value;

  return data.filter(item => {
    const matchesQuery =
      item.sport.toLowerCase().includes(query) ||
      item.city.toLowerCase().includes(query);

    const matchesSport = selectedSport === '' || item.sport === selectedSport;
    const matchesCity = selectedCity === '' || item.city === selectedCity;
    const matchesAge = selectedAge === '' || item.age === selectedAge;

    return matchesQuery && matchesSport && matchesCity && matchesAge;
  });
}

function populateDropdowns(data) {
  const sportSet = new Set();
  const citySet = new Set();
  const ageSet = new Set();

  data.forEach(item => {
    sportSet.add(item.sport);
    citySet.add(item.city);
    ageSet.add(item.age);
  });

  const sportSelect = document.getElementById('filter-sport');
  const citySelect = document.getElementById('filter-city');
  const ageSelect = document.getElementById('filter-age');

  sportSet.forEach(sport => {
    sportSelect.innerHTML += `<option value="${sport}">${sport}</option>`;
  });
  citySet.forEach(city => {
    citySelect.innerHTML += `<option value="${city}">${city}</option>`;
  });
  ageSet.forEach(age => {
    ageSelect.innerHTML += `<option value="${age}">${age}</option>`;
  });
}

function loadAndFilterData() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const filtered = applyFilters(data);
      displayResults(filtered);
      updateMapMarkers(filtered);
    });
}

function initFilters() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      populateDropdowns(data);
      loadAndFilterData();
    });
}

// Event Listeners
document.getElementById('search').addEventListener('input', loadAndFilterData);
document.getElementById('filter-sport').addEventListener('change', loadAndFilterData);
document.getElementById('filter-city').addEventListener('change', loadAndFilterData);
document.getElementById('filter-age').addEventListener('change', loadAndFilterData);

// Initialize
initMap();
initFilters();

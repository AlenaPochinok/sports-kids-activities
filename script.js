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
  markers.forEach(m => map.removeLayer(m));
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
  document.getElementById('results').innerHTML = data.map(item =>
    `<div><strong>${item.sport}</strong> in ${item.city} (Ages ${item.age})</div>`
  ).join('');
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

function loadAndFilterData() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const filtered = applyFilters(data);
      displayResults(filtered);
      updateMapMarkers(filtered);
    });
}

document.getElementById('search').addEventListener('input', loadAndFilterData);
document.getElementById('filter-sport').addEventListener('change', loadAndFilterData);
document.getElementById('filter-city').addEventListener('change', loadAndFilterData);
document.getElementById('filter-age').addEventListener('change', loadAndFilterData);

initMap();
loadAndFilterData();

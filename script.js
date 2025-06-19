const API_KEY = "d74d10fb9e644c5faa0072b5fc0fbbd8";

// Example club data
const clubs = [
  { sport: "Football", city: "Amsterdam", age: "6-12", lat: 52.3676, lng: 4.9041 },
  { sport: "Swimming", city: "Rotterdam", age: "5-10", lat: 51.9225, lng: 4.4792 },
  { sport: "Tennis", city: "Utrecht", age: "7-14", lat: 52.0907, lng: 5.1214 }
];

// Map initialization
let map = L.map('map').setView([52.3676, 4.9041], 7);

L.tileLayer(`https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}.png?apiKey=${API_KEY}`, {
  attribution: '© OpenMapTiles © OpenStreetMap contributors',
  maxZoom: 18
}).addTo(map);

// Add markers
let markers = [];

function updateMapMarkers(clubList) {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  clubList.forEach(club => {
    const marker = L.marker([club.lat, club.lng])
      .addTo(map)
      .bindPopup(`<strong>${club.sport}</strong><br>${club.city}<br>Ages: ${club.age}`);
    markers.push(marker);
  });
}

function displayResults(clubList) {
  document.getElementById('results').innerHTML = clubList.map(club =>
    `<div><strong>${club.sport}</strong> in ${club.city} (Ages ${club.age})</div>`
  ).join('');
}

// Initial load
displayResults(clubs);
updateMapMarkers(clubs);

// Filter clubs
document.getElementById('search').addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  const filtered = clubs.filter(club =>
    club.sport.toLowerCase().includes(query) ||
    club.city.toLowerCase().includes(query)
  );
  displayResults(filtered);
  updateMapMarkers(filtered);
});

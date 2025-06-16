const searchInput = document.getElementById('search');
const sportFilter = document.getElementById('filter-sport');
const cityFilter = document.getElementById('filter-city');
const ageFilter = document.getElementById('filter-age');
const resultsDiv = document.getElementById('results');

function applyFilters(data) {
  const query = searchInput.value.toLowerCase();
  const selectedSport = sportFilter.value;
  const selectedCity = cityFilter.value;
  const selectedAge = ageFilter.value;

  return data.filter(item => {
    const matchesQuery =
      item.sport.toLowerCase().includes(query) ||
      item.city.toLowerCase().includes(query);

    const matchesSport = selectedSport === "" || item.sport === selectedSport;
    const matchesCity = selectedCity === "" || item.city === selectedCity;
    const matchesAge = selectedAge === "" || item.age === selectedAge;

    return matchesQuery && matchesSport && matchesCity && matchesAge;
  });
}

function displayResults(data) {
  resultsDiv.innerHTML = data.map(item =>
    `<div><strong>${item.sport}</strong> in ${item.city} (Ages ${item.age})</div>`
  ).join('');
}

function loadAndFilterData() {
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      const filtered = applyFilters(data);
      displayResults(filtered);
    });
}

// Add event listeners
[searchInput, sportFilter, cityFilter, ageFilter].forEach(el =>
  el.addEventListener('input', loadAndFilterData)
);

// Initial load
loadAndFilterData();

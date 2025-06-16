document.getElementById('search').addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const filtered = data.filter(activity =>
        activity.sport.toLowerCase().includes(query) ||
        activity.city.toLowerCase().includes(query)
      );
      document.getElementById('results').innerHTML = filtered.map(item =>
        `<div><strong>${item.sport}</strong> in ${item.city} (Ages ${item.age})</div>`
      ).join('');
    });
});

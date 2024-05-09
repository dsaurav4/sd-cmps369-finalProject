let markers = [];
let map;

document.addEventListener('DOMContentLoaded', async function() {
  initializeMap();
  await loadPlaces();

  const listGroups = document.querySelectorAll(".list-group");
  listGroups.forEach((listGroup) => {
    listGroup.addEventListener("click", on_row_click);
  });

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('keyup', handleSearch);
});

function initializeMap() {
  const uls = document.querySelectorAll(".list-group");
  const mapContainer = document.getElementById("map");
  if(uls.length > 0){
    const lastUl = uls[uls.length - 1];
    const lat = parseFloat(lastUl.dataset.lat);
    const lng = parseFloat(lastUl.dataset.lng);
    map = L.map("map").setView([lat, lng], 13);
    mapContainer.style.display = "";
  }
  else {
    map = L.map("map").setView([0,0], 13);
    mapContainer.style.display = "none";
  }
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

async function loadPlaces() {
  const response = await axios.get("/places");

  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  if (response && response.data && response.data.contacts) {
    response.data.contacts.forEach(contact => {
      if (contact.Latitude && contact.Longitude) {
        const marker = L.marker([contact.Latitude, contact.Longitude])
          .addTo(map)
          .bindPopup(getPopupContent(contact));
        markers.push(marker);
        map.flyTo(new L.LatLng(contact.Latitude, contact.Longitude));
      }
    });
  }
}

function getPopupContent(contact) {
  return `<b>${contact.Title}. ${contact.First_Name} ${contact.Last_Name}</b>
          <br>Phone: ${contact.Phone_Number} 
          <br> Email: ${contact.Email_Address}
          <br/>${contact.Address}`;
}

function on_row_click(e) {
  let row = e.target.closest(".list-group");
  if (row) {
    const lat = row.dataset.lat;
    const lng = row.dataset.lng;
    if (lat && lng) {
      map.flyTo([lat, lng], 13);
    }
  } else {
    console.error("Failed to find list group element");
  }
}

function handleSearch(e) {
  const searchValue = e.target.value.toLowerCase();
  document.querySelectorAll('.list-group').forEach(list => {
    const firstLi = list.querySelector('li:first-child');
    if (firstLi && firstLi.dataset.name.toLowerCase().includes(searchValue)) {
      list.style.display = '';
    } else {
      list.style.display = 'none';
    }
  });
}

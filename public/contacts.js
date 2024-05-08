let markers = [];

const loadPlaces = async () => {
  const response = await axios.get("/places");

  for (var i = 0; i < markers.length; i++) {
    map.removeLayer(markers[i]);
  }
  markers = [];

  if (response && response.data && response.data.contacts) {
    for (const contact of response.data.contacts) {
      if (contact.Latitude && contact.Longitude) {
        const marker = L.marker([contact.Latitude, contact.Longitude])
          .addTo(map)
          .bindPopup(
            `<b>${
              contact.Title +
              ". " +
              contact.First_Name +
              " " +
              contact.Last_Name
            }</b>
             <br>${
               "Phone: " +
               contact.Phone_Number +
               " / Email: " +
               contact.Email_Address
             }
             <br/>${contact.Address}
            `
          );
        markers.push(marker);
        map.flyTo(new L.LatLng(contact.Latitude, contact.Longitude));
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const listGroups = document.querySelectorAll("ul");
  listGroups.forEach((listGroup) => {
    listGroup.addEventListener("click", on_row_click);
  });
});

const on_row_click = (e) => {
  let row = e.target;
  if (!row.classList.contains("list-group")) {
    row = row.closest(".list-group");
  }
  if (row) {
    const lat = row.dataset.lat;
    const lng = row.dataset.lng;
    if (lat && lng) {
      map.flyTo([lat, lng], 13);
    }
  } else {
    console.error("Failed to find list group element");
  }
};

const uls = document.querySelectorAll("ul");
const lastUl = uls[uls.length - 1];
const lat = parseFloat(lastUl.dataset.lat);
const lng = parseFloat(lastUl.dataset.lng);

const map = L.map("map").setView([lat, lng], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const contactLists = document.querySelectorAll('.list-group');

  searchInput.addEventListener('keyup', function(e) {
    const searchValue = e.target.value.toLowerCase();

    contactLists.forEach(list => {

      const firstLi = list.querySelector('li:first-child');
      if (firstLi) {
        const name = firstLi.dataset.name.toLowerCase();
        if (name.includes(searchValue)) {
          list.style.display = ''; 
        } else {
          list.style.display = 'none';
        }
      }
    });
  });
});
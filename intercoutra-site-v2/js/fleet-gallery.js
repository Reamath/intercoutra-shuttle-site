// ---------------------------------------------------------------------------
// Fleet gallery data
// Each vehicle has a set of full-size images (for the lightbox) and a
// matching thumbnail (smaller, faster-loading) used on the grid card.
// ---------------------------------------------------------------------------
const FLEET_VEHICLES = [
  {
    id: "bmw-320d",
    name: "BMW 320d",
    tagline: "3 Series Saloon · Executive Sedan",
    images: [
      "images/fleet/bmw-320d-1.jpg",
      "images/fleet/bmw-320d-2.jpg",
    ],
  },
  {
    id: "vito",
    name: "Mercedes-Benz Vito Tourer",
    tagline: "Premium Passenger Shuttle",
    images: [
      "images/fleet/vito-1.jpg",
      "images/fleet/vito-2.jpg",
    ],
  },
  {
    id: "bmw-msport",
    name: "BMW 3 Series M Sport",
    tagline: "Executive Sedan · M Sport Package",
    images: [
      "images/fleet/bmw-msport-1.jpg",
      "images/fleet/bmw-msport-2.jpg",
      "images/fleet/bmw-msport-3.jpg",
      "images/fleet/bmw-msport-4.jpg",
    ],
  },
  {
    id: "bmw-320i",
    name: "BMW 320i",
    tagline: "3 Series Saloon · Executive Sedan",
    images: [
      "images/fleet/bmw-320i-1.jpg",
      "images/fleet/bmw-320i-2.jpg",
      "images/fleet/bmw-320i-3.jpg",
      "images/fleet/bmw-320i-4.jpg",
    ],
  },
];

let currentVehicle = null;
let currentIndex = 0;

// ---------------------------------------------------------------------------
// Render the thumbnail grid into any element with id="fleetGalleryGrid"
// ---------------------------------------------------------------------------
function renderFleetGalleryGrid() {
  const grid = document.getElementById("fleetGalleryGrid");
  if (!grid) return;

  grid.innerHTML = FLEET_VEHICLES.map((v) => `
    <div class="fleet-card gallery-card" onclick="openLightbox('${v.id}', 0)">
      <div class="photo" style="background-image:url('images/fleet/thumbs/${v.id === 'bmw-320d' ? 'bmw-320d-1' : v.id === 'vito' ? 'vito-1' : v.id === 'bmw-msport' ? 'bmw-msport-1' : 'bmw-320i-1'}.jpg');">
        <div class="photo-count"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="15" height="15" rx="2"/><path d="M8 21h10a2 2 0 0 0 2-2V9"/></svg> ${v.images.length}</div>
        <div class="view-overlay">View Gallery →</div>
      </div>
      <div class="body">
        <h3>${v.name}</h3>
        <p>${v.tagline}</p>
      </div>
    </div>
  `).join("");
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------
function openLightbox(vehicleId, startIndex) {
  currentVehicle = FLEET_VEHICLES.find((v) => v.id === vehicleId);
  if (!currentVehicle) return;
  currentIndex = startIndex || 0;
  renderLightbox();
  document.getElementById("lightboxOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightboxOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function lightboxNext() {
  if (!currentVehicle) return;
  currentIndex = (currentIndex + 1) % currentVehicle.images.length;
  renderLightbox();
}

function lightboxPrev() {
  if (!currentVehicle) return;
  currentIndex = (currentIndex - 1 + currentVehicle.images.length) % currentVehicle.images.length;
  renderLightbox();
}

function lightboxGoTo(i) {
  currentIndex = i;
  renderLightbox();
}

function renderLightbox() {
  if (!currentVehicle) return;
  document.getElementById("lightboxTitle").textContent = currentVehicle.name;
  document.getElementById("lightboxTagline").textContent = currentVehicle.tagline;
  document.getElementById("lightboxImage").src = currentVehicle.images[currentIndex];
  document.getElementById("lightboxCounter").textContent =
    (currentIndex + 1) + " / " + currentVehicle.images.length;

  const thumbsWrap = document.getElementById("lightboxThumbs");
  thumbsWrap.innerHTML = currentVehicle.images.map((src, i) => `
    <img src="${src}" class="${i === currentIndex ? 'active' : ''}" onclick="lightboxGoTo(${i})" alt="${currentVehicle.name} photo ${i + 1}">
  `).join("");
}

// Keyboard navigation
document.addEventListener("keydown", function (e) {
  const overlay = document.getElementById("lightboxOverlay");
  if (!overlay || !overlay.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") lightboxNext();
  if (e.key === "ArrowLeft") lightboxPrev();
});

// Click outside the image box closes the lightbox
document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("lightboxOverlay");
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });
  }
  renderFleetGalleryGrid();
});

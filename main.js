document.addEventListener("DOMContentLoaded", () => {
  const plusBtn = document.getElementById("plus-btn");
  const passwordBtn = document.getElementById("password-btn");
  const container = document.getElementById("pin-container");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("close-modal");
  const addForm = document.getElementById("add-pin-form");
  const pinType = document.getElementById("pin-type");
  const pinURL = document.getElementById("pin-url");
  const pinText = document.getElementById("pin-text");
  const searchInput = document.getElementById("search-input");
  const fullscreen = document.getElementById("fullscreen");
  const fullscreenContent = document.getElementById("fullscreen-content");
  const backBtn = document.getElementById("back-btn");

  // Modal open/close
  plusBtn.addEventListener("click", () => modal.style.display = "block");
  closeModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => { if(e.target == modal) modal.style.display = "none"; });

  // Show/hide URL vs Text input based on type
  pinType.addEventListener("change", () => {
    if(pinType.value === "text"){
      pinURL.style.display = "none";
      pinText.style.display = "block";
    } else {
      pinURL.style.display = "block";
      pinText.style.display = "none";
    }
  });

  // Submit new pin
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("pin-title").value;
    const type = pinType.value;
    const url = pinURL.value;
    const text = pinText.value;

    const id = Date.now();
    let requests = JSON.parse(localStorage.getItem("pinRequests") || "[]");
    requests.push({ id, title, type, url, text, approved: false });
    localStorage.setItem("pinRequests", JSON.stringify(requests));

    alert("Pin request sent for approval!");
    addForm.reset();
    pinURL.style.display = "block";
    pinText.style.display = "none";
    modal.style.display = "none";
  });

  // Owner check
  passwordBtn.addEventListener("click", () => {
    const pin = prompt("Enter owner PIN:");
    if(pin === "PFUDOR") window.location.href = "owner.html";
    else alert("WRONG PIN!");
  });

  // Load pins
  function loadPins() {
    container.innerHTML = "";
    const pins = JSON.parse(localStorage.getItem("pinRequests") || "[]").filter(p => p.approved);

    const query = searchInput.value.toLowerCase();

    pins.forEach(p => {
      if(query && !p.title.toLowerCase().includes(query) && !(p.text && p.text.toLowerCase().includes(query))) return;

      const div = document.createElement("div");
      div.className = "pin";

      if(p.type === "image"){
        div.innerHTML = `<img src="${p.url}" alt="${p.title}"><p>${p.title}</p>`;
      } else if(p.type === "video"){
        const vid = getYouTubeID(p.url);
        if(vid){
          div.innerHTML = `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${vid}" frameborder="0" allowfullscreen></iframe><p>${p.title}</p>`;
        } else {
          div.innerHTML = `<p>Invalid video URL: ${p.title}</p>`;
        }
      } else if(p.type === "text"){
        div.innerHTML = `<h3>${p.title}</h3><p>${p.text}</p>`;
      }

      // Click for fullscreen
      div.addEventListener("click", () => {
        fullscreenContent.innerHTML = "";
        if(p.type === "image"){
          fullscreenContent.innerHTML = `<img src="${p.url}" style="max-width:90%; max-height:80vh;"><p>${p.title}</p>`;
        } else if(p.type === "video"){
          const vid = getYouTubeID(p.url);
          fullscreenContent.innerHTML = `<iframe width="80%" height="400" src="https://www.youtube.com/embed/${vid}" frameborder="0" allowfullscreen></iframe><p>${p.title}</p>`;
        } else if(p.type === "text"){
          fullscreenContent.innerHTML = `<h2>${p.title}</h2><p>${p.text}</p>`;
        }
        fullscreen.style.display = "flex";
      });

      container.appendChild(div);
    });
  }

  // Fullscreen back
  backBtn.addEventListener("click", () => fullscreen.style.display = "none");

  // Search filter
  searchInput.addEventListener("input", loadPins);

  loadPins(); // initial load

  // Listen for changes from owner.html
  window.addEventListener("storage", (e) => {
    if(e.key === "pinRequests") loadPins();
  });

  // Helper
  function getYouTubeID(url){
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length == 11 ? match[1] : null;
  }
});

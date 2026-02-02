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

  const fullscreen = document.getElementById("fullscreen");
  const fullscreenContent = document.getElementById("fullscreen-content");
  const backBtn = document.getElementById("back-btn");

  const searchInput = document.getElementById("search-input");

  // Show/hide text/URL inputs based on type
  pinType.addEventListener("change", () => {
    if(pinType.value === "text"){
      pinURL.style.display = "none";
      pinText.style.display = "block";
    } else {
      pinURL.style.display = "block";
      pinText.style.display = "none";
    }
  });

  // Modal open/close
  plusBtn.addEventListener("click", () => modal.style.display = "block");
  closeModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => { if(e.target == modal) modal.style.display="none"; });

  // Submit new pin
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("pin-title").value;
    const type = pinType.value;
    const url = pinURL.value;
    const text = pinText.value;

    const id = Date.now();
    let requests = JSON.parse(localStorage.getItem("pinRequests") || "[]");
    requests.push({ id, title, type, url, text, approved:false });
    localStorage.setItem("pinRequests", JSON.stringify(requests));

    alert("Pin request sent for approval!");
    addForm.reset();
    modal.style.display = "none";
  });

  // Owner check
  passwordBtn.addEventListener("click", () => {
    const pin = prompt("Enter owner PIN:");
    if(pin === "PFUDOR") window.location.href = "owner.html";
    else alert("WRONG PIN!");
  });

  // Load pins (filtered optional)
  function loadApprovedPins(filter=""){
    container.innerHTML = "";
    const pins = JSON.parse(localStorage.getItem("pinRequests") || "[]")
                  .filter(p => p.approved)
                  .filter(p => p.title.toLowerCase().includes(filter.toLowerCase()) ||
                               (p.text && p.text.toLowerCase().includes(filter.toLowerCase()))
                  );

    pins.forEach((p, idx) => {
      const div = document.createElement("div");
      div.className = "pin";

      if(p.type === "image"){
        div.innerHTML = `<img src="${p.url}" alt="${p.title}"><p>${p.title}</p>`;
      } else if(p.type === "video"){
        const videoId = getYouTubeID(p.url);
        if(videoId){
          div.innerHTML = `<iframe width="100%" height="200"
                          src="https://www.youtube.com/embed/${videoId}"
                          frameborder="0" allowfullscreen></iframe>
                          <p>${p.title}</p>`;
        } else {
          div.innerHTML = `<p>Invalid video URL: ${p.title}</p>`;
        }
      } else if(p.type === "text"){
        div.innerHTML = `<p><strong>${p.title}</strong></p><p>${p.text}</p>`;
      }

      container.appendChild(div);

      // Fullscreen click
      div.addEventListener("click", () => {
        fullscreenContent.innerHTML = "";
        if(p.type === "image"){
          fullscreenContent.innerHTML = `<img src="${p.url}" style="width:100%; border-radius:10px;"><p>${p.title}</p>`;
        } else if(p.type === "video"){
          const videoId = getYouTubeID(p.url);
          fullscreenContent.innerHTML = `<iframe width="100%" height="300" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe><p>${p.title}</p>`;
        } else if(p.type === "text"){
          fullscreenContent.innerHTML = `<p><strong>${p.title}</strong></p><p>${p.text}</p>`;
        }
        fullscreen.style.display = "flex";
      });
    });
  }

  backBtn.addEventListener("click", () => fullscreen.style.display = "none");

  // Search bar functionality
  searchInput.addEventListener("input", () => {
    loadApprovedPins(searchInput.value);
  });

  // Listen for owner changes
  window.addEventListener("storage", (e) => {
    if(e.key === "pinRequests") loadApprovedPins(searchInput.value);
  });

  function getYouTubeID(url){
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
  }

  loadApprovedPins();
});


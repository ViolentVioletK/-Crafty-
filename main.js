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

  // Open modal
  plusBtn.addEventListener("click", () => modal.style.display = "block");

  // Close modal
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

  // Load approved pins
  function loadApprovedPins(){
    container.innerHTML = "";
    const pins = JSON.parse(localStorage.getItem("pinRequests") || "[]").filter(p => p.approved);
    pins.forEach(p => {
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
        div.innerHTML = `<h3>${p.title}</h3><p>${p.text}</p>`;
      }

      container.appendChild(div);
    });
    enableFullscreen();
  }

  // Enable click to fullscreen
  function enableFullscreen(){
    document.querySelectorAll(".pin").forEach(pin => {
      pin.addEventListener("click", () => {
        const idx = Array.from(container.children).indexOf(pin);
        const pins = JSON.parse(localStorage.getItem("pinRequests") || "[]").filter(p => p.approved);
        const p = pins[idx];

        fullscreenContent.innerHTML = "";

        if(p.type === "image"){
          const img = document.createElement("img");
          img.src = p.url;
          img.style.maxWidth = "100%";
          img.style.maxHeight = "80vh";
          fullscreenContent.appendChild(img);
          const title = document.createElement("p");
          title.textContent = p.title;
          fullscreenContent.appendChild(title);
        } else if(p.type === "video"){
          const videoId = getYouTubeID(p.url);
          if(videoId){
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.width = "100%";
            iframe.height = "400";
            iframe.allowFullscreen = true;
            fullscreenContent.appendChild(iframe);
            const title = document.createElement("p");
            title.textContent = p.title;
            fullscreenContent.appendChild(title);
          } else {
            fullscreenContent.textContent = "Invalid video URL";
          }
        } else if(p.type === "text"){
          const title = document.createElement("h2");
          title.textContent = p.title;
          const text = document.createElement("p");
          text.textContent = p.text;
          fullscreenContent.appendChild(title);
          fullscreenContent.appendChild(text);
        }

        fullscreen.style.display = "flex";
      });
    });
  }

  backBtn.addEventListener("click", () => fullscreen.style.display = "none");

  // Listen for changes from owner.html
  window.addEventListener("storage", (e) => {
    if(e.key === "pinRequests") loadApprovedPins();
  });

  // Helper
  function getYouTubeID(url){
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
  }

  loadApprovedPins();
});

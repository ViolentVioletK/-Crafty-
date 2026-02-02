document.addEventListener("DOMContentLoaded", () => {
  const plusBtn = document.getElementById("plus-btn");
  const passwordBtn = document.getElementById("password-btn");
  const container = document.getElementById("pin-container");

  // Modal elements
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("close-modal");
  const addForm = document.getElementById("add-pin-form");

  // Fullscreen elements
  const fullscreen = document.createElement("div");
  fullscreen.id = "fullscreen";
  fullscreen.style.cssText = `
    display:none;
    position:fixed;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    background:rgba(0,0,0,0.9);
    justify-content:center;
    align-items:center;
    flex-direction:column;
    z-index:100;
    overflow:auto;
    color:white;
    text-align:center;
  `;
  const fullscreenContent = document.createElement("div");
  const fullscreenBack = document.createElement("button");
  fullscreenBack.textContent = "Back";
  fullscreenBack.style.cssText = `
    position:fixed;
    top:20px;
    right:20px;
    padding:10px 20px;
    border:none;
    border-radius:10px;
    cursor:pointer;
    background:#FF6FA1;
    color:white;
    font-size:16px;
    z-index:101;
  `;
  fullscreenBack.addEventListener("click", () => {
    fullscreen.style.display = "none";
  });
  fullscreen.appendChild(fullscreenContent);
  fullscreen.appendChild(fullscreenBack);
  document.body.appendChild(fullscreen);

  // Open/close modal
  plusBtn.addEventListener("click", () => modal.style.display = "block");
  closeModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => { if(e.target == modal) modal.style.display="none"; });

  // Submit new pin request
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("pin-title").value;
    const url = document.getElementById("pin-url").value;
    const type = document.getElementById("pin-type").value;
    const textContent = type === "text" ? document.getElementById("pin-url").value : "";
    const id = Date.now(); // unique ID
    let requests = JSON.parse(localStorage.getItem("pinRequests") || "[]");
    requests.push({ id, title, url, type, text: textContent, approved: false });
    localStorage.setItem("pinRequests", JSON.stringify(requests));
    alert("Pin request sent for approval!");
    addForm.reset();
    modal.style.display = "none";
  });

  // Owner PIN check
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
          div.innerHTML = `
            <iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            <p>${p.title}</p>
          `;
        } else {
          div.innerHTML = `<p>Invalid video URL: ${p.title}</p>`;
        }
      } else if(p.type === "text"){
        div.innerHTML = `<h3>${p.title}</h3><p>${p.text}</p>`;
      }

      // Fullscreen click
      div.addEventListener("click", () => {
        fullscreenContent.innerHTML = "";
        if(p.type === "image"){
          fullscreenContent.innerHTML = `<img src="${p.url}" style="max-width:90vw; max-height:80vh; object-fit:contain;"><p>${p.title}</p>`;
        } else if(p.type === "video"){
          const vid = getYouTubeID(p.url);
          fullscreenContent.innerHTML = `
            <div class="video-wrapper">
              <iframe src="https://www.youtube.com/embed/${vid}" frameborder="0" allowfullscreen></iframe>
            </div>
            <p>${p.title}</p>
          `;
        } else if(p.type === "text"){
          fullscreenContent.innerHTML = `<h2>${p.title}</h2><p>${p.text}</p>`;
        }
        fullscreen.style.display = "flex";
      });

      container.appendChild(div);
    });
  }

  loadApprovedPins(); // initial load

  // Listen for localStorage changes (e.g., approval from owner)
  window.addEventListener("storage", (e) => {
    if(e.key === "pinRequests") loadApprovedPins();
  });

  // Helper function to extract YouTube video ID
  function getYouTubeID(url){
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length == 11 ? match[1] : null;
  }
});

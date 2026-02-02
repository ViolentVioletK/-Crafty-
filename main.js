document.addEventListener("DOMContentLoaded", () => {
  const plusBtn = document.getElementById("plus-btn");
  const passwordBtn = document.getElementById("password-btn");
  const container = document.getElementById("pin-container");

  // Modal elements
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("close-modal");
  const addForm = document.getElementById("add-pin-form");

  // Open/close modal
  plusBtn.addEventListener("click", () => modal.style.display = "block");
  closeModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => { if(e.target === modal) modal.style.display="none"; });

  // Submit new pin
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("pin-title").value;
    const url = document.getElementById("pin-url").value;
    const type = document.getElementById("pin-type").value;
    const id = Date.now(); // unique ID

    let requests = JSON.parse(localStorage.getItem("pinRequests") || "[]");
    requests.push({ id, title, url, type, approved: false });
    localStorage.setItem("pinRequests", JSON.stringify(requests));

    alert("Pin request sent for approval!");
    addForm.reset();
    modal.style.display = "none";
    loadApprovedPins();
  });

  // Owner check
  passwordBtn.addEventListener("click", () => {
    const pin = prompt("Enter owner PIN:");
    if(pin === "PFUDOR") window.location.href = "owner.html";
    else alert("WRONG PIN!");
  });

  // Fullscreen elements
  const fullscreen = document.createElement("div");
  fullscreen.id = "fullscreen";
  fullscreen.style.display = "none";
  document.body.appendChild(fullscreen);

  const fullscreenContent = document.createElement("div");
  fullscreenContent.id = "fullscreen-content";
  fullscreenContent.style.display = "flex";
  fullscreenContent.style.flexDirection = "column";
  fullscreenContent.style.alignItems = "center";
  fullscreen.appendChild(fullscreenContent);

  const backBtn = document.createElement("button");
  backBtn.textContent = "BACK";
  backBtn.addEventListener("click", () => fullscreen.style.display = "none");
  fullscreen.appendChild(backBtn);

  // Search bar
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search pins...";
  searchInput.style.width = "80%";
  searchInput.style.margin = "10px auto";
  searchInput.style.padding = "8px";
  searchInput.style.borderRadius = "8px";
  searchInput.style.border = "1px solid #ccc";
  document.body.insertBefore(searchInput, container);

  searchInput.addEventListener("input", () => loadApprovedPins(searchInput.value));

  // Load approved pins
  function loadApprovedPins(filter="") {
    container.innerHTML = "";
    const pins = JSON.parse(localStorage.getItem("pinRequests") || "[]")
                  .filter(p => p.approved && p.title.toLowerCase().includes(filter.toLowerCase()));

    pins.forEach(p => {
      const div = document.createElement("div");
      div.className = "pin";

      if(p.type === "image") {
        div.innerHTML = `<img src="${p.url}" alt="${p.title}"><p>${p.title}</p>`;
        div.addEventListener("click", () => showFullscreen(p));
      } 
      else if(p.type === "video") {
        const videoId = getYouTubeID(p.url);
        if(videoId){
          div.innerHTML = `
            <div class="video-wrapper">
              <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
            <p>${p.title}</p>
          `;
          div.addEventListener("click", () => showFullscreen(p));
        } else {
          div.innerHTML = `<p>Invalid video URL: ${p.title}</p>`;
        }
      } 
      else if(p.type === "text") {
        div.innerHTML = `<h3>${p.title}</h3><p>${p.url}</p>`;
        div.addEventListener("click", () => showFullscreen(p));
      }

      container.appendChild(div);
    });
  }

  // Fullscreen function
  function showFullscreen(pin){
    fullscreenContent.innerHTML = ""; // clear old
    if(pin.type === "image"){
      const img = document.createElement("img");
      img.src = pin.url;
      fullscreenContent.appendChild(img);
    } 
    else if(pin.type === "video"){
      const wrapper = document.createElement("div");
      wrapper.className = "video-wrapper";
      wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${getYouTubeID(pin.url)}" frameborder="0" allowfullscreen></iframe>`;
      fullscreenContent.appendChild(wrapper);
    } 
    else if(pin.type === "text"){
      const title = document.createElement("h2");
      title.textContent = pin.title;
      const content = document.createElement("p");
      content.textContent = pin.url;
      fullscreenContent.appendChild(title);
      fullscreenContent.appendChild(content);
    }
    fullscreen.style.display = "flex";
  }

  // Helper: extract YouTube ID
  function getYouTubeID(url){
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
  }

  loadApprovedPins();

  // Listen for localStorage updates (owner approval)
  window.addEventListener("storage", (e) => {
    if(e.key === "pinRequests") loadApprovedPins();
  });
});

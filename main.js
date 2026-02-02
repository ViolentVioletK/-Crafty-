document.addEventListener("DOMContentLoaded", () => {
  const plusBtn = document.getElementById("plus-btn");
  const passwordBtn = document.getElementById("password-btn");
  const container = document.getElementById("pin-container");

  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("close-modal");
  const addForm = document.getElementById("add-pin-form");

  const pinType = document.getElementById("pin-type");
  const pinUrl = document.getElementById("pin-url");
  const pinText = document.getElementById("pin-text");

  // Open/close modal
  plusBtn.addEventListener("click", () => modal.style.display = "block");
  closeModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => { if(e.target == modal) modal.style.display="none"; });

  // Toggle inputs based on type
  pinType.addEventListener("change", () => {
    if(pinType.value === "text"){
      pinUrl.style.display = "none";
      pinUrl.required = false;
      pinText.style.display = "block";
      pinText.required = true;
    } else {
      pinUrl.style.display = "block";
      pinUrl.required = true;
      pinText.style.display = "none";
      pinText.required = false;
    }
  });

  // Submit new pin request
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const type = pinType.value;
    const title = document.getElementById("pin-title").value;
    const url = type === "text" ? "" : pinUrl.value;
    const textContent = type === "text" ? pinText.value : "";
    const id = Date.now();

    let requests = JSON.parse(localStorage.getItem("pinRequests") || "[]");
    requests.push({ id, title, url, textContent, type, approved: false });
    localStorage.setItem("pinRequests", JSON.stringify(requests));

    alert("Pin request sent for approval!");
    addForm.reset();
    pinUrl.style.display = "block";
    pinText.style.display = "none";
    pinUrl.required = true;
    pinText.required = false;
    modal.style.display = "none";

    loadApprovedPins(); // refresh pins immediately
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
          div.innerHTML = `<iframe width="100%" height="200"
                          src="https://www.youtube.com/embed/${videoId}"
                          frameborder="0" allowfullscreen></iframe>
                          <p>${p.title}</p>`;
        } else {
          div.innerHTML = `<p>Invalid video URL: ${p.title}</p>`;
        }
      } else if(p.type === "text"){
        div.innerHTML = `<h3>${p.title}</h3><p>${p.textContent}</p>`;
      }

      container.appendChild(div);
    });
  }

  // Helper to extract YouTube ID
  function getYouTubeID(url){
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
  }

  loadApprovedPins();

  // Listen for localStorage updates from owner.html
  window.addEventListener("storage", (e) => {
    if(e.key === "pinRequests") loadApprovedPins();
  });
});

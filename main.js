document.addEventListener("DOMContentLoaded", () => {
  const plusBtn = document.getElementById("plus-btn");
  const passwordBtn = document.getElementById("password-btn");
  const container = document.getElementById("pin-container");

  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("close-modal");
  const addForm = document.getElementById("add-pin-form");

  plusBtn.addEventListener("click", () => modal.style.display = "block");
  closeModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => { if(e.target == modal) modal.style.display="none"; });

  // Add new pin request
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
  });

  // Owner check
  passwordBtn.addEventListener("click", () => {
    const pin = prompt("Enter owner PIN:");
    if(pin === "PFUDOR") window.location.href = "owner.html";
    else alert("WRONG PIN!");
  });

  // Load approved pins
  function loadApprovedPins() {
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
            <iframe width="100%" height="200"
                    src="https://www.youtube.com/embed/${videoId}"
                    frameborder="0" allowfullscreen></iframe>
            <p>${p.title}</p>
          `;
        } else {
          div.innerHTML = `<p>Invalid video URL: ${p.title}</p>`;
        }
      }

      container.appendChild(div);
    });
  }

  loadApprovedPins(); // initial load

  // Helper
  function getYouTubeID(url){
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length == 11 ? match[1] : null;
  }
});

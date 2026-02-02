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

  /* ------------------ MODAL ------------------ */
  plusBtn.onclick = () => modal.style.display = "block";
  closeModal.onclick = () => modal.style.display = "none";
  window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

  /* ------------------ TYPE SWITCH ------------------ */
  pinType.addEventListener("change", () => {
    if (pinType.value === "text") {
      pinUrl.style.display = "none";
      pinText.style.display = "block";
      pinUrl.required = false;
      pinText.required = true;
    } else {
      pinUrl.style.display = "block";
      pinText.style.display = "none";
      pinUrl.required = true;
      pinText.required = false;
    }
  });

  /* ------------------ ADD PIN ------------------ */
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newPin = {
      id: Date.now(),
      title: document.getElementById("pin-title").value,
      type: pinType.value,
      url: pinUrl.value,
      text: pinText.value,
      approved: false
    };

    const pins = JSON.parse(localStorage.getItem("pinRequests")) || [];
    pins.push(newPin);
    localStorage.setItem("pinRequests", JSON.stringify(pins));

    alert("Pin sent for approval!");
    addForm.reset();
    pinText.style.display = "none";
    pinUrl.style.display = "block";
    modal.style.display = "none";
  });

  /* ------------------ OWNER ------------------ */
  passwordBtn.onclick = () => {
    const pin = prompt("Enter owner PIN:");
    if (pin === "PFUDOR") window.location.href = "owner.html";
    else alert("WRONG PIN!");
  };

  /* ------------------ LOAD APPROVED PINS ------------------ */
  function loadPins() {
    container.innerHTML = "";
    const pins = JSON.parse(localStorage.getItem("pinRequests")) || [];

    pins.filter(p => p.approved).forEach(p => {
      const div = document.createElement("div");
      div.className = "pin";

      if (p.type === "image") {
        div.innerHTML = `
          <img src="${p.url}" alt="${p.title}">
          <p>${p.title}</p>
        `;
      }

      if (p.type === "video") {
        const id = getYouTubeID(p.url);
        if (id) {
          div.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${id}"
              frameborder="0" allowfullscreen></iframe>
            <p>${p.title}</p>
          `;
        }
      }

      if (p.type === "text") {
        div.innerHTML = `
          <h3>${p.title}</h3>
          <p>${p.text}</p>
        `;
      }

      container.appendChild(div);
    });
  }

  /* ------------------ STORAGE SYNC ------------------ */
  window.addEventListener("storage", (e) => {
    if (e.key === "pinRequests") loadPins();
  });

  loadPins();

  /* ------------------ YOUTUBE HELPER ------------------ */
  function getYouTubeID(url) {
    const match = url.match(/(?:youtu\.be\/|v=)([^&]+)/);
    return match ? match[1] : null;
  }
});

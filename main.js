document.addEventListener("DOMContentLoaded", () => {
  const plusBtn = document.getElementById("plus-btn");
  const passwordBtn = document.getElementById("password-btn");
  const container = document.getElementById("pin-container");

  // Modal elements
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("close-modal");
  const addForm = document.getElementById("add-pin-form");

  // Open modal
  plusBtn.addEventListener("click", () => { modal.style.display = "block"; });

  // Close modal
  closeModal.addEventListener("click", () => { modal.style.display = "none"; });
  window.addEventListener("click", (e) => { if(e.target == modal) modal.style.display="none"; });

  // Submit new pin request
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("pin-title").value;
    const url = document.getElementById("pin-url").value;

    let requests = JSON.parse(localStorage.getItem("pinRequests") || "[]");
    requests.push({ title, url, date: new Date().toLocaleString(), approved: false });
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
  const pins = JSON.parse(localStorage.getItem("pinRequests") || "[]").filter(p => p.approved);
  pins.forEach(p => {
    const div = document.createElement("div");
    div.className = "pin";
    div.innerHTML = `<img src="${p.url}" alt="${p.title}"><p>${p.title}</p>`;
    container.appendChild(div);
  });
});

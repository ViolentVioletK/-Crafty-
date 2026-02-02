document.addEventListener("DOMContentLoaded", () => {
  const requestsDiv = document.getElementById("requests");

  function getRequests() {
    return JSON.parse(localStorage.getItem("pinRequests") || "[]");
  }

  function saveRequests(reqs) {
    localStorage.setItem("pinRequests", JSON.stringify(reqs));
  }

  function renderRequests() {
    const requests = getRequests();
    requestsDiv.innerHTML = "";

    if (requests.length === 0) {
      requestsDiv.textContent = "No pin requests yet!";
      return;
    }

    requests.forEach((r) => {
      const card = document.createElement("div");
      card.className = "request-card";
      card.innerHTML = `
        <p><strong>${r.date}</strong>: ${r.title} (${r.type})</p>
        <div>
          <a href="${r.url}" target="_blank">View</a>
          <button class="approve-btn">Approve</button>
          <button class="reject-btn">Reject</button>
        </div>
      `;
      requestsDiv.appendChild(card);

      // Approve button
      card.querySelector(".approve-btn").addEventListener("click", () => {
        const allRequests = getRequests();
        const idx = allRequests.findIndex(req => req.date === r.date);
        if(idx > -1){
          allRequests[idx].approved = true;
          saveRequests(allRequests);
          renderRequests();
          alert("Pin approved!");
        }
      });

      // Reject button
      card.querySelector(".reject-btn").addEventListener("click", () => {
        const allRequests = getRequests();
        const idx = allRequests.findIndex(req => req.date === r.date);
        if(idx > -1){
          allRequests.splice(idx, 1);
          saveRequests(allRequests);
          renderRequests();
          alert("Pin rejected!");
        }
      });
    });
  }

  renderRequests();
});

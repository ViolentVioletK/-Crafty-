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

    requests.forEach((r, i) => {
      const card = document.createElement("div");
      card.className = "request-card";
      card.innerHTML = `
        <p><strong>${r.date}</strong>: ${r.title}</p>
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
        allRequests[i].approved = true;
        saveRequests(allRequests);
        renderRequests(); // re-render after approval
      });

      // Reject button
      card.querySelector(".reject-btn").addEventListener("click", () => {
        const allRequests = getRequests();
        allRequests.splice(i, 1);
        saveRequests(allRequests);
        renderRequests(); // re-render after rejection
      });
    });
  }

  renderRequests();
});


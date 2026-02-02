document.addEventListener("DOMContentLoaded", () => {
  const requestsDiv = document.getElementById("requests");
  let requests = JSON.parse(localStorage.getItem("pinRequests") || "[]");

  function renderRequests() {
    requestsDiv.innerHTML = "";
    if(requests.length === 0){
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

      card.querySelector(".approve-btn").addEventListener("click", () => {
        requests[i].approved = true;
        localStorage.setItem("pinRequests", JSON.stringify(requests));
        renderRequests();
      });

      card.querySelector(".reject-btn").addEventListener("click", () => {
        requests.splice(i, 1);
        localStorage.setItem("pinRequests", JSON.stringify(requests));
        renderRequests();
      });
    });
  }

  renderRequests();
});

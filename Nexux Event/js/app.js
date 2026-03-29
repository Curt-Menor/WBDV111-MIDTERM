document.addEventListener('DOMContentLoaded', () => {

  // YEAR
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // PARTY MODE
  const partyBtn = document.querySelector('[data-party-toggle]');
  if (partyBtn) {
    partyBtn.onclick = () => {
      document.body.classList.toggle('party');
    };
  }

  // =========================
  // TICKET SYSTEM
  // =========================

  const rows = document.querySelectorAll('[data-ticket-row]');
  const totalEl = document.querySelector('[data-total]');

  function updateTotal() {
    let total = 0;

    rows.forEach(row => {
      const qty = Number(row.querySelector('[data-qty]').value || 0);
      const price = Number(row.dataset.price);
      total += qty * price;
    });

    if (totalEl) totalEl.textContent = "$" + total;
  }

  rows.forEach(row => {
    const minus = row.querySelector('[data-qty-minus]');
    const plus = row.querySelector('[data-qty-plus]');
    const input = row.querySelector('[data-qty]');

    if (!input) return;

    minus.onclick = () => {
      input.value = Math.max(0, Number(input.value) - 1);
      updateTotal();
    };

    plus.onclick = () => {
      input.value = Math.min(10, Number(input.value) + 1);
      updateTotal();
    };
  });

  updateTotal();

  // =========================
  // DISPLAY TICKET
  // =========================

  function displayTicket(data) {
    const section = document.getElementById("ticketSection");

    if (!section) return;

    section.style.display = "block";
    section.classList.add("show");

    document.getElementById("ticketName").innerText = "Name: " + data.name;
    document.getElementById("ticketEvent").innerText = "Event: " + data.event;
    document.getElementById("ticketDate").innerText = "Date: " + data.date;

    const canvas = document.getElementById("qrcode");

    if (canvas && typeof QRCode !== "undefined") {
      QRCode.toCanvas(canvas, JSON.stringify(data), function (error) {
        if (error) {
          console.error("QR ERROR:", error);
        } else {
          console.log("QR generated!");
        }
      });
    } else {
      console.error("QR library not loaded or canvas missing");
    }
  }

  // =========================
  // CHECKOUT
  // =========================

  window.checkout = function () {

    let total = 0;

    rows.forEach(row => {
      const qty = Number(row.querySelector('[data-qty]').value || 0);
      const price = Number(row.dataset.price);
      total += qty * price;
    });

    if (total === 0) {
      alert("Select at least 1 ticket!");
      return;
    }

    const ticketData = {
      name: "Guest User",
      event: "Nexus Event",
      date: new Date().toLocaleString(),
      total: total,
      id: Date.now()
    };

    localStorage.setItem("ticket", JSON.stringify(ticketData));

    displayTicket(ticketData);

    console.log("✅ Checkout working!");
  };

  // =========================
  // LOAD SAVED TICKET
  // =========================

  const saved = localStorage.getItem("ticket");

  if (saved) {
    displayTicket(JSON.parse(saved));
  }

});
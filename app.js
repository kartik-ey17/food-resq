const app = document.querySelector("#app");
const STORAGE_KEY = "foodresq-demo-state-v1";

let route = "home";
let message = "";
let activeLeaderboardTab = "donors";

const demoNow = new Date();
const addMinutes = (minutes) => new Date(demoNow.getTime() + minutes * 60000).toISOString();

const seedState = {
  currentUser: null,
  users: {
    donors: [
      { id: "donor-greenleaf", name: "Mayuri", location: "VIT, Bhopal", mealsRescued: 69, successfulDonations: 8, baseImpact: 94 },
      { id: "donor-campus", name: "AB Dakshin", location: "VIT , Bhopal", mealsRescued: 67, successfulDonations: 7, baseImpact: 88 },
      { id: "donor-event", name: "Bistro", location: "VIT , Bhopal", mealsRescued: 55, successfulDonations: 5, baseImpact: 74 },
      { id: "donor-freshbite", name: "Underbelly", location: "VIT , Bhopal", mealsRescued: 50, successfulDonations: 4, baseImpact: 69 }
    ],
    ngos: [
      { id: "ngo-hope", name: "Hope Foundation", location: "Shyamla Hills, Bhopal" },
      { id: "ngo-annadaan", name: "Annadaan Community Trust", location: "Bittan Market, Bhopal" },
      { id: "ngo-helping", name: "Helping Hands", location: "Kolar Road, Bhopal" }
    ],
    volunteers: [
      { id: "vol-manas solanki", name: "Manas", deliveriesCompleted: 4, mealsDelivered: 67, basePoints: 74 },
      { id: "vol-shriram sharma", name: "Shriram", deliveriesCompleted: 3, mealsDelivered: 69, basePoints: 59 },
      { id: "vol-harshil balwani", name: "Harshil", deliveriesCompleted: 0, mealsDelivered: 0, basePoints: -2 }
    ]
  },
  meals: [
    {
      id: "meal-1",
      donorId: "donor-greenleaf",
      donorName: "Mayuri",
      name: "Veg rice bowls",
      type: "Vegetarian",
      quantity: 40,
      preparedAt: "5:45 PM",
      deadline: addMinutes(95),
      location: "VIT , Bhopal",
      contribution: 0,
      deliveryCost: 50,
      sponsorDelivery: false,
      distance: "2.1 km",
      notes: "Packed in sealed containers.",
      status: "AVAILABLE"
    },
    {
      id: "meal-2",
      donorId: "donor-campus",
      donorName: "AB Dakshin",
      name: "Dal + chapati",
      type: "Vegetarian",
      quantity: 55,
      preparedAt: "6:10 PM",
      deadline: addMinutes(50),
      location: "VIT , Bhopal",
      contribution: 0,
      deliveryCost: 40,
      sponsorDelivery: true,
      distance: "1.4 km",
      notes: "Fresh dinner batch.",
      status: "AVAILABLE"
    },
    {
      id: "meal-3",
      donorId: "donor-event",
      donorName: "Bistro",
      name: "Paneer pulao",
      type: "Vegetarian",
      quantity: 28,
      preparedAt: "6:25 PM",
      deadline: addMinutes(180),
      location: "VIT , Bhopal",
      contribution: 100,
      deliveryCost: 60,
      sponsorDelivery: false,
      distance: "3.7 km",
      notes: "Event surplus, tray-packed.",
      status: "AVAILABLE"
    },
    {
      id: "meal-4",
      donorId: "donor-freshbite",
      donorName: "Underbelly",
      name: "Mixed vegetable curry",
      type: "Vegetarian",
      quantity: 32,
      preparedAt: "5:30 PM",
      deadline: addMinutes(30),
      location: "Arera Colony, Bhopal",
      contribution: 0,
      deliveryCost: 55,
      sponsorDelivery: false,
      distance: "4.2 km",
      notes: "Needs pickup quickly.",
      status: "AVAILABLE"
    }
  ],
  orders: [
    {
      id: "order-seed-1",
      mealId: "meal-seed-verified",
      donorId: "donor-campus",
      ngoId: "ngo-annadaan",
      volunteerId: "vol-shriram sharma",
      status: "VERIFIED",
      quantity: 22,
      createdAt: new Date(demoNow.getTime() - 86400000).toISOString(),
      deliveredAt: new Date(demoNow.getTime() - 82800000).toISOString()
    }
  ],
  reviews: [
    { id: "review-seed-1", orderId: "order-seed-1", donorId: "donor-campus", volunteerId: "vol-priya", quality: 5, quantity: 4, timeliness: 5, comment: "Reliable packing and timely handoff." }
  ]
};

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.users && saved.meals && saved.orders && saved.reviews) return saved;
  } catch (error) {
    console.warn("FoodResQ state reset because saved data was invalid.", error);
  }
  return structuredClone(seedState);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setRoute(nextRoute, nextMessage = "") {
  route = nextRoute;
  message = nextMessage;
  render();
}

function setRole(role) {
  state.currentUser = role;
  saveState();
  setRoute(`${role}-dashboard`, `Entered demo as ${roleLabel(role)}.`);
}

function switchRole() {
  state.currentUser = null;
  saveState();
  setRoute("home", "Choose another role to continue the demo.");
}

function roleLabel(role) {
  return { donor: "Food Donor", ngo: "NGO / Recipient", volunteer: "Volunteer" }[role] || "Guest";
}

function shell(content, title = "") {
  const isLoggedIn = Boolean(state.currentUser);
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <button class="brand" data-route="home" aria-label="FoodResQ home">
          <span class="brand-mark">FR</span>
          <span>FOOD<span>RESQ</span></span>
        </button>
        <nav class="nav-actions" aria-label="Primary navigation">
          <button class="nav-button" data-route="home">Home</button>
          <button class="nav-button" data-route="how">How It Works</button>
          <button class="nav-button" data-route="leaderboard">Leaderboard</button>
          ${isLoggedIn ? `<button class="nav-button" data-route="${state.currentUser}-dashboard">Dashboard</button><button class="nav-button" id="switchRole">Logout / Switch Role</button>` : ""}
        </nav>
      </header>
      <main class="main-area" aria-label="${title}">
        ${message ? `<div class="toast" role="status">${message}</div>` : ""}
        ${content}
      </main>
      <footer class="footer">FoodResQ </footer>
    </div>
  `;

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => setRoute(button.dataset.route));
  });
  document.querySelector("#switchRole")?.addEventListener("click", switchRole);
}

function renderHome() {
  const donorLeaders = getDonorLeaderboard().slice(0, 3);
  shell(`
    <section class="hero">
      <p class="eyebrow">FoodResQ</p>
      <h1>Turn surplus into impact.</h1>
      <p>Connect surplus food with organizations that can put it to use.</p>
    </section>
    <section class="home-grid" aria-label="Choose a role">
      ${roleCard("donor", "Food Donor", "Restaurants, hostels & households", "Enter as Donor", "images/donor.png")}
      ${roleCard("ngo", "NGO / Recipient", "Find surplus food nearby", "Enter as NGO", "images/ngo.png")}
      ${roleCard("volunteer", "Volunteer", "Deliver food and earn community points", "Enter as Volunteer", "images/volunteer.png")}
    </section>
    <section class="leader-preview" aria-label="Leaderboard preview">
      <div class="section-header">
        <div>
          <p class="eyebrow">Monthly Impact Leaders</p>
          <h2 class="section-title">Leaderboard Preview</h2>
        </div>
        <button class="ghost-button" data-route="leaderboard">View all</button>
      </div>
      ${donorLeaders.map((leader) => `
        <div class="leader-row">
          <strong>#${leader.rank}</strong>
          <span>${leader.name}</span>
          <span>${leader.mealsRescued} meals</span>
          <span>${leader.impactScore} score</span>
        </div>
      `).join("")}
    </section>
  `, "Home");

  document.querySelectorAll("[data-enter-role]").forEach((button) => {
    button.addEventListener("click", () => setRole(button.dataset.enterRole));
  });
}

function roleCard(role, heading, copy, button, image) {
  return `
    <article class="role-card">
      <div class="role-art">
        <img src="${image}" alt="${heading}">
      </div>
      <h2>${heading}</h2>
      <p>${copy}</p>
      <div class="form-actions">
        <button class="primary-button" data-enter-role="${role}">${button}</button>
      </div>
    </article>
  `;
}

function renderHowItWorks() {
  shell(`
    <section class="wide-panel process-panel">
      <p class="eyebrow">How It Works</p>
      <h1>DONOR -> NGO -> VOLUNTEER -> DELIVERY -> REVIEW -> IMPACT SCORE</h1>
      <div class="process-grid">
        ${["Food Donor posts surplus food", "NGO claims an available listing", "Volunteer accepts the delivery", "NGO confirms receipt and rates", "Impact scores update"].map((step, index) => `
          <article class="step-card"><strong>${index + 1}</strong><span>${step}</span></article>
        `).join("")}
      </div>
    </section>
  `, "How FoodResQ works");
}

function renderDonorDashboard() {
  const donor = getCurrentDonor();
  const stats = getDonorStats(donor.id);
  const meals = state.meals.filter((meal) => meal.donorId === donor.id).sort(sortByNewest);

  shell(`
    <section class="dashboard">
      <div class="screen-header">
        <div>
          <p class="eyebrow">Food Donor Dashboard</p>
          <h1 class="screen-heading">${donor.name}</h1>
        </div>
        <button class="primary-button" id="focusAdd">+ Add Surplus Food</button>
      </div>

      <section>
        <h2 class="section-title">Impact Overview</h2>
        <div class="stats-grid">
          ${statCard("Meals Rescued", stats.mealsRescued)}
          ${statCard("Successful Donations", stats.successfulDonations)}
          ${statCard("Impact Score", stats.impactScore)}
          ${statCard("Community Rank", `#${stats.rank} in Bhopal`)}
        </div>
      </section>

      <section class="split-dashboard">
        <div>
          <h2 class="section-title">Active Donations</h2>
          <div class="stack">
            ${meals.length ? meals.map(donorMealCard).join("") : emptyState("No donations yet. Add surplus food to start the flow.")}
          </div>
        </div>
        <form class="form-panel" id="addMealForm">
          <h2>+ Add Surplus Food</h2>
          <div class="field-grid two">
            <label>Food name<input id="foodName" required placeholder="Lemon rice"></label>
            <label>Food type<select id="foodType"><option>Vegetarian</option><option>Vegan</option><option>Jain</option><option>Mixed</option><option>Bakery</option></select></label>
            <label>Quantity / portions<input id="quantity" type="number" min="1" required placeholder="40"></label>
            <label>Prepared time<input id="preparedAt" required placeholder="6:15 PM"></label>
            <label>Consume-by / pickup deadline<input id="deadline" type="time" required></label>
            <label>Pickup location<input id="location" required value="${donor.location}"></label>
            <label>Food contribution (₹)<input id="contribution" type="number" min="0" value="0"></label>
            <label>Delivery cost (₹)<input id="deliveryCost" type="number" min="0" value="50"></label>
          </div>
          <label class="check-row"><input id="sponsorDelivery" type="checkbox">Sponsor delivery</label>
          <label>Notes<textarea id="notes" placeholder="Packing, pickup gate, freshness notes"></textarea></label>
          <div class="form-actions">
            <button class="primary-button" type="submit">Post surplus food</button>
          </div>
        </form>
      </section>
    </section>
  `, "Food Donor dashboard");

  document.querySelector("#focusAdd").addEventListener("click", () => document.querySelector("#foodName").focus());
  document.querySelector("#addMealForm").addEventListener("submit", handleAddMeal);
}

function donorMealCard(meal) {
  return `
    <article class="meal-card">
      <div class="card-title-row">
        <h3>${meal.quantity} ${meal.name}</h3>
        ${statusBadge(meal.status)}
      </div>
      <p><strong>${meal.type}</strong> from ${meal.donorName}</p>
      <p>Pickup before ${formatTime(meal.deadline)} | ${meal.location}</p>
      <p>Food contribution: ₹${meal.contribution}</p>
      <p>Delivery: ${meal.sponsorDelivery ? "Sponsored by donor" : `₹${meal.deliveryCost}`}</p>
      ${meal.notes ? `<p>${meal.notes}</p>` : ""}
    </article>
  `;
}

function handleAddMeal(event) {
  event.preventDefault();
  const donor = getCurrentDonor();
  const deadlineValue = document.querySelector("#deadline").value;
  const deadline = nextTimeToday(deadlineValue);
  const meal = {
    id: crypto.randomUUID(),
    donorId: donor.id,
    donorName: donor.name,
    name: cleanValue("#foodName"),
    type: cleanValue("#foodType"),
    quantity: Number(cleanValue("#quantity")),
    preparedAt: cleanValue("#preparedAt"),
    deadline,
    location: cleanValue("#location"),
    contribution: Number(cleanValue("#contribution") || 0),
    deliveryCost: Number(cleanValue("#deliveryCost") || 0),
    sponsorDelivery: document.querySelector("#sponsorDelivery").checked,
    distance: `${(1.2 + Math.random() * 3.6).toFixed(1)} km`,
    notes: cleanValue("#notes"),
    status: "AVAILABLE",
    createdAt: new Date().toISOString()
  };
  state.meals.unshift(meal);
  saveState();
  setRoute("donor-dashboard", "Surplus food posted. NGOs can now see this listing.");
}

function renderNgoDashboard() {
  const available = state.meals.filter((meal) => meal.status === "AVAILABLE").sort(byUrgency);
  const incoming = getNgoOrders().filter((order) => order.status === "DELIVERED");
  const active = getNgoOrders().filter((order) => order.status !== "VERIFIED" && order.status !== "DELIVERED");

  shell(`
    <section class="dashboard">
      <div class="screen-header">
        <div>
          <p class="eyebrow">NGO / Recipient Dashboard</p>
          <h1 class="screen-heading">Hope Foundation</h1>
        </div>
      </div>

      ${incoming.length ? `
        <section>
          <h2 class="section-title">Incoming Delivery</h2>
          <div class="stack">${incoming.map(incomingDeliveryCard).join("")}</div>
        </section>
      ` : ""}

      ${active.length ? `
        <section>
          <h2 class="section-title">Track Delivery</h2>
          <div class="stack">${active.map(trackingCard).join("")}</div>
        </section>
      ` : ""}

      <section>
        <h2 class="section-title">Available Near You</h2>
        <div class="card-grid">
          ${available.length ? available.map(ngoMealCard).join("") : emptyState("No available surplus food right now. New donor posts will appear here instantly.")}
        </div>
      </section>
    </section>
  `, "NGO dashboard");

  document.querySelectorAll("[data-claim]").forEach((button) => button.addEventListener("click", () => claimMeal(button.dataset.claim)));
  document.querySelectorAll("[data-confirm]").forEach((button) => button.addEventListener("click", () => confirmReceipt(button.dataset.confirm)));
  document.querySelectorAll("[data-review-form]").forEach((form) => form.addEventListener("submit", submitReview));
}

function ngoMealCard(meal) {
  const urgency = getUrgency(meal.deadline);
  return `
    <article class="meal-card food-card">
      <div class="food-thumb">${foodEmoji(meal.name)}</div>
      <div class="card-title-row">
        <h3>${meal.quantity} ${meal.name}</h3>
        <span class="urgency ${urgency.level}">${urgency.label}</span>
      </div>
      <p>${meal.donorName}</p>
      <p>${meal.distance} | Pickup before ${formatTime(meal.deadline)}</p>
      <p>Expires in ${timeRemaining(meal.deadline)}</p>
      <p>₹${meal.contribution} food contribution</p>
      <p>${meal.sponsorDelivery ? "Delivery sponsored by donor" : `₹${meal.deliveryCost} delivery`}</p>
      <div class="form-actions">
        <button class="primary-button" data-claim="${meal.id}">Claim Food</button>
      </div>
    </article>
  `;
}

function claimMeal(mealId) {
  const meal = state.meals.find((item) => item.id === mealId);
  if (!meal || meal.status !== "AVAILABLE") return;
  meal.status = "CLAIMED";
  state.orders.unshift({
    id: crypto.randomUUID(),
    mealId: meal.id,
    donorId: meal.donorId,
    ngoId: "ngo-hope",
    volunteerId: null,
    status: "CLAIMED",
    quantity: meal.quantity,
    createdAt: new Date().toISOString()
  });
  saveState();
  setRoute("ngo-dashboard", "Food claimed. A delivery request is now visible to volunteers.");
}

function trackingCard(order) {
  const meal = getMeal(order.mealId);
  return `
    <article class="meal-card">
      <div class="card-title-row">
        <h3>${meal.name}</h3>
        ${statusBadge(order.status)}
      </div>
      <p>${meal.donorName} -> Hope Foundation</p>
      <p>${order.volunteerId ? `Volunteer: ${getVolunteer(order.volunteerId).name}` : "Waiting for a volunteer to accept"}</p>
      <p>${meal.quantity} meals | Pickup before ${formatTime(meal.deadline)}</p>
    </article>
  `;
}

function incomingDeliveryCard(order) {
  const meal = getMeal(order.mealId);
  return `
    <article class="meal-card">
      <div class="card-title-row">
        <h3>${meal.donorName}</h3>
        ${statusBadge(order.status)}
      </div>
      <p>${meal.quantity} ${meal.name}</p>
      <p>Volunteer: ${getVolunteer(order.volunteerId).name}</p>
      <p>Status: Delivered</p>
      ${order.receiptConfirmed ? reviewForm(order) : `<button class="primary-button" data-confirm="${order.id}">Confirm Receipt</button>`}
    </article>
  `;
}

function confirmReceipt(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  order.receiptConfirmed = true;
  saveState();
  setRoute("ngo-dashboard", "Receipt confirmed. Please rate this delivery.");
}

function reviewForm(order) {
  return `
    <form class="review-panel" data-review-form="${order.id}">
      <h4>Rate This Delivery</h4>
      ${starSelect("Food Quality", "quality")}
      ${starSelect("Quantity Accuracy", "quantity")}
      ${starSelect("Timeliness", "timeliness")}
      <label>Optional comment<textarea name="comment" placeholder="What should the donor or volunteer know?"></textarea></label>
      <button class="primary-button" type="submit">Submit Rating</button>
    </form>
  `;
}

function starSelect(label, name) {
  return `
    <label>${label}
      <select name="${name}">
        <option value="5">5 stars</option>
        <option value="4">4 stars</option>
        <option value="3">3 stars</option>
        <option value="2">2 stars</option>
        <option value="1">1 star</option>
      </select>
    </label>
  `;
}

function submitReview(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const order = state.orders.find((item) => item.id === form.dataset.reviewForm);
  const meal = getMeal(order.mealId);
  state.reviews.push({
    id: crypto.randomUUID(),
    orderId: order.id,
    donorId: order.donorId,
    volunteerId: order.volunteerId,
    quality: Number(form.quality.value),
    quantity: Number(form.quantity.value),
    timeliness: Number(form.timeliness.value),
    comment: form.comment.value.trim()
  });
  order.status = "VERIFIED";
  meal.status = "VERIFIED";
  order.verifiedAt = new Date().toISOString();
  saveState();
  setRoute("leaderboard", "Delivery verified. Impact scores and community points updated.");
}

function renderVolunteerDashboard() {
  const volunteer = getCurrentVolunteer();
  const stats = getVolunteerStats(volunteer.id);
  const openOrders = state.orders.filter((order) => order.status === "CLAIMED");
  const myOrders = state.orders.filter((order) => order.volunteerId === volunteer.id && order.status !== "VERIFIED");

  shell(`
    <section class="dashboard">
      <div class="screen-header">
        <div>
          <p class="eyebrow">Volunteer Dashboard</p>
          <h1 class="screen-heading">${volunteer.name}</h1>
        </div>
      </div>

      <section>
        <h2 class="section-title">My Impact</h2>
        <div class="stats-grid">
          ${statCard("Deliveries Completed", stats.deliveriesCompleted)}
          ${statCard("Meals Delivered", stats.mealsDelivered)}
          ${statCard("Community Points", stats.communityPoints)}
          ${statCard("Community Rank", `#${stats.rank}`)}
        </div>
      </section>

      ${myOrders.length ? `
        <section>
          <h2 class="section-title">My Active Delivery</h2>
          <div class="stack">${myOrders.map(volunteerOrderCard).join("")}</div>
        </section>
      ` : ""}

      <section>
        <h2 class="section-title">Available Deliveries</h2>
        <div class="card-grid">
          ${openOrders.length ? openOrders.map(volunteerOrderCard).join("") : emptyState("No open delivery requests. Claiming food as an NGO will create one here.")}
        </div>
      </section>
    </section>
  `, "Volunteer dashboard");

  document.querySelectorAll("[data-accept]").forEach((button) => button.addEventListener("click", () => updateOrder(button.dataset.accept, "ASSIGNED")));
  document.querySelectorAll("[data-pickup]").forEach((button) => button.addEventListener("click", () => updateOrder(button.dataset.pickup, "PICKED_UP")));
  document.querySelectorAll("[data-deliver]").forEach((button) => button.addEventListener("click", () => updateOrder(button.dataset.deliver, "DELIVERED")));
}

function volunteerOrderCard(order) {
  const meal = getMeal(order.mealId);
  const ngo = getNgo(order.ngoId);
  return `
    <article class="meal-card">
      <div class="route-line">
        <strong>${meal.donorName}</strong>
        <span>-></span>
        <strong>${ngo.name}</strong>
      </div>
      <p>${meal.distance} | ${meal.quantity} meals</p>
      <p>Pickup before ${formatTime(meal.deadline)}</p>
      <p>${meal.sponsorDelivery ? "Delivery sponsored by donor" : `₹${meal.deliveryCost} delivery contribution`}</p>
      <p>${statusBadge(order.status)}</p>
      <div class="form-actions">
        ${volunteerAction(order)}
      </div>
    </article>
  `;
}

function volunteerAction(order) {
  if (order.status === "CLAIMED") return `<button class="primary-button" data-accept="${order.id}">Accept Delivery</button>`;
  if (order.status === "ASSIGNED") return `<button class="secondary-button" data-pickup="${order.id}">Mark Picked Up</button>`;
  if (order.status === "PICKED_UP") return `<button class="secondary-button" data-deliver="${order.id}">Mark Delivered</button>`;
  if (order.status === "DELIVERED") return `<span class="success-text">Delivered - Awaiting NGO Confirmation</span>`;
  return "";
}

function updateOrder(orderId, status) {
  const order = state.orders.find((item) => item.id === orderId);
  const meal = getMeal(order.mealId);
  if (status === "ASSIGNED") order.volunteerId = getCurrentVolunteer().id;
  order.status = status;
  meal.status = status;
  if (status === "DELIVERED") order.deliveredAt = new Date().toISOString();
  saveState();
  setRoute("volunteer-dashboard", status === "DELIVERED" ? "Marked delivered. NGO can now confirm receipt." : `Delivery status updated to ${readableStatus(status)}.`);
}

function renderLeaderboard() {
  const donors = getDonorLeaderboard();
  const volunteers = getVolunteerLeaderboard();
  shell(`
    <section class="dashboard">
      <div class="screen-header">
        <div>
          <p class="eyebrow">Monthly Impact Leaders</p>
          <h1 class="screen-heading">Leaderboard</h1>
        </div>
      </div>
      <div class="tab-row" role="tablist">
        <button class="tab-button ${activeLeaderboardTab === "donors" ? "active" : ""}" data-tab="donors">Top Donors</button>
        <button class="tab-button ${activeLeaderboardTab === "volunteers" ? "active" : ""}" data-tab="volunteers">Top Volunteers</button>
      </div>
      <section class="table-panel">
        ${activeLeaderboardTab === "donors" ? donorTable(donors) : volunteerTable(volunteers)}
      </section>
      <section class="recognition">
        <h2>Impact Recognition</h2>
        <p>Top contributors can receive platform-funded media recognition as part of FoodResQ's impact recognition program.</p>
      </section>
    </section>
  `, "Leaderboard");

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activeLeaderboardTab = button.dataset.tab;
      renderLeaderboard();
    });
  });
}

function donorTable(rows) {
  return `
    <table class="leader-table">
      <thead><tr><th>Rank</th><th>Donor</th><th>Impact Score</th><th>Meals Rescued</th><th>Successful Donations</th></tr></thead>
      <tbody>${rows.map((row) => `<tr><td>${row.rank}</td><td>${row.name}</td><td>${row.impactScore}</td><td>${row.mealsRescued}</td><td>${row.successfulDonations}</td></tr>`).join("")}</tbody>
    </table>
  `;
}

function volunteerTable(rows) {
  return `
    <table class="leader-table">
      <thead><tr><th>Rank</th><th>Volunteer</th><th>Community Points</th><th>Deliveries</th><th>Meals Delivered</th></tr></thead>
      <tbody>${rows.map((row) => `<tr><td>${row.rank}</td><td>${row.name}</td><td>${row.communityPoints}</td><td>${row.deliveriesCompleted}</td><td>${row.mealsDelivered}</td></tr>`).join("")}</tbody>
    </table>
  `;
}

function getCurrentDonor() {
  return state.users.donors[0];
}

function getCurrentVolunteer() {
  return state.users.volunteers[0];
}

function getMeal(id) {
  return state.meals.find((meal) => meal.id === id) || { name: "Archived meal", donorName: "Archived donor", quantity: 0, deadline: new Date().toISOString(), distance: "0 km" };
}

function getNgo(id) {
  return state.users.ngos.find((ngo) => ngo.id === id) || state.users.ngos[0];
}

function getVolunteer(id) {
  return state.users.volunteers.find((volunteer) => volunteer.id === id) || state.users.volunteers[0];
}

function getNgoOrders() {
  return state.orders.filter((order) => order.ngoId === "ngo-hope").sort(sortByNewest);
}

function getDonorStats(donorId) {
  const donor = state.users.donors.find((item) => item.id === donorId);
  const verifiedOrders = state.orders.filter((order) => order.donorId === donorId && order.status === "VERIFIED");
  const newMeals = verifiedOrders.reduce((sum, order) => sum + order.quantity, 0);
  const reviews = state.reviews.filter((review) => review.donorId === donorId);
  const averageRating = averageReview(reviews);
  const mealsRescued = donor.mealsRescued + newMeals;
  const successfulDonations = donor.successfulDonations + verifiedOrders.length;
  const impactScore = Math.round(donor.baseImpact + newMeals * (averageRating / 5));
  const rank = getDonorLeaderboard().find((row) => row.id === donorId)?.rank || 1;
  return { mealsRescued, successfulDonations, impactScore, rank };
}

function getVolunteerStats(volunteerId) {
  const volunteer = state.users.volunteers.find((item) => item.id === volunteerId);
  const verifiedOrders = state.orders.filter((order) => order.volunteerId === volunteerId && order.status === "VERIFIED");
  const mealsDelivered = volunteer.mealsDelivered + verifiedOrders.reduce((sum, order) => sum + order.quantity, 0);
  const deliveriesCompleted = volunteer.deliveriesCompleted + verifiedOrders.length;
  const reviews = state.reviews.filter((review) => review.volunteerId === volunteerId);
  const averageRating = averageReview(reviews);
  const communityPoints = Math.round(volunteer.basePoints + verifiedOrders.length * 10 + averageRating * 2);
  const rank = getVolunteerLeaderboard().find((row) => row.id === volunteerId)?.rank || 1;
  return { deliveriesCompleted, mealsDelivered, communityPoints, rank };
}

function getDonorLeaderboard() {
  return state.users.donors
    .map((donor) => ({ id: donor.id, name: donor.name, ...getDonorStatsRaw(donor.id) }))
    .sort((a, b) => b.impactScore - a.impactScore)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

function getDonorStatsRaw(donorId) {
  const donor = state.users.donors.find((item) => item.id === donorId);
  const verifiedOrders = state.orders.filter((order) => order.donorId === donorId && order.status === "VERIFIED");
  const reviews = state.reviews.filter((review) => review.donorId === donorId);
  const averageRating = averageReview(reviews);
  const mealsRescued = donor.mealsRescued + verifiedOrders.reduce((sum, order) => sum + order.quantity, 0);
  const successfulDonations = donor.successfulDonations + verifiedOrders.length;
  const impactScore = Math.round(donor.baseImpact + (mealsRescued - donor.mealsRescued) * (averageRating / 5));
  return { mealsRescued, successfulDonations, impactScore };
}

function getVolunteerLeaderboard() {
  return state.users.volunteers
    .map((volunteer) => ({ id: volunteer.id, name: volunteer.name, ...getVolunteerStatsRaw(volunteer.id) }))
    .sort((a, b) => b.communityPoints - a.communityPoints)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

function getVolunteerStatsRaw(volunteerId) {
  const volunteer = state.users.volunteers.find((item) => item.id === volunteerId);
  const verifiedOrders = state.orders.filter((order) => order.volunteerId === volunteerId && order.status === "VERIFIED");
  const reviews = state.reviews.filter((review) => review.volunteerId === volunteerId);
  const averageRating = averageReview(reviews);
  return {
    deliveriesCompleted: volunteer.deliveriesCompleted + verifiedOrders.length,
    mealsDelivered: volunteer.mealsDelivered + verifiedOrders.reduce((sum, order) => sum + order.quantity, 0),
    communityPoints: Math.round(volunteer.basePoints + verifiedOrders.length * 10 + averageRating * 2)
  };
}

function averageReview(reviews) {
  if (!reviews.length) return 4;
  const total = reviews.reduce((sum, review) => sum + review.quality + review.quantity + review.timeliness, 0);
  return total / (reviews.length * 3);
}

function statCard(label, value) {
  return `<article class="stat-card"><strong>${value}</strong><span>${label}</span></article>`;
}

function statusBadge(status) {
  return `<span class="status-badge status-${status.toLowerCase()}">${readableStatus(status)}</span>`;
}

function readableStatus(status) {
  return {
    AVAILABLE: "Awaiting NGO",
    CLAIMED: "Claimed",
    ASSIGNED: "Delivery Assigned",
    PICKED_UP: "Picked Up",
    DELIVERED: "Delivered - Awaiting NGO Confirmation",
    VERIFIED: "Verified"
  }[status] || status;
}

function getUrgency(deadline) {
  const minutes = (new Date(deadline) - new Date()) / 60000;
  if (minutes <= 45) return { level: "urgent", label: "Urgent" };
  if (minutes <= 120) return { level: "soon", label: "Ending soon" };
  return { level: "normal", label: "Normal" };
}

function timeRemaining(deadline) {
  const minutes = Math.max(0, Math.round((new Date(deadline) - new Date()) / 60000));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function nextTimeToday(timeValue) {
  const [hours, minutes] = timeValue.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  if (date < new Date()) date.setDate(date.getDate() + 1);
  return date.toISOString();
}

function cleanValue(selector) {
  return document.querySelector(selector).value.trim();
}

function foodEmoji(name) {
  const lower = name.toLowerCase();
  if (lower.includes("rice")) return "🍚";
  if (lower.includes("chapati") || lower.includes("dal")) return "🍛";
  if (lower.includes("pulao")) return "🥘";
  if (lower.includes("curry")) return "🍲";
  return "🥗";
}

function emptyState(text) {
  return `<article class="empty-state">${text}</article>`;
}

function sortByNewest(a, b) {
  return new Date(b.createdAt || b.deadline || 0) - new Date(a.createdAt || a.deadline || 0);
}

function byUrgency(a, b) {
  return new Date(a.deadline) - new Date(b.deadline);
}

function render() {
  const routes = {
    home: renderHome,
    how: renderHowItWorks,
    "donor-dashboard": renderDonorDashboard,
    "ngo-dashboard": renderNgoDashboard,
    "volunteer-dashboard": renderVolunteerDashboard,
    leaderboard: renderLeaderboard
  };
  (routes[route] || renderHome)();
}

render();

const app = document.querySelector("#app");

const credentials = {
  ngo: { username: "ngo_demo", password: "ngo123" },
  restaurant: { username: "rest_demo", password: "rest123" }
};

const meals = [
  {
    id: 1,
    restaurant: "Green Bowl Kitchen",
    item: "Veg rice bowls",
    portions: 38,
    pickup: "Today, 7:30 PM",
    location: "Indiranagar",
    quality: "Fresh, packed"
  },
  {
    id: 2,
    restaurant: "Campus Canteen",
    item: "Chapati and dal",
    portions: 52,
    pickup: "Today, 8:00 PM",
    location: "Koramangala",
    quality: "Warm batch"
  },
  {
    id: 3,
    restaurant: "Event Pantry",
    item: "Paneer pulao",
    portions: 27,
    pickup: "Today, 9:15 PM",
    location: "MG Road",
    quality: "Sealed trays"
  }
];

const restaurantMeals = [
  { item: "Lemon rice", portions: 30, pickup: "7:45 PM" },
  { item: "Mixed veg curry", portions: 18, pickup: "8:15 PM" }
];

const leaderboard = [
  ["1", "Green Bowl Kitchen", "98", "1,240", "18"],
  ["2", "Campus Canteen", "91", "1,040", "14"],
  ["3", "Event Pantry", "87", "860", "11"],
  ["4", "Food Court A", "81", "650", "9"]
];

let route = "home";
let selectedMeal = null;
let bookingStep = "";

function setRoute(nextRoute) {
  route = nextRoute;
  selectedMeal = null;
  bookingStep = "";
  render();
}

function shell(content, title = "") {
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <button class="brand" data-route="home" aria-label="FoodResQ home">
          <span class="brand-mark">FR</span>
          <span>FOOD<span>RESQ</span></span>
        </button>
        <nav class="nav-actions" aria-label="Primary navigation">
          <button class="nav-button" data-route="home">About</button>
          <button class="nav-button" data-route="home">How It Works</button>
          <button class="nav-button" data-route="leaderboard">Leaderboard</button>
        </nav>
      </header>
      <main class="main-area" aria-label="${title}">
        ${content}
      </main>
      <footer class="footer">Copyright C 2029 || All rights reserved</footer>
    </div>
  `;

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => setRoute(button.dataset.route));
  });
}

function renderHome() {
  shell(`
    <section class="home-grid" aria-label="Login options">
      ${roleCard("ngo-login", "NGO's Login", "Find available surplus food nearby.", "NGO")}
      ${roleCard("restaurant-login", "Restaurant Login", "Post safe leftover meals for pickup.", "REST")}
      ${roleCard("delivery-soon", "Delivery partner login", "Volunteer delivery is coming soon.", "RIDE")}
    </section>
    <section class="leader-preview" aria-label="Leaderboard preview">
      <h1 class="section-title">Community Leaderboard</h1>
      ${leaderboard.slice(0, 3).map((row) => `
        <div class="leader-row">
          <strong>#${row[0]}</strong>
          <span>${row[1]}</span>
          <span>${row[3]} meals</span>
          <span>${row[2]} score</span>
        </div>
      `).join("")}
      <div class="form-actions">
        <button class="primary-button" data-route="leaderboard">View leaderboard</button>
      </div>
    </section>
  `, "Home");
}

function roleCard(target, heading, copy, label) {
  return `
    <article class="role-card">
      <div class="role-art" aria-hidden="true"><span class="art-label">${label}</span></div>
      <h2>${heading}</h2>
      <p>${copy}</p>
      <div class="form-actions">
        <button class="primary-button" data-route="${target}">Continue</button>
      </div>
    </article>
  `;
}

function renderNgoLogin() {
  shell(`
    <section class="split-register">
      <aside class="register-aside">
        <h1>NGO Registration</h1>
        <p>Join FoodResQ and help build a world with zero food waste.</p>
        <div class="image-box">NGO partner illustration</div>
        <div class="login-link">
          <p>Already have an account?</p>
          <button class="ghost-button" id="fillNgo">Use placeholder login</button>
        </div>
      </aside>
      <form class="form-panel" id="ngoForm">
        <h1>Register Your NGO</h1>
        <p class="form-note">Use username <strong>ngo_demo</strong> and password <strong>ngo123</strong> to proceed.</p>
        ${ngoSection("1. NGO Information", [
          ["NGO Name", "Food Hope Foundation"], ["Contact Number", "9876543210"], ["Year of Establishment", "2019"],
          ["Official Email ID", "hello@foodhope.org"], ["NGO Type", "Community Kitchen"]
        ])}
        ${ngoSection("2. Verification Details", [
          ["Registration ID", "REG-1024"], ["Tax ID / PAN", "ABCDE1234F"], ["Upload Registration Certificate", "certificate.pdf"]
        ])}
        ${ngoSection("3. Operational Details", [
          ["Address", "12 Market Road"], ["City", "Bengaluru"], ["State", "Karnataka"],
          ["Pin Code", "560001"], ["Preferred Food Type", "Vegetarian"], ["Daily Food Receiving Capacity", "80"]
        ])}
        <div class="form-section">
          <h3>4. Account Security</h3>
          <div class="field-grid">
            <label>Login ID / Username<input id="ngoUser" placeholder="ngo_demo" required></label>
            <label>Password<input id="ngoPass" type="password" placeholder="ngo123" required></label>
            <label>Confirm Password<input type="password" placeholder="ngo123" required></label>
          </div>
        </div>
        <div class="form-section">
          <h3>5. Verification and Consent</h3>
          <label class="check-row"><input type="checkbox" required>I confirm the provided information is accurate.</label>
          <label class="check-row"><input type="checkbox" required>I agree to FoodResQ terms and conditions.</label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit">Proceed</button>
          <span class="message" id="ngoMessage"></span>
        </div>
      </form>
    </section>
  `, "NGO registration");

  document.querySelector("#fillNgo").addEventListener("click", () => {
    document.querySelector("#ngoUser").value = credentials.ngo.username;
    document.querySelector("#ngoPass").value = credentials.ngo.password;
  });

  document.querySelector("#ngoForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const user = document.querySelector("#ngoUser").value.trim();
    const pass = document.querySelector("#ngoPass").value.trim();
    if (user === credentials.ngo.username && pass === credentials.ngo.password) {
      setRoute("ngo-search");
      return;
    }
    document.querySelector("#ngoMessage").textContent = "Use the placeholder NGO credentials to continue.";
  });
}

function ngoSection(title, fields) {
  return `
    <div class="form-section">
      <h3>${title}</h3>
      <div class="field-grid">
        ${fields.map(([label, value]) => `<label>${label}<input placeholder="${value}"></label>`).join("")}
      </div>
    </div>
  `;
}

function renderNgoSearch() {
  shell(`
    <h1 class="screen-heading">NGO's</h1>
    <section class="wide-panel search-hero">
      <div>
        <h1>Available surplus near you</h1>
        <p>Choose a posted meal, confirm pickup, complete mocked payment, and rate the match.</p>
      </div>
      <div class="quote-card">Safe food reaches people faster when restaurants and NGOs coordinate in time.</div>
    </section>
    <section class="card-grid" aria-label="Available meals">
      ${meals.map((meal) => mealCard(meal)).join("")}
    </section>
    <section class="wide-panel booking-flow ${selectedMeal ? "" : "hidden"}" id="bookingPanel"></section>
  `, "NGO search");

  document.querySelectorAll("[data-book]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMeal = meals.find((meal) => meal.id === Number(button.dataset.book));
      bookingStep = "confirm";
      updateBooking();
    });
  });

  if (selectedMeal) updateBooking();
}

function mealCard(meal) {
  return `
    <article class="meal-card">
      <div class="meal-thumb">${meal.item}</div>
      <h3>${meal.restaurant}</h3>
      <p>${meal.portions} portions available</p>
      <p>${meal.pickup} · ${meal.location}</p>
      <p>${meal.quality}</p>
      <div class="form-actions">
        <button class="primary-button" data-book="${meal.id}">Book food</button>
      </div>
    </article>
  `;
}

function updateBooking() {
  const panel = document.querySelector("#bookingPanel");
  if (!panel || !selectedMeal) return;
  panel.classList.remove("hidden");

  if (bookingStep === "confirm") {
    panel.innerHTML = `
      <h2>Confirm pickup</h2>
      <p>${selectedMeal.restaurant} will reserve ${selectedMeal.portions} portions of ${selectedMeal.item}.</p>
      <p>Delivery volunteer assigned: FoodResQ Volunteer 07.</p>
      <button class="secondary-button" id="payNow">Pay delivery partner</button>
    `;
    document.querySelector("#payNow").addEventListener("click", () => {
      bookingStep = "rating";
      updateBooking();
    });
    return;
  }

  panel.innerHTML = `
    <h2>Delivery completed</h2>
    <p>Mock payment received. Please rate the food quality and quantity match.</p>
    <div class="field-grid two">
      <label>Food quality<select><option>Excellent</option><option>Good</option><option>Needs review</option></select></label>
      <label>Quantity match<select><option>Matched listing</option><option>Slightly less</option><option>More than expected</option></select></label>
    </div>
    <div class="form-actions">
      <button class="primary-button" id="finishRating">Submit rating</button>
    </div>
  `;
  document.querySelector("#finishRating").addEventListener("click", () => {
    panel.innerHTML = "<h2>Thank you</h2><p>Your feedback helps keep FoodResQ reliable for the community.</p>";
  });
}

function renderRestaurantLogin() {
  shell(`
    <section class="center-card">
      <form class="form-panel" id="restaurantForm">
        <h1>Restaurant Login</h1>
        <p class="form-note">Welcome back. Use ID <strong>rest_demo</strong> and password <strong>rest123</strong>.</p>
        <label>FSSAI ID / Registration No.<input id="restUser" placeholder="rest_demo" required></label>
        <label>Password<input id="restPass" type="password" placeholder="rest123" required></label>
        <label class="check-row"><input type="checkbox">Remember me</label>
        <div class="form-actions">
          <button class="primary-button" type="submit">Sign in</button>
          <button class="ghost-button" type="button" id="fillRest">Use placeholder</button>
          <span class="message" id="restMessage"></span>
        </div>
      </form>
    </section>
  `, "Restaurant login");

  document.querySelector("#fillRest").addEventListener("click", () => {
    document.querySelector("#restUser").value = credentials.restaurant.username;
    document.querySelector("#restPass").value = credentials.restaurant.password;
  });

  document.querySelector("#restaurantForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const user = document.querySelector("#restUser").value.trim();
    const pass = document.querySelector("#restPass").value.trim();
    if (user === credentials.restaurant.username && pass === credentials.restaurant.password) {
      setRoute("restaurant-workspace");
      return;
    }
    document.querySelector("#restMessage").textContent = "Use the placeholder restaurant credentials to continue.";
  });
}

function renderRestaurantWorkspace() {
  shell(`
    <section class="donor-layout">
      <div class="screen-header">
        <h1 class="screen-heading">Donors</h1>
        <button class="nav-button" data-route="restaurant-analytics">Dashboard -></button>
      </div>
      <section class="wide-panel donor-hero">
        <div>
          <h1>Posted surplus food</h1>
          <p>New NGO bookings will appear here with a mocked delivery partner assignment.</p>
        </div>
        <div class="quote-card">Latest booking: Campus Care NGO · Volunteer 07 assigned.</div>
      </section>
      <section class="meal-workspace">
        <article class="meal-card">
          <h3>Your Meals</h3>
          ${restaurantMeals.map((meal) => `<p>${meal.item}: ${meal.portions} portions · ${meal.pickup}</p>`).join("")}
        </article>
        <div>
          <button class="add-circle" id="showAdd" aria-label="Add meal">+</button>
          <button class="small-button" id="showAddSmall">Add More</button>
        </div>
        <form class="form-panel hidden" id="addMealForm">
          <h2>Add meal</h2>
          <div class="field-grid">
            <label>Food item<input id="newItem" required></label>
            <label>Portions<input id="newPortions" type="number" min="1" required></label>
            <label>Pickup time<input id="newPickup" required></label>
          </div>
          <div class="form-actions">
            <button class="primary-button" type="submit">Post meal</button>
            <span id="mealMessage"></span>
          </div>
        </form>
      </section>
    </section>
  `, "Restaurant donor workspace");

  const showForm = () => document.querySelector("#addMealForm").classList.remove("hidden");
  document.querySelector("#showAdd").addEventListener("click", showForm);
  document.querySelector("#showAddSmall").addEventListener("click", showForm);
  document.querySelector("#addMealForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const item = document.querySelector("#newItem").value.trim();
    const portions = document.querySelector("#newPortions").value.trim();
    const pickup = document.querySelector("#newPickup").value.trim();
    restaurantMeals.push({ item, portions, pickup });
    renderRestaurantWorkspace();
  });
}

function renderAnalytics() {
  shell(`
    <section class="donor-layout">
      <div class="screen-header">
        <h1 class="screen-heading">Donors Dashboard</h1>
        <button class="nav-button" data-route="restaurant-workspace">Back</button>
      </div>
      <section class="wide-panel analytics-hero">
        <h1>Analytics</h1>
        <div class="stats-grid">
          <div class="stat-card"><strong>12</strong>Orders placed</div>
          <div class="stat-card"><strong>410</strong>Meals delivered</div>
          <div class="stat-card"><strong>8</strong>NGOs served</div>
          <div class="stat-card"><strong>96</strong>Community score</div>
        </div>
      </section>
    </section>
  `, "Restaurant analytics");
}

function renderLeaderboard() {
  shell(`
    <h1 class="screen-heading">Leader Board</h1>
    <section class="table-panel">
      <table class="leader-table">
        <thead>
          <tr>
            <th>Ranking</th>
            <th>Restaurant Name</th>
            <th>Community Score</th>
            <th>Meals Delivered</th>
            <th>Distinct NGOs Delivered</th>
          </tr>
        </thead>
        <tbody>
          ${leaderboard.map((row) => `
            <tr>
              <td>${row[0]}</td>
              <td>${row[1]}</td>
              <td>${row[2]}</td>
              <td>${row[3]}</td>
              <td>${row[4]}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `, "Leaderboard");
}

function renderDeliverySoon() {
  shell(`
    <section class="wide-panel soon-panel">
      <div>
        <h1>Delivery Partner</h1>
        <p>This part of FoodResQ is coming soon. For the MVP, delivery assignment is simulated after NGO booking.</p>
        <div class="form-actions">
          <button class="primary-button" data-route="home">Back home</button>
        </div>
      </div>
    </section>
  `, "Delivery partner coming soon");
}

function render() {
  const routes = {
    home: renderHome,
    "ngo-login": renderNgoLogin,
    "ngo-search": renderNgoSearch,
    "restaurant-login": renderRestaurantLogin,
    "restaurant-workspace": renderRestaurantWorkspace,
    "restaurant-analytics": renderAnalytics,
    leaderboard: renderLeaderboard,
    "delivery-soon": renderDeliverySoon
  };
  routes[route]();
}

render();

const fs = require("fs");

// Path to your index.html
const indexFile = "index.html";

// For now, we’ll use sample events.
// Later this will be replaced by your Google Sheet JSON fetch.
const upcomingEvents = [
  {
    eventname: "Trivia Takedown",
    date: "Fri, 12 Sep '25",
    time: "7:00 PM",
    location: "Games Lab HQ",
    link: "#"
  },
  {
    eventname: "Night of Mafia",
    date: "Sat, 20 Sep '25",
    time: "8:00 PM",
    location: "Downtown Arena",
    link: "#"
  }
];

const otherEvents = [
  {
    eventname: "Harry Potter Quiz",
    date: "Sat, 27 Sep '25",
    time: "6:30 PM",
    location: "City Library",
    link: "#"
  },
  {
    eventname: "Game Night Marathon",
    date: "Fri, 3 Oct '25",
    time: "9:00 PM",
    location: "Games Lab Lounge",
    link: "#"
  }
];

// Generate HTML for event cards
function renderCards(events) {
  return events
    .map(
      (ev) => `
    <div class="event-card">
      <h3>${ev.eventname}</h3>
      <p>${ev.date} • ${ev.time}</p>
      <p>${ev.location}</p>
      <a class="button" href="${ev.link}">Book Now</a>
    </div>
  `
    )
    .join("\n");
}

// Read index.html
let html = fs.readFileSync(indexFile, "utf8");

// Replace Upcoming Events placeholder
html = html.replace(
  /<!--EVENTS-->[\s\S]*?<!--END EVENTS-->/,
  `<!--EVENTS-->\n${renderCards(upcomingEvents)}\n<!--END EVENTS-->`
);

// Replace Other Events placeholder
html = html.replace(
  /<!--OTHER-EVENTS-->[\s\S]*?<!--END OTHER-EVENTS-->/,
  `<!--OTHER-EVENTS-->\n${renderCards(otherEvents)}\n<!--END OTHER-EVENTS-->`
);

// Write updated file
fs.writeFileSync(indexFile, html, "utf8");

console.log("✅ Events injected into index.html");

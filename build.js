const fs = require("fs");
const https = require("https");

// Replace this with your real Google Sheets JSON URL
const SHEET_URL = "https://your-sheet-json-link-here";

// Simple fetch function
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(JSON.parse(data)));
    }).on("error", (err) => reject(err));
  });
}

(async () => {
  try {
    // 1. Fetch events from Google Sheets JSON
    const events = await fetchJSON(SHEET_URL);

    // 2. Build event cards
    let cardsHTML = "";
    events.forEach((event) => {
      cardsHTML += `
        <div class="event-card">
          <h3>${event.eventname || "Untitled Event"}</h3>
          <p>${event.date || ""}</p>
          <p>${event.location || ""}</p>
          <a href="${event.link || "#"}" class="book-btn">Book Now</a>
        </div>
      `;
    });

    // 3. Read existing index.html
    let html = fs.readFileSync("index.html", "utf8");

    // 4. Replace placeholder <!--EVENTS-->
    html = html.replace(
      /<!--EVENTS-->[\s\S]*<!--END EVENTS-->/,
      `<!--EVENTS-->\n${cardsHTML}\n<!--END EVENTS-->`
    );

    // 5. Write back to index.html
    fs.writeFileSync("index.html", html);

    console.log("✅ index.html updated with pre-rendered events.");
  } catch (err) {
    console.error("❌ Error building HTML:", err);
    process.exit(1);
  }
})();

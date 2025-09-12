const fs = require('fs');
const fetch = require('node-fetch');  // if using Node 18+, fetch is global
const Papa = require('papaparse');

const templatePath = './index.template.html'; // Your template with placeholders
const outputPath = './index.html';

const upcomingCsv = "https://docs.google.com/spreadsheets/d/e/.../pub?gid=1356004046&single=true&output=csv";
const exploreCsv = "https://docs.google.com/spreadsheets/d/e/.../pub?gid=583837785&single=true&output=csv";

const fallbackImage = "https://via.placeholder.com/800x450?text=Event+Image";

// Clean CSV values
function clean(v) { return (v ?? "").toString().trim().replace(/^"|"$/g, ''); }

function parseEventDate(str) {
  if (!str) return null;
  str = str.trim().replace(/^[A-Za-z]{3},?\s*/, '');
  const parts = str.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+'(\d{2})$/);
  if (!parts) return null;
  const [_, day, monthStr, yearStr] = parts;
  const month = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 }[monthStr];
  if (month === undefined) return null;
  const year = 2000 + parseInt(yearStr, 10);
  return new Date(year, month, parseInt(day, 10));
}

// Generate event card HTML
function generateCard(event) {
  const { name, date, time, locText, locLink, ticket, image, isMobile=false } = event;
  const eventDateObj = parseEventDate(date);
  const dayNum = eventDateObj?.getDate().toString().padStart(2,'0') ?? '';
  const monthShort = eventDateObj?.toLocaleString('en-US', { month: 'short' }) ?? '';

  return `
<article class="card">
  <div class="media">
    <img src="${image || fallbackImage}" alt="${name}" loading="lazy" onerror="this.src='${fallbackImage}'" />
  </div>
  <div class="card-body">
    <h3 class="event-title">${name || 'Untitled Event'}</h3>
    <p class="meta">${date || ''}${(date && time) ? ' | ' : ''}${time || ''}</p>
    ${locText ? `<p class="location"><a href="${locLink || '#'}" target="_blank" rel="noopener noreferrer">${locText}</a></p>` : ''}
  </div>
  ${eventDateObj ? `<div class="card-date"><div class="day">${dayNum}</div><div class="month">${monthShort}</div><div class="time"></div></div>` : ''}
  <div class="card-footer"><a class="book-btn" href="${ticket || '#'}" target="_blank" rel="noopener noreferrer">Book Now</a></div>
</article>`;
}

async function fetchCsv(url) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${url}`);
  const text = await res.text();
  return Papa.parse(text, { skipEmptyLines: true, header: true }).data;
}

async function build() {
  let template = fs.readFileSync(templatePath, 'utf-8');

  // Upcoming Events
  const upcomingRows = await fetchCsv(upcomingCsv);
  const today = new Date(); today.setHours(0,0,0,0);

  const upcomingHtml = upcomingRows
    .filter(r => parseEventDate(r['Date']) >= today)
    .map(r => generateCard({
      name: r['Event Name'],
      date: r['Date'],
      time: r['Time'],
      locText: r['Location'],
      locLink: r['Location Link'],
      ticket: r['Ticket Link'],
      image: r['Image']
    })).join('\n');

  // Explore Events
  const exploreRows = await fetchCsv(exploreCsv);
  const exploreHtml = exploreRows
    .map(r => generateCard({
      name: r['Event'],
      date: r['Date'],
      time: r['Time'],
      locText: r['Location'],
      locLink: r['Page Link'],
      ticket: r['Page Link'],
      image: r['Image Links']
    })).join('\n');

  // Replace placeholders
  template = template.replace('{{UPCOMING_EVENTS}}', upcomingHtml);
  template = template.replace('{{EXPLORE_EVENTS}}', exploreHtml);

  fs.writeFileSync(outputPath, template, 'utf-8');
  console.log('index.html successfully generated.');
}

build().catch(console.error);

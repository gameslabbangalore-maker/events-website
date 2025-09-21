Games Lab — /new preview (Step 1)

What this is
------------
A safe preview of your current homepage + one event page inside /new/ so your live site stays untouched.

Included files
--------------
- /new/index.html                           → your homepage code (unchanged except: home link → /new/, canonical → /new/)
- /new/events/night-of-mafias/index.html    → your event page code (unchanged except: home link → /new/, canonical/og:url → /new/...)

How to install
--------------
1) Copy the 'new' folder into the root of your repo (same level as your existing index.html).
2) Commit & push.
3) Visit https://gameslab.co.in/new/ to see the preview.
   Visit https://gameslab.co.in/new/events/night-of-mafias/ for the event page preview.

Sheets & Zapier
---------------
In Step 1 you DON'T change anything. The pages still read Google Sheets at runtime.

Migration plan (preview)
------------------------
Step 2: We'll add /new/data/*.json and switch the JS to read static JSON (faster, no runtime Sheets fetch).
Step 3: We'll add a GitHub Action that pulls from Trello and writes those JSON files automatically.
Step 4: After verifying, we'll delete the runtime Sheets fetch code and turn off the Zap.

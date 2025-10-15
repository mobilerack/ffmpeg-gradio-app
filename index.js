require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');

const app = express();
const port = process.env.PORT || 3000;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// A Google bejelentkezési URL generálása
app.get('/auth/google', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/drive.readonly'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });
  res.redirect(url);
});

// A bejelentkezés utáni visszahívás kezelése
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  // Itt elmenthetjük a tokeneket egy session-be vagy adatbázisba
  res.redirect('/');
});

// Statikus fájlok kiszolgálása a "public" mappából
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Az alkalmazás a http://localhost:${port} címen fut`);
});
// ... (a fenti kód)

// API végpont a videók listázásához
app.get('/api/videos', async (req, res) => {
  try {
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const response = await drive.files.list({
      q: "mimeType='video/mp4'", // Csak mp4 videókat listázunk
      fields: 'files(id, name)',
    });
    res.json(response.data.files);
  } catch (error) {
    res.status(500).send('Hiba a videók listázása közben.');
  }
});

// API végpont a videó streameléséhez
app.get('/api/video/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Stream létrehozása a Google Drive fájlhoz
    const videoStream = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    videoStream.data.pipe(res);
  } catch (error) {
    res.status(500).send('Hiba a videó streamelése közben.');
  }
});

// ... (a listen metódus)

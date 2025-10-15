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

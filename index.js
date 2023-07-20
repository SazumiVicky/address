const express = require('express');
const app = express();
const fs = require('fs');

const jsonFile = 'ip_addresses.json';

app.get('/ip-addresses', (req, res) => {
  fs.readFile(jsonFile, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read IP addresses file' });
      return;
    }
    try {
      const ipAddresses = JSON.parse(data);
      res.json(ipAddresses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to parse IP addresses data' });
    }
  });
});

app.post('/ip-addresses', express.json(), (req, res) => {
  if (!req.body || !req.body.ip) {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  const ip = req.body.ip.trim();
  fs.readFile(jsonFile, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read IP addresses file' });
      return;
    }
    try {
      const ipAddresses = JSON.parse(data);
      if (ipAddresses.includes(ip)) {
        res.status(400).json({ error: 'IP Address already exists' });
        return;
      }
      ipAddresses.push(ip);
      fs.writeFile(jsonFile, JSON.stringify(ipAddresses, null, 2), 'utf8', (err) => {
        if (err) {
          res.status(500).json({ error: 'Failed to write IP addresses file' });
          return;
        }
        res.json({ success: true });
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to parse IP addresses data' });
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

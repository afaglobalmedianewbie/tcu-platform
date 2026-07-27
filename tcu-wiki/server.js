const express = require('express');
const path = require('path');

const app = express();
const PORT = 3002;

// Serve static files (index.html, README.md, etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Wiki Server running on http://127.0.0.1:${PORT}`);
});

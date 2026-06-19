const http = require('http');

const PORT = 5000;

const server = http.createServer((req, res) => {
  console.log(`${req.method} request to ${req.url}`);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  res.end(JSON.stringify({
    message: "Internship Tracker API is alive",
    status: "success"
  }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
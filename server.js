const express = require('express');
const fs = require('fs');
const path = require('path');
const getSystemInfo = require('./systemInfo');
const logVisitor = require('./logVisitor');
const getLogFile = require('./readLogFile');

const app = express();
const port = 3000;


// Endpoint for system information
app.get('/system-info', (req, res) => {
  res.status(200).json(getSystemInfo());
});

// Endpoint for logging a visit
app.get('/log-visit', (req, res) => {
  const visitorData = `Visitor at ${new Date().toISOString()}`;
  logVisitor(visitorData);
  res.status(200).send('Visit logged');
});

// Endpoint for displaying the log file
app.get('/show-log', (req, res) => {
  const logData = getLogFile();
  res.status(200).send(logData);
});

// Endpoint for serving the student information HTML
app.get('/', (req, res) => {
  const studentInfoPath = path.join(__dirname, 'studentInfo.html');
  fs.readFile(studentInfoPath, (err, data) => {
    if (err) {
      res.status(500).send('Error loading student information');
    } else {
      res.status(200).contentType('text/html').send(data);
    }
  });
});

// Endpoint for serving the user form HTML
app.get('/user-form', (req, res) => {
  const formPath = path.join(__dirname, 'userForm.html');
  fs.readFile(formPath, (err, data) => {
    if (err) {
      res.status(500).send('Error loading form');
    } else {
      res.status(200).contentType('text/html').send(data);
    }
  });
});

// Endpoint for handling form submissions
app.post('/submit-form', (req, res) => {
  const { name, email, message } = req.body;

  const data = `Name: ${name}, Email: ${email}, Message: ${message}\n`;

  fs.appendFile('formSubmissions.txt', data, (err) => {
    if (err) {
      res.status(500).send('Error saving form data');
    } else {
      res.status(200).contentType('text/html').send(`
        <h1>Form submitted successfully!</h1>
        <a href="/user-form">Submit another response</a>
      `);
    }
  });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
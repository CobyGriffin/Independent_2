const express = require('express');
const fs = require('fs');
const path = require('path');
const getSystemInfo = require('./systemInfo');
const logVisitor = require('./logVisitor');
const getLogFile = require('./readLogFile');

const app = express();
const port = 3000;


app.get('/system-info',((req, res) => {
  if (req.url === '/system-info') {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(getSystemInfo()));
  };

  app.get('/user-form',(req, res)=> {
    // Serve the user form HTML
    const formPath = path.join(__dirname, 'userForm.html')
    fs.readFile(formPath, (err, data) => {
      if (err) {
        // If there's an error reading the file, send a 500 status code
        res.writeHead(500);
        res.end('Error loading form');
      } else {
        // If successful, send the HTML content
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
      app.post('/submit-form', (req, res) => {
        const { name, email, message } = req.body;
        const data = `Name: ${name}, Email: ${email}, Message: ${message}\n`;
        
        fs.appendFile('formSubmissions.txt', data, (err) => {
            if (err) {
                res.status(500).send('Error saving form data');
            } else {
                res.status(200).contentType('text/html').send('<h1>Form submitted successfully!</h1><a href="/user-form">Submit another response</a>');
            }
        });
        
        // Process the complete request body
        req.on('end', () => {
          // Parse the form data
          const formData = new URLSearchParams(body);
          const name = formData.get('name');
          const email = formData.get('email');
          const message = formData.get('message');
          
          // Create a string with the form data
          const data = `Name: ${name}, Email: ${email}, Message: ${message}\n`;
          
          // Append the data to a file
          fs.appendFile('formSubmissions.txt', data, (err) => {
            if (err) {
              // If there's an error saving the data, send a 500 status code
              res.writeHead(500);
              res.end('Error saving form data');
            } else {
              // If successful, send a confirmation message
              res.writeHead(200, {'Content-Type': 'text/html'});
              res.end('<h1>Form submitted successfully!</h1><a href="/user-form">Submit another response</a>');
            }
          });
       });
      
  app.get('/log-visit', (req, res)=> {
      const visitorData = `Visitor at ${new Date().toISOString()}`;
      logVisitor(visitorData);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Visit logged');
  }); 
  app.get('/show-log',(req,res)=> {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(getLogFile());
  }); 
  app.get('/', (req, res)=> {
      const studentInfoPath = path.join(__dirname, 'studentInfo.html');
      fs.readFile(studentInfoPath, (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading student information');
    } 
          else {
            res.writeHead(200,{'Content-Type': 'text/html'});
            res.end('data');
    }
  });
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

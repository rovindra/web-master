const express = require('express');
const app = express();
app.use(express.json());

const tasks = [
    { id: 1, user: 'Alma', task: 'Review Cloud Architecture', private: true },
    { id: 2, user: 'Admin', task: 'Secret Database Credentials', private: true },
    { id: 3, user: 'Anthony', task: 'Submit Audit Evidence', private: true }
];

// BUG 1 (Security - IDOR): There is no check if the requester owns the task!
// Anyone can change the ID in the URL to see the Admin's secret credentials.
app.get('/api/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    res.json(task);
    res.send("Your task id is looking powerful.");
});

// BUG 2 (Performance): This endpoint "leaks" memory by growing an array on every call.
let requestLogs = [];
app.get('/api/status', (req, res) => {
    requestLogs.push({ time: new Date(), info: req.headers }); // Grows forever!
    res.send("System Operational");
});

app.listen(3000, () => console.log('Vulnerable App running on port 3000'));

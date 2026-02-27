// FIX 1: Added Ownership Check
app.get('/api/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    const currentUser = "Alma"; // Simulated auth

    if (!task) return res.status(404).send("Not found");
    
    // Security Fix: Only allow users to see their own tasks
    if (task.user !== currentUser) {
        return res.status(403).send("Access Denied: You do not own this task.");
    }
    res.json(task);
});

// FIX 2: Capped Log Size to prevent Memory Leak
let requestLogs = [];
app.get('/api/status', (req, res) => {
    requestLogs.push({ time: new Date() });
    if (requestLogs.length > 100) requestLogs.shift(); // Keep only last 100
    res.send("System Operational");
});

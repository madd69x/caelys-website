const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(bodyParser.json());

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// POST endpoint to register a ticket
app.post('/api/register', (req, res) => {
    try {
        const { name, email, phone, vertical, institution } = req.body;
        
        if (!name || !email || !vertical) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const rawData = fs.readFileSync(DB_FILE);
        const tickets = JSON.parse(rawData);
        
        const newTicket = {
            id: Date.now().toString(),
            name,
            email,
            phone: phone || 'N/A',
            vertical,
            institution: institution || 'N/A',
            timestamp: new Date().toISOString()
        };
        
        tickets.push(newTicket);
        fs.writeFileSync(DB_FILE, JSON.stringify(tickets, null, 2));
        
        res.status(201).json({ success: true, ticket: newTicket });
    } catch (e) {
        console.error('Error saving ticket:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST endpoint for admin login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'madd69x' && password === 'maddy123') {
        res.status(200).json({ success: true, token: 'caelys-secure-token-2027' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// GET endpoint to fetch all tickets (for admin panel)
app.get('/api/tickets', (req, res) => {
    const token = req.headers.authorization;
    if (token !== 'caelys-secure-token-2027') {
        return res.status(401).json({ error: 'Unauthorized access' });
    }
    
    try {
        const rawData = fs.readFileSync(DB_FILE);
        const tickets = JSON.parse(rawData);
        res.status(200).json(tickets);
    } catch (e) {
        console.error('Error reading tickets:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`CAELYS Ticketing Server running on http://localhost:${PORT}`);
});

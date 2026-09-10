const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// 1. GLOBAL MIDDLEWARE (Must be at the very top)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. MONGOOSE DATABASE INITIALIZATION & SCHEMA DEFINITION
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://gelosambrano_db_user:Xkza6fLxrOlTLFWq@cluster0.auzbimk.mongodb.net/portfolio?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("💾 MongoDB Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Connection Failure Error:", err));

// Register the Schema before any routes use it
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

// ==========================================================================
// 3. API DATABASE ROUTES (MUST BE ABOVE STATIC FILES)
// ==========================================================================

// GET: Fetch all messages from the database cluster
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Contact.find();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(messages);
    } catch (error) {
        console.error("Fetch route failure:", error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ success: false, message: "Error fetching data" });
    }
});

// POST: Submit a new contact message form record
app.post('/api/contact', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ success: true, message: "Signal received and logged to database cluster!" });
    } catch (error) {
        console.error("Submission failure:", error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ success: false, message: "Failed to log signal" });
    }
});

// DELETE: Wipe a message record by its unique document ID
app.delete('/api/messages/:id', async (req, res) => {
    try {
        const deletedDoc = await Contact.findByIdAndDelete(req.params.id);
        res.setHeader('Content-Type', 'application/json');
        if (!deletedDoc) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }
        return res.status(200).json({ success: true, message: "Signal successfully destroyed!" });
    } catch (error) {
        console.error("Deletion failure:", error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ success: false, message: "Server error during deletion" });
    }
});

// ==========================================================================
// 4. STATIC FILE SERVING & ROUTING SHORTCUTS (Must be at the bottom)
// ==========================================================================
app.use(express.static(path.join(__dirname)));

// Clean URL routing shortcut for the admin panel
// ❌ CHANGE THIS OLD LINE:
//app.get('*', (req, res) => { ... })

// ✅ TO THIS COMPATIBLE WILDCARD ROUTE LINE:
app.get('/*any', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Fallback wildcard route catches anything else and returns the index page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 5. SERVER LAUNCH ENGINE START
app.listen(PORT, HOST, () => {
    console.log(`🚀 Server executing live at http://${HOST}:${PORT}`);
});

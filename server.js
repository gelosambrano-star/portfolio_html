const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const { rateLimit } = require('express-rate-limit'); // 🛡️ Import security limiter layer

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// ==========================================================================
// 🛡️ 1. FIREWALL & COMPLIANCE MIDDLEWARE LAYER
// ==========================================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global Security Router: Limits users to 100 general page clicks per 15 minutes
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: "Too many requests to server gateway core. Slow down connection streams." }
});
app.use(globalLimiter);

// 🛑 EXPLICIT SUBMISSION RATE LIMITER: Restricts form submission to 5 messages per 15 mins per IP
const contactFormLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window tracker
    limit: 5,                  // Maximum 5 submissions allowed per client
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: "⚠️ Security Override: Excessive packet traffic detected from your IP. Form blocked for 15 minutes to prevent spam flooding." }
});

// ==========================================================================
// 💾 2. MONGOOSE CLUSTER INITIALIZATION
// ==========================================================================
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://gelosambrano_db_user:Xkza6fLxrOlTLFWq@cluster0.auzbimk.mongodb.net/portfolio?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("💾 MongoDB Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Connection Failure Error:", err));

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

// ==========================================================================
// 📊 3. SECURED DATABASE API ENDPOINTS
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

// ==========================================================================
// 📊 FORTIFIED POST ENDPOINT (ACCEPTS ALL FIELD MATRIX VARIATIONS)
// ==========================================================================
app.post('/api/contact', contactFormLimiter, async (req, res) => {
    try {
        // Accepts both the classic format and the updated camelCase tracking format
        const name = req.body.userName || req.body.name;
        const email = req.body.userEmail || req.body.email;
        const message = req.body.userMessage || req.body.message;
        
        // 🔒 Input Sanitization Check
        if (typeof message === 'string' && (message.includes('<script>') || message.includes('</script>'))) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ success: false, message: "Security Block: Malicious script tags detected." });
        }

        // Verify that no required fields are blank before saving to MongoDB Atlas
        if (!name || !email || !message) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ success: false, message: "Validation Failure: Required data fields cannot be blank." });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();
        
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ success: true, message: "Signal received and logged to database cluster!" });
    } catch (error) {
        console.error("Submission failure:", error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ success: false, message: "Failed to log signal to cloud matrix." });
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
// 📂 4. STATIC ASSET MAPS & URL SHORTCUTS
// ==========================================================================
app.use(express.static(path.join(__dirname)));

app.get('/messages', (req, res) => {
    res.sendFile(path.join(__dirname, 'message.html'));
});

app.get('/*any', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 🚀 SERVER ENGINE START
app.listen(PORT, HOST, () => {
    console.log(`🚀 Server executing live at http://${HOST}:${PORT}`);
});

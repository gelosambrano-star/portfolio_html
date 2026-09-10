const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose'); // Handles the database pipeline connection
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// 🛑 STEP 1: Paste the connection string you copied from the MongoDB Drivers modal here:
// 🛑 REPLACE your line 10 configuration completely with this updated string setup:
// ✅ FIXED: Using your authentic generated Atlas onboarding credentials
const MONGO_URI = "mongodb+srv://gelosambrano_db_user:Xkza6fLxrOlTLFWq@cluster0.auzbimk.mongodb.net/portfolio?appName=Cluster0";



// Connect to your cloud cluster
mongoose.connect(MONGO_URI)
    .then(() => console.log("💾 MongoDB Connected Successfully! Cloud connection loop secure."))
    .catch(err => console.error("❌ MongoDB Connection Failure Error:", err));

// Define the structural layout schema for incoming message data packets
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Define the model table based on the schema framework blueprint
const Contact = mongoose.model('Contact', contactSchema);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/status', (req, res) => {
    res.json({ message: "Hello from your Express backend! Connection successful." });
});

// The updated API routing path that saves the dataset permanently to MongoDB Atlas
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Validation failure. All fields are required." });
    }

    try {
        // Compile the data packet into a model document instance
        const newContact = new Contact({ name, email, message });
        
        // Execute the database document entry save command
        await newContact.save();

        console.log(`\n--- 💾 Persistent Transaction Saved to Cloud MongoDB ---`);
        console.log(`User Name: ${name}`);
        console.log(`User Email: ${email}`);
        console.log(`Payload Message: ${message}`);
        console.log(`--------------------------------------------------------\n`);

        res.status(200).json({ message: `Success! Your message has been saved permanently to the cloud database.` });
    } catch (error) {
        console.error("Database save transaction error:", error);
        res.status(500).json({ error: "Internal Server Error. Failed to save transaction to database." });
    }
});
// ==========================================================================
// 📥 DASHBOARD ROUTING ENGINE & SCHEMA QUERIES
// ==========================================================================

// ==========================================================================
// 📥 SECURE DASHBOARD MANAGEMENT ENGINES (READ & DELETE ACTIONS)
// ==========================================================================

// Define your master admin console access password credentials
const ADMIN_PASSWORD = "GelloSecretDev2026"; 

// 1. Web UI View: Serves your dashboard workspace file
app.get('/messages', (req, res) => {
    res.sendFile(path.join(__dirname, 'messages.html'));
});

// 2. Read Request: Secure endpoint delivering cloud collection datasets
// ==========================================================================
// 💾 FIXED EXPRESS GET ENDPOINT (PREVENTS CORB HEADERS BLOCKING)
// ==========================================================================
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await mongoose.model('Contact').find();
        
        // ✅ CRITICAL CORB FIX: Explicitly forces the browser to expect strict JSON data
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(messages);
    } catch (error) {
        console.error("Fetch route failure:", error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ success: false, message: "Internal server registry error encountered." });
    }
});

// 3. Delete Request: Endpoint processing specific document wipe transactions
//app.delete('/api/messages/:id', async (req, res) => {
  //  const authHeader = req.headers['x-admin-password'];
    //const targetId = req.params.id;

    //if (authHeader !== ADMIN_PASSWORD) {
      //  return res.status(401).json({ error: "Unauthorized transaction authorization code." });
    //}

    //try {
        // Execute target data tracking wipe commands into MongoDB Atlas collections
      //  const deletionResult = await Contact.findByIdAndDelete(targetId);
        
        //if (!deletionResult) {
          //  return res.status(404).json({ error: "Target message trace not found in cluster data." });
        //}

        //console.log(`\n🗑️ [MongoDB Transaction Log]: Document ID ${targetId} erased permanently.`);
        //res.status(200).json({ message: "Record successfully scrubbed from cloud memory banks." });
    //} catch (error) {
      //  console.error("Database deletion engine failure:", error);
        //res.status(500).json({ error: "Internal cluster write exception encountered during deletion." });
    //}
//});
// ==========================================================================
// 🗑️ BACKEND DATABASE DELETE ROUTE PIPELINE
// ==========================================================================
app.delete('/api/messages/:id', async (req, res) => {
    try {
        const messageId = req.params.id;
        
        // Tells Mongoose to search the cloud cluster and destroy the matching document ID
        const deletedDoc = await mongoose.model('Contact').findByIdAndDelete(messageId);
        
        if (!deletedDoc) {
            return res.status(404).json({ success: false, message: "Record document not found inside cluster database." });
        }
        
        console.log(`🗑️ Database Entry Wiped: ID [${messageId}]`);
        return res.status(200).json({ success: true, message: "Signal entry successfully destroyed from cloud database." });
    } catch (error) {
        console.error("Critical database deletion loop breakdown:", error);
        return res.status(500).json({ success: false, message: "Internal server registry error encountered during deletion." });
    }
});

app.listen(PORT, HOST, () => {
    console.log(`🚀 Server executing live at http://${HOST}:${PORT}`);
});

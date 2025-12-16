const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// File-based database (JSON file)
const dbFile = path.join(__dirname, 'contacts.json');

// Initialize contacts database file if it doesn't exist
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify([], null, 2));
    console.log('✓ Contacts database initialized');
}

// Google Drive API setup
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

// Scopes for Google Drive access
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

// Token storage file
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Helper function to save tokens
function saveTokens(tokens) {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}

// Helper function to load tokens
function loadTokens() {
    try {
        const tokens = fs.readFileSync(TOKEN_PATH, 'utf8');
        return JSON.parse(tokens);
    } catch (error) {
        return null;
    }
}

// Load existing tokens if available
const existingTokens = loadTokens();
if (existingTokens) {
    oauth2Client.setCredentials(existingTokens);
}

// Helper function to read contacts from file
function readContacts() {
    const data = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(data);
}

// Helper function to write contacts to file
function writeContacts(contacts) {
    fs.writeFileSync(dbFile, JSON.stringify(contacts, null, 2));
}

// Routes

// GET - Serve static files explicitly
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});

// GET - Serve images and videos from EDUTOUR PICS directory
app.get('/EDUTOUR PICS/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'EDUTOUR PICS', filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
        // Set appropriate content type based on file extension
        const ext = path.extname(filename).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg') {
            res.setHeader('Content-Type', 'image/jpeg');
        } else if (ext === '.png') {
            res.setHeader('Content-Type', 'image/png');
        } else if (ext === '.gif') {
            res.setHeader('Content-Type', 'image/gif');
        } else if (ext === '.mp4') {
            res.setHeader('Content-Type', 'video/mp4');
        } else if (ext === '.webm') {
            res.setHeader('Content-Type', 'video/webm');
        } else if (ext === '.ogg') {
            res.setHeader('Content-Type', 'video/ogg');
        }

        res.sendFile(filePath);
    } else {
        res.status(404).json({
            success: false,
            message: 'File not found'
        });
    }
});

// GET - Serve specific static files (wp.jpg, NABS.jpeg)
app.get('/wp.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'wp.jpg'));
});

app.get('/NABS.jpeg', (req, res) => {
    res.sendFile(path.join(__dirname, 'NABS.jpeg'));
});

// GET - Serve main portfolio page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// GET - Handle contact form GET request (returns all contacts)
app.get('/api/contact', async (req, res) => {
    try {
        const contacts = readContacts();
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error('Error retrieving contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving contacts',
            error: error.message
        });
    }
});

// POST - Handle contact form submissions
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate email format
        const emailRegex = /.+\@.+\..+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Create new contact object
        const newContact = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            createdAt: new Date().toISOString()
        };

        // Read existing contacts
        const contacts = readContacts();
        
        // Add new contact
        contacts.push(newContact);
        
        // Write to file
        writeContacts(contacts);

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully!',
            data: newContact
        });

    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message. Please try again later.',
            error: error.message
        });
    }
});

// GET - Retrieve all contacts (admin endpoint)
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = readContacts();
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving contacts',
            error: error.message
        });
    }
});

// GET - Retrieve a specific contact by ID
app.get('/api/contacts/:id', async (req, res) => {
    try {
        const contacts = readContacts();
        const contact = contacts.find(c => c.id === req.params.id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving contact',
            error: error.message
        });
    }
});

// DELETE - Delete a contact
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        const contacts = readContacts();
        const contactIndex = contacts.findIndex(c => c.id === req.params.id);

        if (contactIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        const deletedContact = contacts.splice(contactIndex, 1);
        writeContacts(contacts);

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully',
            data: deletedContact[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting contact',
            error: error.message
        });
    }
});

// Google Drive API Routes

// GET - Initiate Google Drive authentication
app.get('/auth/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    res.redirect(authUrl);
});

// GET - Handle Google Drive authentication callback
app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        saveTokens(tokens);
        console.log('✓ Google Drive authentication successful');
        res.redirect('/?auth=success');
    } catch (error) {
        console.error('Error during Google Drive authentication:', error);
        res.redirect('/?auth=error');
    }
});

// GET - Retrieve Google Drive files
app.get('/api/drive/files', async (req, res) => {
    try {
        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        const response = await drive.files.list({
            pageSize: 10,
            fields: 'files(id, name, webViewLink, mimeType)',
        });

        res.status(200).json({
            success: true,
            files: response.data.files
        });
    } catch (error) {
        console.error('Error retrieving Google Drive files:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving Google Drive files',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server error',
        error: err.message
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Portfolio server running on http://localhost:${PORT}`);
    console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`);
});

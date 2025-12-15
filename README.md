# Portfolio Website with Database - Setup Guide

## Prerequisites
- **Node.js** (v14 or higher) - Download from [nodejs.org](https://nodejs.org)
- **MongoDB** - Either:
  - **Local MongoDB**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
  - **MongoDB Atlas Cloud**: Free cloud database at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

## Installation Steps

### 1. Install Node.js
- Download and install Node.js from [nodejs.org](https://nodejs.org)
- Verify installation by running in PowerShell:
  ```powershell
  node --version
  npm --version
  ```

### 2. Install Dependencies
Navigate to your portfolio folder and run:
```powershell
cd "c:\Users\alexa\Desktop\PORTFOLIOW"
npm install
```

This installs all required packages:
- **Express** - Web server framework
- **Mongoose** - MongoDB database connector
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables
- **Body-parser** - Parse JSON data
- **Nodemon** - Auto-restart server during development

### 3. Setup MongoDB

#### Option A: Local MongoDB
1. Download MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. The default connection string in `.env` is ready: `mongodb://localhost:27017/portfolio`

#### Option B: MongoDB Atlas (Cloud)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `.env` file with your connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio
   ```

### 4. Run the Server
```powershell
npm start
```

Or for development with auto-reload:
```powershell
npm run dev
```

You'll see:
```
✓ MongoDB connected successfully
🚀 Portfolio server running on http://localhost:5000
```

### 5. Access Your Portfolio
Open your browser and go to:
```
http://localhost:5000
```

## Features

### Contact Form Database
- When users submit the contact form, their message is saved to MongoDB
- All submissions include name, email, message, and timestamp

### API Endpoints

#### Submit Contact (POST)
```
POST /api/contact
Body: { "name": "...", "email": "...", "message": "..." }
```

#### Get All Messages (GET)
```
GET /api/contacts
```

#### Get Single Message (GET)
```
GET /api/contacts/:id
```

#### Delete Message (DELETE)
```
DELETE /api/contacts/:id
```

## Testing the Form

1. Start the server: `npm start`
2. Go to `http://localhost:5000`
3. Fill out the contact form
4. Submit - it will save to MongoDB
5. Check MongoDB to verify the data was saved

## Project Structure
```
PORTFOLIOW/
├── index.html          # Main portfolio page
├── styles.css          # Styling
├── script.js           # Frontend JavaScript (updated for database)
├── server.js           # Node.js Express server
├── package.json        # Dependencies
├── .env                # Configuration (MongoDB URI, Port)
└── README.md           # This file
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB service is running
- Check MongoDB URI in `.env` file
- If using Atlas, ensure IP whitelist includes your machine

### Port Already in Use
- Change PORT in `.env` file to another number (e.g., 3000)

### Dependencies Not Installed
- Run: `npm install`
- Make sure you're in the correct directory

## Next Steps
- Customize contact form fields in `index.html`
- Add user authentication for admin panel
- Create dashboard to view submitted messages
- Add email notifications for new submissions
- Deploy to Heroku, Vercel, or other hosting platform

## Contact
For questions or issues, modify the contact information in `index.html`.

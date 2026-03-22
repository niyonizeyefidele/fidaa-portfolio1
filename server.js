const express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static('public')); // serve your front-end files

// Simple login (for demo)
app.get('/login', (req, res) => {
    res.cookie('loggedIn', 'true', { httpOnly: true });
    res.send('Logged in! Now you can upload your profile image.');
});

// Upload profile image (protected)
app.post('/upload-profile-image', (req, res) => {
    // Check if user is logged in
    if(req.cookies.loggedIn !== 'true'){
        return res.status(401).send('Not authorized');
    }

    if (!req.files || !req.files.profileImage) {
        return res.status(400).send('No file uploaded');
    }

    const profileImage = req.files.profileImage;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if(!allowedTypes.includes(profileImage.mimetype)){
        return res.status(400).send('Invalid file type');
    }

    const uploadPath = path.join(__dirname, 'public/uploads', 'profile.jpg');

    profileImage.mv(uploadPath, (err) => {
        if(err) return res.status(500).send(err);
        res.json({ imageUrl: '/uploads/profile.jpg' });
    });
});

// Serve the portfolio front-end
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
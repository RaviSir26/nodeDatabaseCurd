import express from 'express';
import userModel from '../models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Routes
router.post('/register', async (req, res) => {
    try {
        const { username, userpassword, useremail } = req.body;
        let exitUser = await userModel.findOne({ $or: [{ username }, { useremail }] });
        if (exitUser) return res.status(404).json({ message: 'Username and Email already exist.' });

        let newPassword = await bcrypt.hash(userpassword, 10);
        const user = new userModel({ username, useremail, userpassword: newPassword })
        const userSave = await user.save();

        res.json(userSave);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { useremail, userpassword } = req.body;
        const user = await userModel.findOne({ useremail });
        if (!user) return res.status(404).json({ message: 'User Not Found' });

        const userPassword = await bcrypt.compare(userpassword, user.userpassword);
        if (!userPassword) return res.status(404).json({ message: 'Password Not Match' });

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        // res.json({ jwtToken });
        res.json({ jwtToken : token});

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

});

router.get('/logout', (req, res) => {
    res.json({message: "Loggout Successfully"})
});

export default router;

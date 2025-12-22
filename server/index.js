const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const { executeCode } = require("./utils/execute");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("Online Compiler Server is running!");
});

// Authentication Routes
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(400).json({ error: err.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/run", async (req, res) => {
    const { language, code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Empty code body" });
    }

    try {
        const output = await executeCode(language, code);
        res.json({ output });
    } catch (err) {
        console.error("Execution Error:", err);
        // Ensure err is sent as a proper JSON object
        const errorResponse = {
            error: err.error || err.message || "Execution Failed",
            stderr: err.stderr || ""
        };
        res.status(500).json(errorResponse);
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

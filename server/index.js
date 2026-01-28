const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const CodeSnippet = require("./models/CodeSnippet");
const { executeCode } = require("./utils/execute");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Middleware to check auth (does not block, just attaches user if valid)
const checkAuth = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        // Invalid token - just proceed as guest
    }
    next();
};

app.use(checkAuth);

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

        // Save to history if user is logged in
        if (req.user && req.user.userId) {
            try {
                const snippet = new CodeSnippet({
                    user: req.user.userId,
                    code,
                    language,
                    output: typeof output === 'string' ? output : JSON.stringify(output),
                    title: `Run at ${new Date().toLocaleString()}`
                });
                await snippet.save();
            } catch (saveErr) {
                console.error("Failed to save history:", saveErr);
                // Don't fail the execution request if save fails
            }
        }

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

// Save Code Snippet
app.post("/save", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const { code, language, title } = req.body;
        const snippet = new CodeSnippet({
            user: req.user.userId,
            code,
            language,
            title: title || "Untitled"
        });
        await snippet.save();
        res.status(201).json({ message: "Saved successfully", snippet });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User History
app.get("/history", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const history = await CodeSnippet.find({ user: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(20); // Limit to last 20 items
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Specific Snippet
app.get("/history/:id", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const snippet = await CodeSnippet.findOne({ _id: req.params.id, user: req.user.userId });
        if (!snippet) {
            return res.status(404).json({ error: "Snippet not found" });
        }
        res.json(snippet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Profile Stats
app.get("/profile", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const snippetCount = await CodeSnippet.countDocuments({ user: req.user.userId });

        // You could add more stats here, e.g., usage by language

        res.json({
            user,
            stats: {
                totalSnippets: snippetCount,
                joinedAt: user.createdAt
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

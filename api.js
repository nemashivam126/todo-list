const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret_key_for_todo_app'; 

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/todo');
  console.log("db connected..!!!");
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['token'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const todoSchema = new mongoose.Schema({
    Title: String,
    Description: String,
    isComplete: {
        type: Boolean,
        default: false // Default value for new todos
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
const Todo = mongoose.model('Todo', todoSchema);

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res)=> {
    res.send("Hi there");
});

app.get("/todos", authenticateToken, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.userId });
        res.json(todos);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/todos/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findOne({ _id: id, userId: req.user.userId });
        if (!todo) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(todo);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/todos/submit", authenticateToken, async (req, res) => {
    const todo = new Todo({
        Title: req.body.Title,
        Description: req.body.Description,
        userId: req.user.userId // Associate the todo with the logged-in user
    });
    try {
        const doc = await todo.save();
        res.json(doc);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.put('/todos/update/:id', async (req, res) => {
    const { id } = req.params;
    const { Title, Description, isComplete } = req.body;

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(id, {
            Title,
            Description,
            isComplete
        }, { new: true });
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/todos/delete/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;
    try {
        const deletedTask = await Todo.deleteOne({ _id: id, userId: req.user.userId });
        res.json(deletedTask);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/users", async(req, res)=>{
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


app.post("/users/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({ user, token, message: "User registered successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ user, token, message: "Login successful" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`${PORT} connected...!`);
});
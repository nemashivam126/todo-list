const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/todo');
  console.log("db connected..!!!");
}

const todoSchema = new mongoose.Schema({
    Title: String,
    Description: String
});
const Todo = mongoose.model('Todo', todoSchema);

const userSchema = new mongoose.Schema({
    username: String,
    email: String
});
const User = mongoose.model('User', userSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res)=> {
    res.send("Hi there");
});

app.get("/todos", async(req, res)=>{
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.get("/todos/:id", async(req, res)=>{
    const id = req.params.id;
    try {
        const todos = await Todo.find({_id:id});
        if (!todos) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(todos);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.post("/todos/submit", async (req, res)=> {
    const todo = new Todo();
    todo.Title = req.body.Title;
    todo.Description = req.body.Description;
    todo.Password = req.body.Password;
    const doc = await todo.save()
    console.log("Record inserted");
    console.log(doc);
    res.json(doc);
    // res.send("User submission!!");
});

app.put("/todos/update/:id", async(req, res)=>{
    const id = req.params.id;
    const updateData = {
        Title: req.body.Title,
        Description: req.body.Description
    };
    const updatedTodo = await Todo.updateOne({ _id: id }, updateData);
    console.log("Record updated");
    res.json(updatedTodo);
})

app.delete("/todos/delete/:id", async(req, res)=>{   
    const id = req.params.id;
    try {
        const deletedTask = await Todo.deleteOne({_id: id});
        console.log("Record deleted");
        res.json(deletedTask);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

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
    const { username, email } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        const user = new User({ username, email });
        await user.save();
        console.log("User registered");
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/users/login", async (req, res) => {
    const { username, email } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || user.email !== email) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        console.log("User logged in");
        res.json({ message: "Login successful" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`${PORT} connected...!`);
});
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const PORT = process.env.PORT ?? 8000;
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// Get All todos
app.get("/todos/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  try {
    const response = await pool.query(
      "SELECT * FROM todos WHERE user_email=$1",
      [userEmail]
    );
    res.json(response.rows);
  } catch (err) {
    console.log(deleteTodo);
  }
});

// Create todos
app.post("/todos", async (req, res) => {
  try {
    const { user_email, title, progress, date } = req.body;
    const id = uuidv4();
    const newTodo = await pool.query(
      "INSERT INTO todos(id,user_email,title,progress,date) VALUES($1,$2,$3,$4,$5)",
      [id, user_email, title, progress, date]
    );
    res.json(newTodo);
  } catch (err) {
    console.error(err);
  }
});

// Edit todos
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;
  try {
    const editTodo = pool.query(
      "UPDATE todos SET user_email=$1, title=$2, progress=$3, date=$4 WHERE id=$5",
      [user_email, title, progress, date, id]
    );
    res.json(editTodo);
  } catch (err) {
    console.error(err);
  }
});

// delete todos
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTodo = await pool.query("DELETE FROM todos WHERE id=$1", [id]);
    res.json(deleteTodo);
  } catch (err) {
    console.error(err);
  }
});

// signup

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  try {
    const signUp = await pool.query(
      "INSERT INTO users (email, hashed_password) VALUES($1,$2)",
      [email, hashPassword]
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    res.json({ email, token });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

// login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const users = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (!users.rows.length) {
      res.json({ detail: "User does not exit!" });
    }
    const success = await bcrypt.compare(
      password,
      users.rows[0].hashed_password
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    if (success) {
      res.json({ email: users.rows[0].email, token });
    } else {
      res.json({ detail: " Login failed!" });
    }
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} ...`));

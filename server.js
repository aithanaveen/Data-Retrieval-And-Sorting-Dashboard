const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2648",
  database: "dashboard_db",
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
  } else {
    console.log("Connected to MySQL");
  }
});

// Get students with sorting and filtering
app.get("/students", (req, res) => {
  const { sortBy, department } = req.query;

  let query = "SELECT * FROM students";

  if (department) {
    query += ` WHERE department='${department}'`;
  }

  if (sortBy) {
    query += ` ORDER BY ${sortBy}`;
  }

  db.query(query, (err, result) => {
    if (err) res.send(err);
    else res.json(result);
  });
});

// Count per department
app.get("/count", (req, res) => {
  const query =
    "SELECT department, COUNT(*) as total FROM students GROUP BY department";

  db.query(query, (err, result) => {
    if (err) res.send(err);
    else res.json(result);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

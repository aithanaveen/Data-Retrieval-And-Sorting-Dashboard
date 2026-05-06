const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Use a connection pool for better reliability and performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "2648",
  database: process.env.DB_NAME || "dashboard_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL");
    connection.release();
  }
});

// Get students with sorting and filtering
app.get("/students", (req, res) => {
  const { sortBy, department } = req.query;

  let query = "SELECT * FROM students";
  const queryParams = [];

  if (department) {
    query += " WHERE department = ?";
    queryParams.push(department);
  }

  // Prevent SQL injection by validating sortBy against allowed columns
  const allowedSortColumns = ["name", "join_date", "department"];
  if (sortBy && allowedSortColumns.includes(sortBy)) {
    query += ` ORDER BY ${sortBy}`;
  }

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      console.error("Error fetching students:", err.message);
      res.status(500).json({ error: "Failed to fetch students" });
    } else {
      res.json(result);
    }
  });
});

// Count per department
app.get("/count", (req, res) => {
  const query = "SELECT department, COUNT(*) as total FROM students GROUP BY department";

  pool.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching department counts:", err.message);
      res.status(500).json({ error: "Failed to fetch department counts" });
    } else {
      res.json(result);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

//folder for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',  
  database: 'krief',
  password: 'postgres',
  port: 5432,
});

app.use(express.json());

app.post('/upload', upload.single('document'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const result = await pool.query(
      "INSERT INTO documents (filename, status) VALUES ($1, $2) RETURNING id",
      [file.filename, 'uploaded']
    );
    const documentId = result.rows[0].id;

    res.status(201).json({ document_id: documentId });
  } catch (error) {
    console.error('Error in /upload:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT id, status FROM documents WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in /status/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

console.log('Current working directory:', process.cwd());
console.log('Database path:', process.env.DB_PATH);
console.log('Files in current directory:', require('fs').readdirSync('.'));

// Try to create the directory if it doesn't exist
const dbDir = require('path').dirname(process.env.DB_PATH);
try {
  require('fs').mkdirSync(dbDir, { recursive: true });
  console.log('Created database directory:', dbDir);
} catch (err) {
  console.error('Error creating database directory:', err);
}

const dbPath = process.env.DB_PATH || '/app/family_tree.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database at:', dbPath);
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS trees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    userId INTEGER,
    FOREIGN KEY (userId) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    treeId INTEGER,
    name TEXT,
    birthday TEXT,
    placeOfBirth TEXT,
    description TEXT,
    FOREIGN KEY (treeId) REFERENCES trees(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    memberId INTEGER,
    filename TEXT,
    filepath TEXT,
    FOREIGN KEY (memberId) REFERENCES members(id)
  )`);
});

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, 'secret');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
    if (err) return res.status(400).json({ error: 'Email already exists' });
    const token = jwt.sign({ userId: this.lastID }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  });
});

app.get('/me', authenticate, (req, res) => {
  db.get('SELECT email FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

app.get('/trees', (req, res) => {
  db.all('SELECT * FROM trees', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/trees', authenticate, (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO trees (name, userId) VALUES (?, ?)', [name, req.userId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.get('/members', (req, res) => {
  const { treeId } = req.query;
  db.all('SELECT m.*, GROUP_CONCAT(f.id || ":" || f.filename) as files FROM members m LEFT JOIN files f ON m.id = f.memberId WHERE m.treeId = ? GROUP BY m.id', [treeId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const members = rows.map(row => ({
      ...row,
      files: row.files ? row.files.split(',').map(f => {
        const [id, filename] = f.split(':');
        return { id, filename };
      }) : []
    }));
    res.json(members);
  });
});

app.post('/members', authenticate, upload.single('file'), (req, res) => {
  const { name, birthday, placeOfBirth, description, treeId } = req.body;
  db.run('INSERT INTO members (treeId, name, birthday, placeOfBirth, description) VALUES (?, ?, ?, ?, ?)',
    [treeId, name, birthday, placeOfBirth, description], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      const memberId = this.lastID;
      if (req.file) {
        db.run('INSERT INTO files (memberId, filename, filepath) VALUES (?, ?, ?)',
          [memberId, req.file.filename, req.file.path], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: memberId });
          });
      } else {
        res.json({ id: memberId });
      }
    });
});

app.get('/members/:id/files/:fileId', (req, res) => {
  db.get('SELECT filepath, filename FROM files WHERE id = ? AND memberId = ?', [req.params.fileId, req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'File not found' });
    res.download(row.filepath, row.filename);
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/apiKey', (req, res) => {
    res.json({ apiKey: process.env.API_KEY });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    open(`http://localhost:${port}`);
});

import { uploadFile } from './FileService';
import express from 'express';
import multer from 'multer';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = 5000;

app.get('/api', (req, res) => {
  res.send('Hello World');
});


app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await uploadFile(req.file);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('File upload failed');
  }
});

app.listen(port, () => { console.log("Server is running on http://localhost:" + port) });
import { uploadFile } from './FileService.js';
import { uploadFiletoFirebase } from './MessageService.js';
import { db } from './FirebaseAdmin.js';
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
    const resultMetadata = await uploadFile(req.file);
    const { senderId, date, id, chatId } = req.body;
    uploadFiletoFirebase(resultMetadata.url, senderId, date, id, chatId);
    res.send(resultMetadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'File upload failed' });
  }
});


app.listen(port, () => { console.log("Server is running on http://localhost:" + port) });
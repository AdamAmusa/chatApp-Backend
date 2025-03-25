import { uploadFile } from './FileService.js';
import { uploadFiletoFirebase } from './MessageService.js';
import { connectToDeepgram} from './transcription.js';
import { WebSocketServer } from 'ws';
import http from 'http';

import express from 'express';
import multer from 'multer';


const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = 5000;

app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.raw({ type: 'audio/webm', limit: '10mb' })); // Handle raw audio data


app.get('/api', (req, res) => {
  res.send('Hello World');
});



app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const resultMetadata = await uploadFile(req.file);
    const { senderId, id, chatId } = req.body;
    uploadFiletoFirebase(resultMetadata.url, senderId, id, chatId);
    res.send(resultMetadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

//
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
connectToDeepgram(wss);

server.listen(port, () => { console.log("Server is running on http://localhost:" + port) });
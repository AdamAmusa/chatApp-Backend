import { uploadFile } from './FileService.js';
import { uploadImagetoMessages } from './MessageService.js';
import { uploadImagetoProfile } from './MessageService.js';
import { connectToDeepgram} from './transcription.js';
import { WebSocketServer } from 'ws';
import http from 'http';

import express from 'express';
import multer from 'multer';
import { verifyToken } from './FirebaseAdmin.js';


const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.PORT || 5000; 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.raw({ type: 'audio/webm', limit: '10mb' }));


app.get('/api', (req, res) => {
  res.send('Hello World');
});



app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const resultMetadata = await uploadFile(req.file);
    const { senderId, id, chatId } = req.body;
    uploadImagetoMessages(resultMetadata.url, senderId, id, chatId);
    res.send(resultMetadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.post('/api/upload-profile', verifyToken, upload.single('file'), async (req, res) => {
  try {
    console.log(req.file)
    const resultMetadata = await uploadFile(req.file);
    const id = req.body.id;
    console.log(resultMetadata.url)
    uploadImagetoProfile(resultMetadata.url, id);
    res.send(resultMetadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

//
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});


connectToDeepgram(wss);

server.listen(port, '0.0.0.0',
                  () => { console.log("Server is running on http://localhost:" + port) }); 
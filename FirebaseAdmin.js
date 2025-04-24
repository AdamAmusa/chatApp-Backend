import admin from 'firebase-admin';

const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
const serviceAccountJSON = Buffer.from(serviceAccountB64, 'base64').toString('utf8');
const serviceAccount = JSON.parse(serviceAccountJSON);



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const adminAuth = admin.auth();

async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    const token = authHeader.split('Bearer ')[1];
  
    try {
      // Use adminAuth instead of getAuth
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }


export const db = admin.firestore();
export { adminAuth, verifyToken };
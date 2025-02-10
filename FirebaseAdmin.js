import admin from 'firebase-admin';
import serviceAccount from './chat-e48d2-firebase-adminsdk-ft2h1-5efe1bf6d2.json' assert { type: 'json' };


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

export const db = admin.firestore();
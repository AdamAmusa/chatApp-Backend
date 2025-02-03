import { db } from './FirebaseAdmin.js';
import admin from 'firebase-admin';


export const uploadFiletoFirebase = async (url, sender, date, id, chatId) => {
    try {
        const imagesCollectionRef = db.collection('messages').doc(chatId);
        
        await imagesCollectionRef.update({
            images: admin.firestore.FieldValue.arrayUnion({
                date: date,
                id: id,
                image_url: url,
                senderId: sender,
            })
        }),{ merge: true };;
        
              
        console.log('Image metadata successfully added to the images subcollection!');
    } catch (error) {
        console.error('Error adding document to the images subcollection: ', error);
    }
}
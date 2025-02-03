import { doc, setDoc} from 'firebase/firestore';
import { db } from './FirebaseAdmin.js';



export const uploadFiletoFirebase = async (url, sender, date, id, chatId) => {
    try {
        const imagesCollectionRef = db.collection('messages').doc(chatId).collection('images');
        
        await imagesCollectionRef.add({       
            date: date,
            id: id,
            image_url: url,
            senderId: sender,
          }, { merge: true });
              
        console.log('Image metadata successfully added to the images subcollection!');
    } catch (error) {
        console.error('Error adding document to the images subcollection: ', error);
    }
}
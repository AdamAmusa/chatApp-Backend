import { doc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';






export const uploadFiletoFirebase = async (url, sender, date, id, db, chatId) => {
    try {
        const imageDocRef = doc(db, "messages", chatId, "images");
        await setDoc(imageDocRef, {       
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
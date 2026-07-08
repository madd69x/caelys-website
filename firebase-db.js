import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, orderBy, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYtnv4vRJJIxmUbiFgbknsC4ZdjxvG3jI",
  authDomain: "caelys-database.firebaseapp.com",
  projectId: "caelys-database",
  storageBucket: "caelys-database.firebasestorage.app",
  messagingSenderId: "425012210879",
  appId: "1:425012210879:web:ed7e79753b8235a46b2a0a",
  measurementId: "G-PRERH4DR7E"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export function getCollectionName(vertical, type) {
    if (type === 'team') {
        let suffix = 'design';
        if (vertical.includes('Operations')) suffix = 'operations';
        if (vertical.includes('Outreach')) suffix = 'outreach';
        return `team_${suffix}`;
    } else {
        let suffix = 'mun';
        if (vertical.includes('Debate')) suffix = 'debate';
        if (vertical.includes('Climate')) suffix = 'climate';
        return `registrations_${suffix}`;
    }
}

export async function submitRegistration(data) {
  try {
    const colName = getCollectionName(data.vertical, 'delegate');
    const docRef = await addDoc(collection(db, colName), {
      ...data,
      timestamp: serverTimestamp(),
      type: "delegate"
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: e.message };
  }
}

export async function submitTeamApplication(data) {
  try {
    const colName = getCollectionName(data.vertical, 'team');
    const docRef = await addDoc(collection(db, colName), {
      ...data,
      timestamp: serverTimestamp(),
      type: "team"
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: e.message };
  }
}

export async function getCollectionData(collectionName) {
  try {
    const q = query(collection(db, collectionName), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (e) {
    console.error(`Error fetching ${collectionName}: `, e);
    return [];
  }
}

export async function checkEmailExists(email, type, vertical) {
  try {
    const colName = getCollectionName(vertical, type);
    const q = query(collection(db, colName), where("email", "==", email));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (e) {
    console.error("Error checking email: ", e);
    return true; // fail safe
  }
}

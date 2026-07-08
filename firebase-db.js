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
const db = getFirestore(app);

export async function submitRegistration(data) {
  try {
    // Check for duplicates
    const q = query(collection(db, "registrations"), where("email", "==", data.email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { success: false, error: "EMAIL_EXISTS" };
    }

    const docRef = await addDoc(collection(db, "registrations"), {
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
    // Check for duplicates
    const q = query(collection(db, "team_applications"), where("email", "==", data.email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { success: false, error: "EMAIL_EXISTS" };
    }

    const docRef = await addDoc(collection(db, "team_applications"), {
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

export async function getRegistrations() {
  try {
    const q = query(collection(db, "registrations"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    return [];
  }
}

export async function getTeamApplications() {
  try {
    const q = query(collection(db, "team_applications"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    return [];
  }
}


export async function checkEmailExists(email, type) {
  try {
    const collectionName = type === 'delegate' ? "registrations" : "team_applications";
    const q = query(collection(db, collectionName), where("email", "==", email));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (e) {
    console.error("Error checking email: ", e);
    return true; // fail safe
  }
}

import { db } from './firebase-db.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

async function clearDB() {
  console.log('Clearing database...');
  
  const cols = ['registrations', 'team_applications', 'otp_codes'];
  
  for (const c of cols) {
    console.log('Clearing ' + c + '...');
    const snapshot = await getDocs(collection(db, c));
    for (const d of snapshot.docs) {
      await deleteDoc(doc(db, c, d.id));
      console.log('Deleted ' + d.id + ' from ' + c);
    }
  }
  
  console.log('Database cleared completely!');
  process.exit(0);
}

clearDB().catch(console.error);

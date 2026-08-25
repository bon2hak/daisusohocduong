import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const dbId = firebaseConfig.firestoreDatabaseId;

let firestoreDb: ReturnType<typeof getFirestore>;

try {
  firestoreDb = dbId
    ? initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
      }, dbId)
    : initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
      });
} catch {
  firestoreDb = dbId ? getFirestore(app, dbId) : getFirestore(app);
}

export const db = firestoreDb;
export default app;


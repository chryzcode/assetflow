import { db } from "@/lib/firebase";
import {  collection, query, where, getDocs } from "firebase/firestore";




export async function generateUniqueUserId(): Promise<string> {
    let isUnique = false;
    let userId = "";
  
    while (!isUnique) {
      userId = (Math.floor(10000000 + Math.random() * 90000000)).toString(); // Generate 8-digit number
  
      // Check if userId exists in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("id", "==", userId));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        isUnique = true;
      }
    }
  
    return userId;
  }
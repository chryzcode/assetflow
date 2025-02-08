import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import authenticate from "@/middleware/authentication";
import bcrypt from "bcryptjs";


export async function PUT(req: NextRequest) {
  const user = await authenticate(req);
  if (user instanceof NextResponse) return user; // Stop if authentication fails


  const userId = user.id; // This is the ID from the user object
  const { ...userData } = await req.json();


  if (!userId) {
    return NextResponse.json({ error: "User ID not found" }, { status: 400 });
  }

  try {
    // Fetch the correct document ID
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("id", "==", userId)); // Query for user by stored "id"
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the actual Firestore document ID
    const userDoc = snapshot.docs[0]; // Get the first matching document
    const firestoreId = userDoc.id; // Firestore's actual document ID


    //if password is being updated, hash it
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    //dont permit to update id and email
    delete userData.id;
    delete userData.email;

    // Update the document
    const userRef = doc(db, "users", firestoreId);
    await updateDoc(userRef, userData);


    //return the updated user complete object
    const updatedUser = await getDoc(userRef);
    return NextResponse.json({ message: "User updated successfully", user: updatedUser.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import authenticate from "@/middleware/authentication";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  try {
    const user: any = await authenticate(req);

    if ("error" in user) return user; // ✅ If authentication fails, return the response

    const userId = user.id; // ✅ Ensure the user ID is available
    const userData = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    // Query Firestore to get the user's document ID
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("id", "==", userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const firestoreId = userDoc.id;

    // Prevent updating `id` and `email`
    delete userData.id;
    delete userData.email;

    // Hash password if being updated
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Update Firestore document
    const userRef = doc(db, "users", firestoreId);
    await updateDoc(userRef, userData);

    // Fetch updated user data
    const updatedUser = await getDoc(userRef);

    return NextResponse.json({ message: "User updated successfully", user: updatedUser.data() }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

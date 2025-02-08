import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import bcrypt from "bcryptjs";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { token, oldPassword, newPassword } = await req.json();

    // Find user by reset token
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(query(usersRef, where("resetToken", "==", token)));

    if (snapshot.empty) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Check token expiration
    if (user.resetExpires < Date.now()) {
      return NextResponse.json({ message: "Token expired" }, { status: 400 });
    }

    // Check if old password is correct
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Incorrect old password" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password & remove reset token
    await updateDoc(userDoc.ref, {
      password: hashedPassword,
      resetToken: null,
      resetExpires: null,
    });

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

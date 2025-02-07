import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";
import { db } from "@/lib/firebase";
import crypto from "crypto";
import { collection, getDocs, query, where, updateDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Check if user exists
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(query(usersRef, where("email", "==", email)));

    if (snapshot.empty) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 1000 * 60 * 30; // Expires in 30 minutes

    // Update Firestore with reset token
    const userDoc = snapshot.docs[0];
    await updateDoc(userDoc.ref, { resetToken, resetExpires });

    // Send email with reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail(
      email,
      "Password Reset Request",
      `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 30 minutes.</p>`
    );

    return NextResponse.json({ message: "Reset email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

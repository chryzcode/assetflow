import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/lib/mailer";
import { StatusCodes } from "http-status-codes";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: StatusCodes.UNAUTHORIZED });
    }

    const userData = userDoc.data();
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: StatusCodes.UNAUTHORIZED });
    }

    if (!userData.verified) {
      const verifyUrl = `${process.env.FRONTEND_URL}/api/auth/verify?token=${userData.verificationToken}&email=${email}`;
      const htmlContent = `
      <p>Hello ${userData.fullName},</p>
      <p>Thank you for signing up for AssetFlow. Please click the link below to verify your account.</p>
      <p><a href="${verifyUrl}">Verify Account</a></p>
      <p>If you did not sign up for AssetFlow, please ignore this email.</p>
      <p>Best regards,</p>
      <p>The AssetFlow Team</p>
      `;
      try {
        await sendEmail(email, "Verify Your Account", htmlContent);
      } catch {
        return NextResponse.json(
          { error: "Error sending verification email. Please try again later." },
          { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
      }

      return NextResponse.json(
        { error: "Email not verified. A new verification email has been sent." },
        { status: StatusCodes.FORBIDDEN }
      );
    }
    console.log(userData.id);
    const token = jwt.sign({ userId: userData.id, email }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    return NextResponse.json({ message: "Login successful", token, user: userData}, { status: StatusCodes.OK });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

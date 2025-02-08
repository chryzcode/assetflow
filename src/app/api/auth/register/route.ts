import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc} from "firebase/firestore";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/lib/mailer";
import { StatusCodes } from "http-status-codes";
import { generateUniqueUserId } from "@/lib/uniqueId";

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    const userRef = doc(db, "users", email);
    const existingUser = await getDoc(userRef);

    if (existingUser.exists()) {
      return NextResponse.json({ error: "User already exists" }, { status: StatusCodes.CONFLICT });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await generateUniqueUserId(); // Get unique 8-digit ID
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await setDoc(userRef, {
      id: userId,
      email,
      fullName,
      password: hashedPassword,
      walletAddress: null,
      verified: false,
      verificationToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Send Verification Email
    const verifyUrl = `${process.env.FRONTEND_URL}/api/auth/verify?token=${verificationToken}&email=${email}`;
    const htmlContent = `
    <p>Hello ${fullName},</p>
    <p>Thank you for signing up for AssetFlow. Please click the link below to verify your account.</p>
    <p><a href="${verifyUrl}">Verify Account</a></p>
    <p>If you did not sign up for AssetFlow, please ignore this email.</p>
    <p>Best regards,</p>
    <p>The AssetFlow Team</p>
    `;

    await sendEmail(email, "Verify Your Account", htmlContent);

    return NextResponse.json(
      { message: "User registered. Check email for verification." },
      { status: StatusCodes.CREATED }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

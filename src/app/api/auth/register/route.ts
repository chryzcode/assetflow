import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mailer";
import { StatusCodes } from 'http-status-codes';

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    const userRef = doc(db, "users", email);
    const existingUser = await getDoc(userRef);
    if (existingUser.exists()) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Math.floor(10000000 + Math.random() * 90000000).toString();
    const verificationToken = Math.random().toString(36).substring(2, 15);

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
    const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}&email=${email}`;
    await sendEmail(email, "Verify Your Account", `Click here to verify: ${verifyUrl}`);

    return NextResponse.json({ message: "User registered. Check email for verification." }, { status: StatusCodes.CREATED });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}

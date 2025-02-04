import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from 'http-status-codes';

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
      return NextResponse.json({ error: "Email not verified. Check your email." }, { status: StatusCodes.FORBIDDEN }); 
    }

    const token = jwt.sign({ userId: userData.id, email }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    return NextResponse.json({ message: "Login successful", token }, { status: StatusCodes.OK });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}

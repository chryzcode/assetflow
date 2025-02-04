import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { StatusCodes } from 'http-status-codes';

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: StatusCodes.NOT_FOUND });
    }

    const userData = userDoc.data();

    if (userData.verificationToken !== token) {
      return NextResponse.json({ error: "Invalid token" }, { status: StatusCodes.BAD_REQUEST });
    }

    await updateDoc(userRef, { verified: true, verificationToken: null });

    return NextResponse.json({ message: "Account verified successfully" }, { status: StatusCodes.OK });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { StatusCodes } from 'http-status-codes';

export async function GET(req: Request) {
  try {
      const url = new URL(req.url);
      const email = url.searchParams.get('email');
      const token = url.searchParams.get('token');
  
      if (!email || !token) {
        return NextResponse.json(
          { error: "Email and token are required" }, 
          { status: StatusCodes.BAD_REQUEST }
        );
      }
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
  } catch (error: unknown ) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}

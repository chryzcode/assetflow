import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { StatusCodes } from "http-status-codes";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const token = url.searchParams.get("token");

    if (!email || !token) {
      return NextResponse.redirect(new URL("/auth/login?verified=failed", req.url));
    }

    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.redirect(new URL("/auth/login?verified=failed", req.url));
    }

    const userData = userDoc.data();

    if (userData.verificationToken !== token) {
      return NextResponse.redirect(new URL("/auth/login?verified=failed", req.url));
    }

    await updateDoc(userRef, { verified: true, verificationToken: null });

    return NextResponse.redirect(new URL("/auth/login?verified=success", req.url));
  } catch (error: unknown) {
    return NextResponse.redirect(new URL("/auth/login?verified=failed", req.url));
  }
}

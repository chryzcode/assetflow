import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import authenticate from "@/middleware/authentication";

export async function PUT(req: NextRequest) {
  const user = await authenticate(req);
  if (user instanceof NextResponse) return user; // Stop if authentication fails

  const { userId, ...userData } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  if (user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized to update this user" }, { status: 403 });
  }

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, userData);

  return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
}

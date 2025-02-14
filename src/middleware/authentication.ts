import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function authenticate(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication invalid" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    const usersRef = collection(db, "users");
    const snapshot = await getDocs(query(usersRef, where("id", "==", payload.userId)));

    if (snapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (!user.verified) {
      return NextResponse.json({ error: "User not verified" }, { status: 403 });
    }

    // Attach user data to request
    (req as any).user = user;

    return NextResponse.next(); // Allow request to continue
  } catch (error: unknown) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}

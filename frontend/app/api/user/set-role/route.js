import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const VALID_ROLES = new Set(["professor", "student"])

export async function POST(req) {
  try {
    const body = await req.json()
    const incomingRole = typeof body?.role === "string" ? body.role.trim().toLowerCase() : ""

    if (!incomingRole) {
      return NextResponse.json({ error: "role is required" }, { status: 400 })
    }

    if (!VALID_ROLES.has(incomingRole)) {
      return NextResponse.json({ error: "invalid role" }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const client = await clientPromise
    const db = client.db()

    const users = db.collection("users")

    const updateResult = await users.updateOne({ email: session.user.email }, { $set: { role: incomingRole } })

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "user not found" }, { status: 404 })
    }

    const updatedUser = await users.findOne(
      { email: session.user.email },
      { projection: { role: 1, email: 1, name: 1 } }
    )

    return NextResponse.json({
      ok: true,
      updated: updateResult.modifiedCount > 0,
      user: updatedUser,
    })
  } catch (err) {
    console.error("set-role error", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

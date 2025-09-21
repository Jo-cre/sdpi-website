import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Device id is required" },
        { status: 400 }
      );
    }

    const readings = await prisma.device.findMany({
      where: {
        token: token,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!readings || readings.length === 0) {
      return NextResponse.json({ error: "No devices found" }, { status: 404 });
    }

    return NextResponse.json(readings);
  } catch (error) {
    console.error("[ERRO-GET-READINGS]", error);
    return NextResponse.json(
      { error: "Error fetching devices" },
      { status: 500 }
    );
  }
}

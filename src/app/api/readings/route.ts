import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Device token is required" },
        { status: 400 }
      );
    }

    const leituras = await prisma.reading.findMany({
      where: {
        DeviceId: token,
      },
      orderBy: {
        data_hora: "desc",
      },
      include: {
        Device: true,
      },
    });

    return NextResponse.json(leituras);
  } catch (error) {
    console.error("[ERRO-GET-READINGS]", error);
    return NextResponse.json(
      { error: "Error fetching readings" },
      { status: 500 }
    );
  }
}

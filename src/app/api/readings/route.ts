import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Device id is required" },
        { status: 400 }
      );
    }

    const readings = await prisma.reading.findMany({
      where: {
        deviceId: Number(id),
      },
      orderBy: {
        date_time: "desc",
      },
      include: {
        device: true,
      },
    });

    if (!readings || readings.length === 0) {
      return NextResponse.json({ error: "No readings found" }, { status: 404 });
    }

    return NextResponse.json(readings);
  } catch (error) {
    console.error("[ERRO-GET-READINGS]", error);
    return NextResponse.json(
      { error: "Error fetching readings" },
      { status: 500 }
    );
  }
}

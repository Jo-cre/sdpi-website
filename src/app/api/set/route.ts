import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { token, temperature, humidity, address, state, city } = data;

    if (!token || temperature == null || humidity == null) {
      return NextResponse.json(
        { error: "Mandatory fields: token, temperature and humidity." },
        { status: 400 }
      );
    }

    // Tenta encontrar o dispositivo
    let device = await prisma.device.findUnique({
      where: { token },
    });

    // Se o dispositivo não existir, cria um novo
    if (!device) {
      if (!address || !state || !city) {
        return NextResponse.json(
          {
            error:
              "Device not found. Enter address, state, and city to create it.",
          },
          { status: 400 }
        );
      }

      device = await prisma.device.create({
        data: {
          token,
          address,
          state,
          city,
        },
      });
    }

    // Cria a leitura associada
    const leitura = await prisma.reading.create({
      data: {
        DeviceId: device.token,
        temperature,
        humidity,
      },
    });

    return NextResponse.json(
      {
        message: "Reading registered successfully.",
        leitura,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal error when registering reading." },
      { status: 500 }
    );
  }
}

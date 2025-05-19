import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { token, temperature, humidity, address, state, city } = data;

    if (!token || temperature == null || humidity == null) {
      return NextResponse.json(
        { error: "Campos obrigatórios: token, temperatura e umidade." },
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
              "Dispositivo não encontrado. Informe address, state e city para criá-lo.",
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
        message: "Leitura registrada com sucesso.",
        leitura,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro interno ao registrar leitura." },
      { status: 500 }
    );
  }
}

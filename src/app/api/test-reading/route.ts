import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const TEST_DEVICE_TOKEN = "test";
const TEST_DEVICE_ID = 4;

function gerarNumeroAleatorio(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

export async function GET() {
  try {
    // Busca o device pelo token
    let device = await prisma.device.findUnique({
      where: { id: TEST_DEVICE_ID },
    });

    // Cria o device se não existir
    if (!device) {
      device = await prisma.device.create({
        data: {
          token: TEST_DEVICE_TOKEN,
          address: "Rua de Teste 123",
          state: "SP",
          city: "São Paulo",
        },
      });
    }

    // Gera dados aleatórios
    const temperatura = gerarNumeroAleatorio(20, 30);
    const umidade = gerarNumeroAleatorio(40, 70);

    // Cria a leitura usando o id gerado
    const leitura = await prisma.reading.create({
      data: {
        deviceId: device.id,
        temperature: temperatura,
        humidity: umidade,
      },
    });

    return NextResponse.json({
      message: "Random reading successfully registered",
      leitura,
      token: device.token,
    });
  } catch (error) {
    console.error("[ERRO TEST-READING]", error);
    if (error instanceof Error) {
      console.error(error.message);
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

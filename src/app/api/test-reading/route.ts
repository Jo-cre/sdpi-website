import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Token fixo para o dispositivo de teste
const TEST_DEVICE_TOKEN = "aaaaa";

// Função para gerar valores aleatórios com 2 casas decimais
function gerarNumeroAleatorio(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

export async function GET() {
  try {
    // Verifica se o device já existe
    let device = await prisma.device.findUnique({
      where: { token: TEST_DEVICE_TOKEN },
    });

    // Cria o dispositivo se ele não existir
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

    // Cria a leitura
    const leitura = await prisma.reading.create({
      data: {
        DeviceId: TEST_DEVICE_TOKEN,
        temperature: temperatura,
        humidity: umidade,
      },
    });

    return NextResponse.json({
      message: "Random reading successfully registered",
      leitura,
    });
  } catch (error) {
    console.error("[ERRO TEST-READING]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

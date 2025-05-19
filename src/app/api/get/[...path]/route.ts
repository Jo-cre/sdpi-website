// src/app/api/get/[...path]/route.ts
import { NextResponse } from "next/server";

type SensorData = {
  token: string;
  temperature: number;
  humidity: number;
  address: string;
  state: string;
  city: string;
  timestamp: string;
};

const mockDatabase: Record<string, SensorData> = {
  "123": {
    token: "123",
    temperature: 25.5,
    humidity: 60,
    address: "Rua A, 123",
    state: "SP",
    city: "São Paulo",
    timestamp: new Date().toISOString(),
  },
};

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const [firstParam, secondParam] = params.path;

    // Caso 1: /api/get/123 (path = ['123'])
    if (firstParam && !secondParam) {
      const data = mockDatabase[firstParam];
      if (!data) {
        return NextResponse.json(
          { error: "Registro não encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json(data);
    }

    // Caso 2: /api/get/levels/123 (path = ['levels', '123'])
    if (firstParam === "levels" && secondParam) {
      const data = mockDatabase[secondParam];
      if (!data) {
        return NextResponse.json(
          { error: "Registro não encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        token: secondParam,
        value: data.temperature,
        unity: "°C",
        timestamp: data.timestamp,
      });
    }

    // Caso 3: /api/get/addres/123 (path = ['addres', '123'])
    if (firstParam === "addres" && secondParam) {
      const data = mockDatabase[secondParam];
      if (!data) {
        return NextResponse.json(
          { error: "Registro não encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        token: secondParam,
        address: data.address,
        state: data.state,
        city: data.city,
      });
    }

    // Caso inválido
    return NextResponse.json({ error: "Endpoint inválido" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

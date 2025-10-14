import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      token,
      deviceId: deviceIdRaw, // pode vir undefined
      temperature,
      humidity,
      name,
      address,
      state,
      city,
    } = data;

    if (!token || temperature == null || humidity == null) {
      return NextResponse.json(
        { error: "Mandatory fields: token, temperature and humidity." },
        { status: 400 }
      );
    }

    const deviceId = deviceIdRaw != null ? Number(deviceIdRaw) : undefined;
    if (deviceIdRaw != null && Number.isNaN(deviceId)) {
      return NextResponse.json(
        { error: "deviceId must be a number" },
        { status: 400 }
      );
    }

    let device = undefined;

    if (deviceId) {
      // Tenta encontrar pelo id
      device = await prisma.device.findUnique({ where: { id: deviceId } });

      if (!device) {
        // Cria explicitamente com o id informado.
        // Se você quiser obrigar campos para criação, ajuste esse bloco para validar name/address/etc.
        const deviceData = {
          id: deviceId,
          token,
          name: name ?? `device-${deviceId}`,
          address: address ?? "",
          state: state ?? "",
          city: city ?? "",
        };

        device = await prisma.device.create({
          data: deviceData,
        });

        // Ajusta a sequência do serial para evitar conflitos futuros (Postgres).
        // ATENÇÃO: esse comando é específico para Postgres. Se você usa outro DB, remova.
        try {
          // Ajusta o sequence para o max(id) atual da tabela Device
          await prisma.$executeRawUnsafe(
            `SELECT setval(pg_get_serial_sequence('"Device"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "Device"));`
          );
        } catch (seqErr) {
          // Loga erro de ajuste de sequence, mas não impede a criação da leitura
          console.error(
            "[WARN] failed to update sequence for Device.id:",
            seqErr
          );
        }
      }
    } else {
      // Sem deviceId: logic usual — busca por token ou cria novo (requer name/address/state/city)
      device = await prisma.device.findFirst({ where: { token } });

      if (!device) {
        if (!name || !address || !state || !city) {
          return NextResponse.json(
            {
              error:
                "Device not found. Provide name, address, state and city to create it.",
            },
            { status: 400 }
          );
        }
        device = await prisma.device.create({
          data: { token, name, address, state, city },
        });
      }
    }

    // garante que temos device.id
    if (!device || device.id == null) {
      return NextResponse.json(
        { error: "Device creation failed" },
        { status: 500 }
      );
    }

    // cria a leitura
    const leitura = await prisma.reading.create({
      data: {
        deviceId: device.id,
        temperature,
        humidity,
      },
    });

    if (token && token.includes("@") && temperature >= 43) {
      sendEmailNotification(token, device.token, device.address, temperature)
        .then(() => {
          console.log("Email notification sent successfully");
        })
        .catch((error) => {
          console.error("Failed to send email notification:", error);
        });
    }

    return NextResponse.json(
      { message: "Reading registered successfully.", leitura, device },
      { status: 201 }
    );
  } catch (err) {
    console.error("[ERRO POST READING]", err);
    return NextResponse.json(
      { error: "Internal error when registering reading." },
      { status: 500 }
    );
  }
}

async function sendEmailNotification(
  email: string,
  deviceId: string,
  address: string,
  temperature: number
) {
  try {
    const to = email?.toString() || "";
    const device = deviceId?.toString() || "Unknown Device";
    const addr = address?.toString() || "Unknown Address";
    const temp = temperature?.toString() || "Unknown Temperature";

    // Use a URL absoluta para a API route
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    const url = `${baseUrl}/email?${new URLSearchParams({
      to,
      device,
      address: addr,
      temperature: temp,
    }).toString()}`;

    console.log("Sending email to:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Email API error:", errorText);
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    console.log("Email sent successfully:", result);
    return result;
  } catch (err) {
    console.error("Error in sendEmailNotification:", err);
    throw err; // Propaga o erro para ser tratado pelo chamador
  }
}

import { google } from "googleapis";
// @ts-expect-error: Could not find a declaration file for module 'nodemailer'
import nodemailer from "nodemailer";
import React from "react";
import { render } from "@react-email/render";
import EmailTemplate from "@/components/emailTemplate";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  SENDER_EMAIL,
} = process.env;

if (
  !GOOGLE_CLIENT_ID ||
  !GOOGLE_CLIENT_SECRET ||
  !GOOGLE_REFRESH_TOKEN ||
  !SENDER_EMAIL
) {
  throw new Error(
    "Alguma variável de ambiente do Gmail OAuth2 não foi configurada."
  );
}

// settings of OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

export async function GET(req: Request) {
  const to = new URL(req.url).searchParams.get("to");
  const device = new URL(req.url).searchParams.get("device");
  const addr = new URL(req.url).searchParams.get("address");
  const temp = new URL(req.url).searchParams.get("temperature");

  if (!to) {
    return new Response(
      JSON.stringify({ error: "Missing 'to' query parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Generate the access token
    const accessToken = await oAuth2Client.getAccessToken();

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_EMAIL,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken?.token || accessToken,
      },
    });

    const emailHtml: string = await render(
      React.createElement(EmailTemplate, {
        data: {
          name: device || "Unknown Device",
          address: addr || "Unknown Address",
          temperature: temp || "Unknown Temperature",
        },
      })
    );

    // Send email
    const info = await transporter.sendMail({
      from: `SDPI <${SENDER_EMAIL}>`,
      to,
      subject: "AVISO",
      html: emailHtml,
    });

    return new Response(JSON.stringify({ ok: true, id: info.messageId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Erro ao enviar email:", err);
    return new Response(JSON.stringify({ error: err || String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

interface EmailTemplateProps {
  data: {
    name: string;
    address: string;
    temperature: string;
  };
}

function EmailTemplate({
  data: { name, address, temperature },
}: EmailTemplateProps) {
  return (
    <body
      style={{
        margin: 0,
        padding: 0,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
      }}
    >
      <table
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        style={{ backgroundColor: "#f4f4f4", padding: "20px" }}
      >
        <tr>
          <td>
            <table
              width="600"
              cellPadding={0}
              cellSpacing={0}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                margin: "0 auto",
              }}
            >
              <tr>
                <td
                  style={{
                    backgroundColor: "#ff0000",
                    padding: "20px",
                    color: "#ffffff",
                    textAlign: "center",
                  }}
                >
                  <h1 style={{ margin: 0, fontSize: "24px" }}>
                    ⚠️ Alerta de Temperatura Elevada
                  </h1>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "20px", color: "#333333" }}>
                  <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
                    Foi detectada uma temperatura acima do limite esperado:
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      color: "#ff6f00",
                      fontWeight: "bold",
                    }}
                  >
                    Temperatura: {temperature}°C
                  </p>
                  <p style={{ fontSize: "16px" }}>
                    <strong>Endereço:</strong> {address}
                    <br />
                    <strong>Dispositivo:</strong> {name}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#888888",
                      marginTop: "30px",
                    }}
                  >
                    Por favor, verifique o local o quanto antes.
                  </p>
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    backgroundColor: "#eeeeee",
                    padding: "15px",
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#555",
                  }}
                >
                  Este é um aviso automático. Não responda este e-mail.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  );
}

export default EmailTemplate;

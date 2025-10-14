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
    <div style={{ border: "2px solid white", borderRadius: "5px" }}>
      <h1 style={{ textAlign: "center" }}>Aviso</h1>
      <p style={{ marginLeft: "5%" }}>
        Foi detectado uma alta temperatura:
        <strong style={{ color: "orange" }}> {temperature}</strong>°C
        <br />
        Endereço: <strong>{address}</strong>
        <br />
        Dispositivo: <strong>{name}</strong>
      </p>
    </div>
  );
}

export default EmailTemplate;

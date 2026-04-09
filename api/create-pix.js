export default async function handler(req, res) {
  const apiKey = "$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjQwMzVmZTVjLTY2NDYtNGQwZS1iNWRkLTMxOTQ5ZjdjZGRhYjo6JGFhY2hfN2NkMWI3NGMtOWY3ZC00M2E2LWI4ZTItZmVjNTY1YmE0YmUy"; // sua chave

  try {
    // 🔥 cria pagamento
    const paymentResponse = await fetch("https://api.asaas.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": apiKey
      },
      body: JSON.stringify({
        billingType: "PIX",
        value: 50.00,
        description: "Compra no site",
        dueDate: new Date().toISOString().split("T")[0]
      })
    });

    const paymentData = await paymentResponse.json();

    // 🔥 pega QR code REAL
    const qrResponse = await fetch(
      `https://api.asaas.com/v3/payments/${paymentData.id}/pixQrCode`,
      {
        headers: {
          "access_token": apiKey
        }
      }
    );

    const qrData = await qrResponse.json();

    // 🔥 retorna no formato correto
    res.status(200).json({
      qr_code_base64: qrData.encodedImage,
      payload: qrData.payload
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar PIX" });
  }
}
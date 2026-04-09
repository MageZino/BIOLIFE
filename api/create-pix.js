export default async function handler(req, res) {
  // ⚠️ RECOMENDAÇÃO: Troque essa chave no painel do Asaas e use process.env.ASAAS_KEY
  const apiKey = "$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjQwMzVmZTVjLTY2NDYtNGQwZS1iNWRkLTMxOTQ5ZjdjZGRhYjo6JGFhY2hfN2NkMWI3NGMtOWY3ZC00M2E2LWI4ZTItZmVjNTY1YmE0YmUy";

  try {
    // 1. Criar o pagamento
    const paymentResponse = await fetch("https://api.asaas.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": apiKey
      },
      body: JSON.stringify({
        billingType: "PIX",
        value: 50.00,
        description: "Compra BioLife",
        dueDate: new Date().toISOString().split("T")[0]
      })
    });

    const paymentData = await paymentResponse.json();

    if (!paymentData.id) {
      throw new Error("Erro ao criar pagamento: " + JSON.stringify(paymentData));
    }

    // 2. Buscar o QR Code
    const qrResponse = await fetch(
      `https://api.asaas.com/v3/payments/${paymentData.id}/pixQrCode`,
      {
        headers: { "access_token": apiKey }
      }
    );

    const qrData = await qrResponse.json();

    // 3. Retornar os dados
    // Aqui eu já adiciono o prefixo "data:image/png;base64," para facilitar sua vida
    res.status(200).json({
      qr_code_base64: `data:image/png;base64,${qrData.encodedImage}`,
      payload: qrData.payload
    });

  } catch (error) {
    console.error("Erro no Servidor:", error);
    res.status(500).json({ error: "Erro ao gerar PIX", detalhes: error.message });
  }
}
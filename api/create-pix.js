export default async function handler(req, res) {
  const apiKey = "$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjQwMzVmZTVjLTY2NDYtNGQwZS1iNWRkLTMxOTQ5ZjdjZGRhYjo6JGFhY2hfN2NkMWI3NGMtOWY3ZC00M2E2LWI4ZTItZmVjNTY1YmE0YmUy";

  // Pegando os dados que o usuário digitou no formulário do site
  const { nome, email, telefone } = req.body;

  try {
    // 1. CRIAR O CLIENTE (Obrigatório no Asaas)
    const customerResponse = await fetch("https://api.asaas.com/v3/customers", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "access_token": apiKey 
      },
      body: JSON.stringify({
        name: nome || "Cliente BioLife",
        email: email || "comercial@biolife.com",
        mobilePhone: telefone || ""
      })
    });

    const customerData = await customerResponse.json();

    if (!customerData.id) {
      throw new Error("Erro ao criar cliente: " + JSON.stringify(customerData));
    }

    // 2. CRIAR O PAGAMENTO PARA ESSE CLIENTE
    const paymentResponse = await fetch("https://api.asaas.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": apiKey
      },
      body: JSON.stringify({
        customer: customerData.id, // ID que acabamos de gerar acima
        billingType: "PIX",
        value: 44.99, // Valor que vi no seu print da Creatina
        description: "Compra BioLife - Creatina",
        dueDate: new Date().toISOString().split("T")[0]
      })
    });

    const paymentData = await paymentResponse.json();

    if (!paymentData.id) {
      throw new Error("Erro ao criar pagamento: " + JSON.stringify(paymentData));
    }

    // 3. BUSCAR O QR CODE REAL
    const qrResponse = await fetch(
      `https://api.asaas.com/v3/payments/${paymentData.id}/pixQrCode`,
      {
        headers: { "access_token": apiKey }
      }
    );

    const qrData = await qrResponse.json();

    // 4. RETORNAR PARA O SITE
    res.status(200).json({
      qr_code_base64: `data:image/png;base64,${qrData.encodedImage}`,
      payload: qrData.payload
    });

  } catch (error) {
    console.error("Erro no Servidor:", error);
    res.status(500).json({ error: "Erro ao gerar PIX", detalhes: error.message });
  }
}
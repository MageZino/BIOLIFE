export default async function handler(req, res) {
  // CONFIGURAÇÕES DE SANDBOX (TESTE)
  const BASE_URL = "https://sandbox.asaas.com/api/v3";
  const apiKey = "$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojc3NmY4ZjY1LTM0ZTEtNDI2Ny04YTkxLTczNWMxNTdmMmQyZTo6JGFhY2hfY2MxODAwMDEtYWUxMi00YTI5LTkwNmYtOTE4ZDQyYzRjOWZh";

  // RECEBENDO DADOS DO FRONTENDD
  const { 
    nome, email, telefone, cpf, cep, rua, numero, bairro, cidade, estado,
    nomeProduto, preco 
  } = req.body;

  try {
    // 1. CRIAR OU ATUALIZAR O CLIENTE NO SANDBOX
    const customerResponse = await fetch(`${BASE_URL}/customers`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "access_token": apiKey 
      },
      body: JSON.stringify({
        name: nome,
        email: email,
        cpfCnpj: cpf ? cpf.replace(/\D/g, "") : "",
        mobilePhone: telefone ? telefone.replace(/\D/g, "") : "",
        postalCode: cep ? cep.replace(/\D/g, "") : "",
        address: rua,
        addressNumber: numero,
        province: bairro,
        externalReference: "BIO-" + Date.now() 
      })
    });

    const customerData = await customerResponse.json();

    if (customerData.errors) {
      throw new Error(customerData.errors[0].description);
    }

    // 2. CRIAR O PAGAMENTO PIX NO SANDBOX
    const paymentResponse = await fetch(`${BASE_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": apiKey
      },
      body: JSON.stringify({
        customer: customerData.id,
        billingType: "PIX",
        value: parseFloat(preco), 
        description: `Compra BioLife - ${nomeProduto}`,
        dueDate: new Date().toISOString().split("T")[0]
      })
    });

    const paymentData = await paymentResponse.json();

    if (paymentData.errors) {
      throw new Error(paymentData.errors[0].description);
    }

    // 3. BUSCAR O QR CODE NO SANDBOX
    const qrResponse = await fetch(
      `${BASE_URL}/payments/${paymentData.id}/pixQrCode`,
      {
        headers: { "access_token": apiKey }
      }
    );

    const qrData = await qrResponse.json();

    // RETORNO PARA O FRONTEND
    res.status(200).json({
      qr_code_base64: `data:image/png;base64,${qrData.encodedImage}`,
      payload: qrData.payload
    });

  } catch (error) {
    console.error("Erro no Servidor:", error);
    res.status(400).json({ error: "Erro ao processar pagamento", detalhes: error.message });
  }
}
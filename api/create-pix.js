export default async function handler(req, res) {
  const apiKey = "$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjQwMzVmZTVjLTY2NDYtNGQwZS1iNWRkLTMxOTQ5ZjdjZGRhYjo6JGFhY2hfN2NkMWI3NGMtOWY3ZC00M2E2LWI4ZTItZmVjNTY1YmE0YmUy";

  // Recebendo todos os novos campos do frontend
  const { nome, email, telefone, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

  try {
    // 1. CRIAR OU ATUALIZAR O CLIENTE (Agora com endereço e CPF)
    const customerResponse = await fetch("https://api.asaas.com/v3/customers", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "access_token": apiKey 
      },
      body: JSON.stringify({
        name: nome,
        email: email,
        cpfCnpj: cpf ? cpf.replace(/\D/g, "") : "", // Remove pontos e traços
        mobilePhone: telefone ? telefone.replace(/\D/g, "") : "",
        postalCode: cep ? cep.replace(/\D/g, "") : "",
        address: rua,
        addressNumber: numero,
        province: bairro,
        complement: "", // Opcional
        externalReference: "BIO-" + Date.now() 
      })
    });

    const customerData = await customerResponse.json();

    if (customerData.errors) {
      throw new Error(customerData.errors[0].description);
    }

    // 2. CRIAR O PAGAMENTO PARA O CLIENTE
    const paymentResponse = await fetch("https://api.asaas.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": apiKey
      },
      body: JSON.stringify({
        customer: customerData.id,
        billingType: "PIX",
        value: 44.99, 
        description: "Compra BioLife - Creatina",
        dueDate: new Date().toISOString().split("T")[0]
      })
    });

    const paymentData = await paymentResponse.json();

    if (paymentData.errors) {
      throw new Error(paymentData.errors[0].description);
    }

    // 3. BUSCAR O QR CODE
    const qrResponse = await fetch(
      `https://api.asaas.com/v3/payments/${paymentData.id}/pixQrCode`,
      {
        headers: { "access_token": apiKey }
      }
    );

    const qrData = await qrResponse.json();

    // 4. RETORNO PARA O FRONTEND
    res.status(200).json({
      qr_code_base64: `data:image/png;base64,${qrData.encodedImage}`,
      payload: qrData.payload
    });

  } catch (error) {
    console.error("Erro no Servidor:", error);
    res.status(400).json({ error: "Erro ao processar pagamento", detalhes: error.message });
  }
}
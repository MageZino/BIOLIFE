export default async function handler(req, res) {
  const apiKey = "$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjQwMzVmZTVjLTY2NDYtNGQwZS1iNWRkLTMxOTQ5ZjdjZGRhYjo6JGFhY2hfN2NkMWI3NGMtOWY3ZC00M2E2LWI4ZTItZmVjNTY1YmE0YmUy";

  try {
    const response = await fetch("https://sandbox.asaas.com/api/v3/payments", {
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

    const data = await response.json();

    res.status(200).json({
      qr_code: data.pixQrCode,
      copia_cola: data.pixCopyAndPaste
    });

  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar PIX" });
  }
}
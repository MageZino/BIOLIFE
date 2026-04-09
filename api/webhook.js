export default async function handler(req, res) {

  // 🔐 valida token (SEGURANÇA)
  const tokenRecebido = req.headers['asaas-access-token'];
  const meuToken = "whsec_GuU5mlagzk4wqLPZAodRSZvOMDzKsohQLCD5XO0oLzU";

  if (tokenRecebido !== meuToken) {
    console.log("❌ Token inválido");
    return res.status(403).send("Acesso negado");
  }

  const body = req.body;

  console.log("🔔 Webhook recebido:", body);

  // ✅ só continua se for pagamento recebido
  if (body.event === "PAYMENT_RECEIVED") {

    console.log("💰 PAGAMENTO CONFIRMADO!");

    const pagamento = body.payment;

    const valor = pagamento.value;
    const id = pagamento.id;

    console.log("ID:", id);
    console.log("Valor:", valor);

    // 🚀 AQUI VAI SUA LÓGICA REAL

    // exemplo:
    // enviar email
    // liberar produto
    // salvar no banco

  }

  res.status(200).json({ received: true });
}
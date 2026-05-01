export default async function handler(req, res) {
  // 1. O Asaas envia o token no header 'asaas-access-token'
  const tokenRecebido = req.headers['asaas-access-token'];
  
  // Certifique-se que este é o token gerado no painel SANDBOX
  const meuToken = "whsec_vKehgaFVwPMz-Fz7XgG5PRxOACEo01oznnc4ZbOp6M0";

  if (tokenRecebido !== meuToken) {
    console.log("❌ Tentativa de acesso não autorizada ao Webhook");
    return res.status(401).json({ error: "Token inválido" });
  }

  const body = req.body;

  // Log para você debugar no painel da Vercel
  console.log(`🔔 Evento recebido: ${body.event}`);

  // ✅ Verificamos CONFIRMED ou RECEIVED para garantir que o PIX foi pago
  if (body.event === "PAYMENT_CONFIRMED" || body.event === "PAYMENT_RECEIVED") {
      console.log("💰 PAGAMENTO CONFIRMADO!");

    const pagamento = body.payment;
    
    console.log("💰 PAGAMENTO IDENTIFICADO COM SUCESSO!");
    console.log(`ID da Cobrança: ${pagamento.id}`); 
    console.log(`Valor: R$ ${pagamento.value}`);
    console.log(`Cliente ID: ${pagamento.customer}`);

    // 🚀 AQUI VOCÊ EXECUTA SUA LÓGICA
    // Exemplo: await atualizarPedidoNoBanco(pagamento.externalReference);
  }

  // O Asaas exige uma resposta 200 rápida para não tentar reenviar o webhook
  return res.status(200).json({ received: true });
}
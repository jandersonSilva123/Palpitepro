const API_BASE = "https://v3.football.api-sports.io";

module.exports = async (req, res) => {
  // Permitir que o site GolZen faça a chamada
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  const endpoint = req.query.endpoint || "fixtures";

  // Endpoints permitidos pela GolZen
const permitidos = [
  "fixtures",
  "teams",
  "standings",
  "players",
  "injuries",
  "odds",
  "predictions"
"fixtures/statistics"
];

  if (!permitidos.includes(endpoint)) {
    return res.status(400).json({
      error: "Endpoint não permitido pela GolZen"
    });
  }

  const params = new URLSearchParams();

  for (const [chave, valor] of Object.entries(req.query)) {
    if (chave !== "endpoint" && valor !== undefined) {
      params.set(chave, String(valor));
    }
  }

  try {
    const resposta = await fetch(
      `${API_BASE}/${endpoint}?${params.toString()}`,
      {
        headers: {
          "x-apisports-key": process.env.API_FOOTBALL_KEY
        }
      }
    );

    const dados = await resposta.json();

    return res.status(resposta.status).json(dados);

  } catch (erro) {
    return res.status(500).json({
      error: "Erro ao consultar a API-Football"
    });
  }
};

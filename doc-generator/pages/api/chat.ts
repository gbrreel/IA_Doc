import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST instead." });
  }

  const { messages } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: "Nenhuma mensagem foi enviada." });
  }

  try {
    console.log("Sending request to OpenAI with messages:", messages);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Você é um assistente que documenta código automaticamente." },
          ...messages
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da OpenAI:", errorText);
      return res.status(500).json({ error: "Erro ao comunicar com a OpenAI.", details: errorText });
    }

    const data = await response.json();
    res.json({ response: data.choices[0].message.content });

  } catch (error) {
    console.error("Erro interno:", error);
    res.status(500).json({ error: "Erro interno no servidor.", details: error.message });
  }
}
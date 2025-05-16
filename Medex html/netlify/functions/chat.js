
exports.handler = async function (event) {
  const { prompt } = JSON.parse(event.body);

  const mensajes = [
    {
      role: "system",
      content: "Eres una herramienta médica inicial, responde simple, amigable y con emojis."
    },
    {
      role: "user",
      content: prompt
    }
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      messages: mensajes
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};

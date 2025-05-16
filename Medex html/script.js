const apiKey = "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";
const chatLog = document.getElementById("chat-log");
const form = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

const mensajes = [
  {
    role: "system",
    content:
            "Eres una herramienta de primera consulta al contraer cualquier enfermedad, adopta un tono tranquilo y conciso , se debe recomendar siempre la búsqueda de atención médica e indicar a qué tipo de especialista visitar, hablas en español e indicas basándote en los síntomas: urgencia y tipo de especialista a visitar, qué tomar en el momento (como primera opción medicina natural y como segunda medicamentos de venta libre) y la posible enfermedad que posea. Remarcar la importancia de visitar al médico ya que esta no es información experta. resume todo para que sea amigable y no utilices términos complejos. Utiliza emojis para hacer más amigable el ambiente"   
  }
];
const loadingIndicator = document.getElementById("loading-indicator");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const texto = userInput.value.trim();
  if (!texto) return;


  mensajes.push({ role: "user", content: texto });
  appendMessage("🧑 Usuario", texto);
  userInput.value = "";

  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("message");
  loadingDiv.id = "loading-message";
  loadingDiv.innerHTML = `
    <strong>👨‍⚕️ MedExpress:</strong> 
    <span class="loading-indicator">
      <span class="dot"></span><span class="dot"></span><span class="dot"></span> Procesando...
    </span>`;
  chatLog.appendChild(loadingDiv);
  chatLog.scrollTop = chatLog.scrollHeight;


  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: texto })
    });

    const data = await response.json();


    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content.trim();
      mensajes.push({ role: "assistant", content });
      appendMessage("👨‍⚕️ MedExpress", content);
      loadingDiv.remove();
    } else {
      loadingDiv.remove();
      console.warn("Respuesta vacía:", data);
      appendMessage("❗Error", "La respuesta del servidor fue vacía.");
    }
  } catch (error) {
    loadingDiv.remove();
    console.error("Error al conectar con la API:", error);
    appendMessage("❌ Error", "Hubo un problema al contactar con el servidor.");

  }
});

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}
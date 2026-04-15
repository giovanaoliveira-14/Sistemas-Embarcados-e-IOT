import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: "monitor-estufa",
  clean: false
});

let recebidas = {
  temp: 0,
  agua: 0,
  incendio: 0
};

const mensagensRecebidas = new Set();

client.on("connect", () => {
  console.log("Subscriber conectado");

  client.subscribe("estufa/temp/ambiente", { qos: 0 });
  client.subscribe("estufa/agua/nivel", { qos: 1 });
  client.subscribe("estufa/alerta/incendio", { qos: 2 });

  // 👇 NOVO: status do sistema
  client.subscribe("estufa/status", { qos: 1 });
});

client.on("message", (topic, msg) => {
  const mensagem = msg.toString();

  let tipo = "";

  if (topic.includes("temp")) {
    recebidas.temp++;
    tipo = "🌡";
  } else if (topic.includes("agua")) {
    recebidas.agua++;
    tipo = "💧";
  } else if (topic.includes("incendio")) {
    recebidas.incendio++;
    tipo = "🔥";
  }

  if (mensagensRecebidas.has(mensagem)) {
    console.log("❌ DUPLICADA:", mensagem);
  } else {
    mensagensRecebidas.add(mensagem);
    console.log(`${tipo} RECEBIDA:`, mensagem);
  }

    if (topic === "estufa/status") {
        console.log("📡 STATUS DO SISTEMA:", mensagem);
        return;
    }
});
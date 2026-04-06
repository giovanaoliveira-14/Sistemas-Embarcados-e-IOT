import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883");

let enviadas = {
  temp: 0,
  agua: 0,
  incendio: 0
};

client.on("connect", () => {
  console.log("Publisher conectado");

  // 🌡 Temperatura (QoS 0 - a cada 5s)
  setInterval(() => {
    const msg = `Temp: ${Math.random() * 30}`;
    client.publish("estufa/temp/ambiente", msg, { qos: 0 });
    enviadas.temp++;
    console.log("🌡 Enviado:", msg);
  }, 5000);

  // 💧 Água (QoS 1 - a cada 30s)
  setInterval(() => {
    const msg = `Nivel: ${Math.random() * 100}`;
    client.publish("estufa/agua/nivel", msg, { qos: 1 });
    enviadas.agua++;
    console.log("💧 Enviado:", msg);
  }, 30000);

  // 🔥 Incêndio (QoS 2 - evento aleatório)
  setInterval(() => {
    const incendio = Math.random() < 0.2; // 20% chance

    if (incendio) {
      const msg = "🔥 INCÊNDIO DETECTADO!";
      client.publish("estufa/alerta/incendio", msg, { qos: 2 });
      enviadas.incendio++;
      console.log(msg);
    }
  }, 10000);
});
import mqtt from "mqtt";

const options = {
  will: {
    topic: "estufa/status",
    payload: "offline",
    qos: 1,
    retain: true
  }
};

const client = mqtt.connect("mqtt://localhost:1883", options);

let enviadas = {
  temp: 0,
  agua: 0,
  incendio: 0
};

client.on("connect", () => {
  console.log("Publisher conectado");
  client.publish("estufa/status", "online", { retain: true });

  setInterval(() => {
    const msg = `Temp: ${Math.random() * 30}`;
    client.publish("estufa/temp/ambiente", msg, { qos: 0 });
    enviadas.temp++;
    console.log("🌡 Enviado:", msg);
  }, 5000);

  setInterval(() => {
    const msg = `Nivel: ${Math.random() * 100}`;
    client.publish("estufa/agua/nivel", msg, { qos: 1 });
    enviadas.agua++;
    console.log("💧 Enviado:", msg);
  }, 30000);

  setInterval(() => {
    const incendio = Math.random() < 0.2;

    if (incendio) {
      const msg = "🔥 INCÊNDIO DETECTADO!";
      client.publish("estufa/alerta/incendio", msg, { qos: 2 });
      enviadas.incendio++;
      console.log(msg);
    }
  }, 10000);
});
const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883", {
  will: {
    topic: "casa/sala/luz/status",
    payload: "OFFLINE",
    qos: 1,
    retain: true
  }
});

let estado = "OFF";

client.on("connect", () => {
  console.log("Luz conectada");

  client.subscribe("casa/sala/luz/comando", { qos: 1 });

  client.publish("casa/sala/luz/status", estado, {
    qos: 1,
    retain: true
  });
});

client.on("message", (topic, message) => {
  const comando = message.toString();

  if (comando === "ON" || comando === "OFF") {
    estado = comando;

    client.publish("casa/sala/luz/status", estado, {
      qos: 1,
      retain: true
    });

    console.log("Novo estado:", estado);
  } else {
    console.log("Comando inválido");
  }
});
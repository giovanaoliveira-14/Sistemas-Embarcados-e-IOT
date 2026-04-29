const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883");

let estado = "OFF";

client.on("connect", () => {
  console.log("Luz conectada");
  client.subscribe("casa/sala/luz/comando");
  client.publish("casa/sala/luz/status", estado);
});

client.on("message", (topic, message) => {
  const comando = message.toString();

  if (comando === "ON" || comando === "OFF") {
    estado = comando;
    client.publish("casa/sala/luz/status", estado);
    console.log("Novo estado:", estado);
  } else {
    console.log("Comando inválido");
  }
});
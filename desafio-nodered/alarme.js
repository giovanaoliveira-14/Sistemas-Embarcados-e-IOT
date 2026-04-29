const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost:1883");
let estado = "DESARMADO";
client.on("connect", () => {
    console.log("Alarme conectado ao broker");
    client.subscribe("casa/alarme/comando");
    client.publish("casa/alarme/status", estado);
});
client.on("message", (topic, message) => {
    const comando = message.toString();
    console.log("Comando recebido:", comando);
    if (comando === "ARMAR") {
        estado = "ARMADO";
    } else if (comando === "DESARMAR") {
        estado = "DESARMADO";
    } else {
        console.log("Comando inválido");
        return;
    }
    client.publish("casa/alarme/status", estado);
    console.log("Novo estado:", estado);
});
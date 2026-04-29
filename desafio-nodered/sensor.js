const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("Sensor conectado");

  setInterval(() => {
    const tempSala = (20 + Math.random() * 10).toFixed(2);
    const tempQuarto = (18 + Math.random() * 8).toFixed(2);
    const umidadeSala = (40 + Math.random() * 20).toFixed(2);
    const umidadeQuarto = (45 + Math.random() * 15).toFixed(2);

    client.publish("casa/sala/temperatura", tempSala);
    client.publish("casa/sala/umidade", umidadeSala);

    client.publish("casa/quarto/temperatura", tempQuarto);
    client.publish("casa/quarto/umidade", umidadeQuarto);

    console.log("Sala:", tempSala, umidadeSala);
    console.log("Quarto:", tempQuarto, umidadeQuarto);

  }, 2000);
});
const kafka = require("kafka-node");

const producer = () => {
  const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
  const producer = new kafka.Producer(client);

  producer.on("ready", () => {
    console.log("Kafka producer is ready.");
  });

  producer.on("error", (err) => {
    console.error("Kafka producer error:", err);
  });

  return (topic, message) => {
    const payloads = [{ topic, messages: JSON.stringify(message) }];
    producer.send(payloads, (err, data) => {
      if (err) console.error("Kafka publish error:", err);
      else console.log(`Message sent to ${topic}:`, data);
    });
  };
};

module.exports = producer;
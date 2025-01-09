const kafka = require("kafka-node");

const consumer = () => {
  const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
  const consumer = new kafka.Consumer(client, [{ topic: "user-events", partition: 0 }], { autoCommit: true });

  consumer.on("message", (message) => {
    console.log("Consumed message:", JSON.parse(message.value));
    // Process the message (e.g., save to DB, send email, etc.)
  });

  consumer.on("error", (err) => {
    console.error("Consumer error:", err);
  });
};

module.exports = consumer;
const { Kafka } = require("kafkajs");
const db = require("../db/connection");

const kafka = new Kafka({
  clientId: "user-service",
  brokers: ["localhost:9092"], // Replace with your Kafka broker(s)
});

const consumer = kafka.consumer({ groupId: "user-service-group" });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-events", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());

      if (event.type === "USER_LOGGED_IN") {
        console.log(`Received event: ${JSON.stringify(event)}`);

        try {
          // Update the user's last login timestamp
          await db.query(
            "UPDATE users SET last_login = $1 WHERE id = $2",
            [new Date(event.timestamp), event.userId]
          );
          console.log(`User ${event.userId} login time updated.`);
        } catch (err) {
          console.error("Error updating last login time:", err);
        }
      }
    },
  });
};

module.exports = startConsumer;
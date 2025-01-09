const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "notification-group" });

const consume = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log(`Received event: ${event.type}`);
      if (event.type === "USER_REGISTERED") {
        console.log(`New user registered: ${event.username}`);
      } else if (event.type === "USER_LOGGED_IN") {
        console.log(`User logged in: ${event.email}`);
      }
    },
  });
};

module.exports = consume;
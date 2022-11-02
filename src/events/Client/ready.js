const { prefix } = require("../../config.js");
const { Activity } = require("discord.js");

module.exports ={
name: "ready",
run: async (client) => {
    console.log(`Le bot ${client.user.username} est prêt !`);
 }
}
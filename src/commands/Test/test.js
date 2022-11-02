const { EmbedBuilder } = require("discord.js");
const { post } = require("node-superfetch");

module.exports = {
    name: "test",
    category: "Owner",
    description: "Testing commande",
    args: false,
    usage: "<string>",
    userPerms: [],
    owner: true,
    execute: async (message, args, client, prefix) => {
       
        message.reply({content: `Test effectuer avec succès !`})
    }
}
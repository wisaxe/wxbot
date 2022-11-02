const ClientHandler = require("./structures/Client");
const client = new ClientHandler();

client.login(process.env.TOKEN)
  
module.exports = client;
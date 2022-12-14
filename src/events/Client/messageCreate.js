const { EmbedBuilder, Message, Client, PermissionsBitField } = require("discord.js");
const config = require("../../config")

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @returns 
     */
    run: async (client, message) => {
        if (message.author.bot) return;
        let prefix = client.prefix;
        
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        if (!prefixRegex.test(message.content)) return;

        const [matchedPrefix] = message.content.match(prefixRegex);

        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) ||
            client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve('SendMessages'))) return await message.author.dmChannel.send({ content: `Je n'ai pas la permission **\`SEND_MESSAGES\`** dans le salon <#${message.channelId}> .` }).catch(() => { });

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve('ViewChannel'))) return;

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve('EmbedLinks'))) return await message.channel.send({ content: `Je n'ai pas la permission **\`EMBED_LINKS\`** dans le salon <#${message.channelId}> .` }).catch(() => { });

        const embed = new EmbedBuilder()
            .setColor('Red')

        if (command.args && !args.length) {
            let reply = `Vous n'avez fourni aucun argument, ${message.author}!`;

            if (command.usage) {
                reply += `\Utilisation: \`${prefix}${command.name} ${command.usage}\``;
            }

            embed.setDescription(reply);
            return message.channel.send({ embeds: [embed] });
        }

        if (command.botPerms) {
            if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
                embed.setDescription(`Vous n'avez pas **\`${command.permission}\`** permission dans <#${message.channelId}> pour ex??cuter cette **\`${command.name}\`** commande.`);
                return message.channel.send({ embeds: [embed] });
            }
        }
        if (command.userPerms) {
            if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
                embed.setDescription(`Vous n'avez pas **\`${command.userPerms}\`** permission dans <#${message.channelId}> pour ex??cuter cette **\`${command.name}\`** commande.`);
                return message.channel.send({ embeds: [embed] });
            }
        }

        if (command.owner && message.author.id !== `${client.owner}`) {
            embed.setDescription("Seul le d??veloppeur peut utiliser cette commande.!");
            return message.channel.send({ embeds: [embed] });
        }

        try {
            command.execute(message, args, client, prefix);
        } catch (error) {
            console.log(error);
            embed.setDescription("Il y a eu une erreur dans l'ex??cution de cette commande. J'ai contact?? le propri??taire du Bot pour qu'il r??gle ce probl??me imm??diatement.");
            return message.channel.send({ embeds: [embed] });
        }
}};
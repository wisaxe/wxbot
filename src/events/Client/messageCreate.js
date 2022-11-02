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
                embed.setDescription(`Vous n'avez pas **\`${command.permission}\`** permission dans <#${message.channelId}> pour exécuter cette **\`${command.name}\`** commande.`);
                return message.channel.send({ embeds: [embed] });
            }
        }
        if (command.userPerms) {
            if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
                embed.setDescription(`Vous n'avez pas **\`${command.userPerms}\`** permission dans <#${message.channelId}> pour exécuter cette **\`${command.name}\`** commande.`);
                return message.channel.send({ embeds: [embed] });
            }
        }

        if (command.owner && message.author.id !== `${client.owner}`) {
            embed.setDescription("Seul le développeur peut utiliser cette commande.!");
            return message.channel.send({ embeds: [embed] });
        }

        try {
            command.execute(message, args, client, prefix);
        } catch (error) {
            console.log(error);
            embed.setDescription("Il y a eu une erreur dans l'exécution de cette commande. J'ai contacté le propriétaire du Bot pour qu'il règle ce problème immédiatement.");
            return message.channel.send({ embeds: [embed] });
        }
}};
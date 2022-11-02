const { CommandInteraction, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, SelectMenuBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../config")

module.exports = {
    name: "user-info",
    description: "Renvoie les infos du joueur(e) !",
    owner: false,
    options: [
        {
            name: "user",
            description: "Quel est l'utilisateur ?",
            required: true,
            type: ApplicationCommandOptionType.User,
        },
    ],
/**

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.resolve("SendMessages"))) return interaction.reply({ content: `**❌ Les autorisations actuelles sur ce serveur ne me permettent pas d'utiliser cette commande**`, ephemeral: true }).catch(() => { });
        if(!interaction.member.permissions.has(PermissionsBitField.resolve("Administrator"))) return interaction.reply({content: `❌ Vous n'avez pas la permissions de faire cette commande !`})
        try { 

            const member = interaction.options.getMember('user');
        
            let checkbot= " "; if (member.user.bot) checkbot = "✅"; else checkbot = "❌";
        
            const embed = new EmbedBuilder()
            .setTitle(`User info de ${member.user.tag}`)
            .setThumbnail(member.user.displayAvatarURL())
            .setColor("Red")
            .setDescription(`
                __**User Informations**__
        
                > **Name :** ${member.user.tag} | ${member.user.toString()}
                > **Tag :**  ${member.user.tag}
                > **ID :** ${member.user.id}
                **Bot : ** ${checkbot}
        
                **Information Compte**
        
                > **A rejoint le :** <t:${parseInt (member.user.createdTimestamp / 1000)}:R>
                > **Créer le :** <t:${parseInt (member.joinedAt / 1000)}:R>`)
        
                interaction.reply({embeds: [embed]})
              } catch (error) {
                console.log('Une erreur est survenue sur la commande user-info', error)
              }
            }
        }
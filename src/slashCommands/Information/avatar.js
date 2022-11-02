const { CommandInteraction, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, SelectMenuBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../config")

module.exports = {
    name: "avatar",
    description: "Permet d'avoir l'avatar d'un utilisateur'",
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
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.resolve("SendMessages"))) return interaction.reply({ content: `**❌ Les autorisations actuelles sur ce serveur ne me permettent pas d'utiliser cette commande**`, ephemeral: true }).catch(() => { });
        if(!interaction.member.permissions.has(PermissionsBitField.resolve("Administrator"))) return interaction.reply({content: `❌ Vous n'avez pas la permissions de faire cette commande !`})
        
        try {

            const user = interaction.options.getUser('user');

            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel(`Avatar`)
                .setURL(`${user.displayAvatarURL({dynamic: true})}`)
                .setStyle(ButtonStyle.Link)
            )

            const embed = new EmbedBuilder()
            .setTitle(`Avatar de ${user.username}`)
            .setColor('Blue')
            .setDescription(`Voici l'avatar de ${user.tag}`)
            .setImage(`${user.displayAvatarURL({dynamic: true})}`)
            .setFooter({text: `Demandé par ${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({dynamic: true})}`})
            .setTimestamp()
            interaction.reply({embeds: [embed], components: [row]})

        } catch (error) {
            console.log('Une erreur est survenue sur la commande avatar', error)
        }
    }
}
const { CommandInteraction, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, SelectMenuBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../config")

module.exports = {
    name: "clear",
    description: "Permet de supprimer des messages !",
    owner: false,
    options: [
        {
            name: "nombre",
            description: "Quel est le nombre de message(e)?",
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.resolve("ManageMessages"))) return interaction.reply({ content: `**❌ Les autorisations actuelles sur ce serveur ne me permettent pas d'utiliser cette commande**`, ephemeral: true }).catch(() => { });
        if(!interaction.member.permissions.has(PermissionsBitField.resolve("ManageMessages"))) return interaction.reply({content: `❌ Vous n'avez pas la permissions de faire cette commande !`})
        
        try {

           let amount = interaction.options.getNumber("nombre")
           let phrase = interaction.options.getString("phrase")

           if(isNaN(amount))return interaction.reply({content : `Veuillez mettre des chiffres afin que je puisse supprimer des messages !`, ephemeral: true})

           if(!phrase){
            interaction.channel.bulkDelete(amount, {filterOld: true}).then(async message => {
                await interaction.reply({content: `J'ai supprimer /${amount} messages `})

                setTimeout(async () =>{
                   await interaction.deleteReply();
                }, 2000)
            })
           }else{
            interaction.channel.bulkDelete((await interaction.channel.messages.fetch({limit: amount})).filter(filterMSG => filterMSG.content.toLowercase() === phrase.toLowercase()),{
                filterOld: true
            }).then(async(message) => {
                await interaction.reply({content: `J'ai supprimer ${message.size}/${amount} `})
                setTimeout(async () =>{
                    await interaction.deleteReply();
                 }, 2000)
            })
           }


        } catch (error) {
            console.log('Une erreur est survenue sur la commande clear', error)
        }
    }
}
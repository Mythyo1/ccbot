const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const config = require('../../config.json');
const { promptMessage } = require('../../functions.js')
const emoji = config.emojies

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Returns all commands, or one specific command info",
    usage: "[command | alias]",
    run: async (bot, message, args, con) => {
        prefix = config.prefix
        let icon = message.guild.iconURL;
        if (args[0]) {
            return getCMD(bot, message, args[0], con);
        } else {
            return getAll(bot, message, con);
        }

        function getAll(bot, message, args, con) {
            let icon = message.author.displayAvatarURL;
            let user = message.author.username
            // let hembed = new Discord.RichEmbed()
            // .setColor("#E7D774")
            // .setThumbnail(icon)
            // .setAuthor("Coding Com. - Help")
            // .setDescription("Available commands for " + bot.user.username + "\n \n Prefix: " + `\`${prefix}\``)
            // .addField("Info [2]:", "`help` | `whois`")
            // .addField("Misc [1]:", "`suggest`")
            // .addField("Fun [3]:", "`meme` | `rps` | `love`")
            // .addField("Moderation [3]:", "`kick` | `purge` | `ban`")
            // .addField("Admin [4]:", "`blacklist` | `say` | `eval` | `shutdown`")
            // .setFooter("Coding Com. | Total Commands: 5", bot.user.displayAvatarURL)

            // message.channel.send(hembed)



            
            const gh = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setAuthor(`${bot.user.username} help!`, bot.user.displayAvatarURL)
            .addField(`📗Info`, `View infomation commands for ${bot.user.username}`, true)
            .addField(`😂Fun`, `View fun commands for ${bot.user.username}`, true)
            .addField(`✏️Misc`, `View misc commands for ${bot.user.username}`, true)
            .addField(`🛠Moderation`, `View moderation commands for ${bot.user.username}`, true)
            .addField(`⛑Administator`, `View admin commands for ${bot.user.username}`, true)
            .setFooter(`Requested by ${user}`, icon)
            .setTimestamp();
            return message.channel.send(gh).then(async msg => {
            const emoji = await promptMessage(msg, message.author, null, ['📗', '😂', '✏️', '🛠', '⛑', '❌']);

                if (emoji === '📗') {
                    msg.delete();
                    const ih = new Discord.RichEmbed()
                    .setColor("RANDOM")
                    .setAuthor(`📗Infomation help!`, bot.user.displayAvatarURL)
                    .addField("Info [2]:", "`help` | `whois`")
                    return message.channel.send(ih).then(async msg => {
                        const nemoji = await promptMessage(msg, message.author, null, ['❌']);
                        
                        if (nemoji === '❌') msg.delete()
                });
                    
                    } else if (emoji === '😂') {
                        msg.delete();
                        const ifu = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .setAuthor(`😂Fun help!`, bot.user.displayAvatarURL)
                        .addField("Fun [3]:", "`meme` | `rps` | `love`")
                        return message.channel.send(ifu).then(async msg => {
                            const nemoji = await promptMessage(msg, message.author, null, ['❌']);
                            if (nemoji === '❌') msg.delete()
                    });

                    } else if (emoji === '✏️') {
                        msg.delete();
                        const im = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .setAuthor(`Misc help!`, bot.user.displayAvatarURL)
                        .addField("Misc [1]:", "`suggest`")
                        return message.channel.send(im).then(async msg => {
                            const nemoji = await promptMessage(msg, message.author, null, ['❌']);
                            if (nemoji === '❌') msg.delete()
                        });
                            
                    } else if (emoji === '🛠') {
                        msg.delete();
                        const im = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .setAuthor(`🛠Moderation help!`, bot.user.displayAvatarURL)
                        .addField("Moderation [2]:", "`kick` | `purge` | `ban`")
                        return message.channel.send(im).then(async msg => {
                            const nemoji = await promptMessage(msg, message.author, null, ['❌']);
                            if (nemoji === '❌') msg.delete()
                        });
                    

                    } else if (emoji === '⛑') {
                        msg.delete();
                        const ia = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .setAuthor(`⛑Admin help!`, bot.user.displayAvatarURL)
                        .addField("Admin [2]:", "`blacklist` | `say` | `eval` | `shutdown`")
                        return message.channel.send(ia).then(async msg => {
                            const nemoji = await promptMessage(msg, message.author, null, ['❌']);
                            if (nemoji === '❌') msg.delete()
                        });
    

                    } else if (emoji === '❌') {
                        msg.delete();
                    }
                });
            }
    

            


        function getCMD(bot, message, input, con) {
            const embed = new Discord.RichEmbed()

            const cmd = bot.commands.get(input.toLowerCase()) || bot.commands.get(bot.aliases.get(input.toLowerCase()));
            
            let info = `No information found for command **${input.toLowerCase()}**`;

            if (!cmd) {
                return message.channel.send(embed.setColor("RED").setDescription(info));
            }

            if (cmd.name) info = `**Command name**: ${cmd.name}`;
            if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
            if (cmd.description) info += `\n**Description**: ${cmd.description}`;
            if (cmd.usage) {
                info += `\n**Usage**: ${cmd.usage}`;
                embed.setFooter(`Syntax: <> = required, [] = optional`, icon);
            }   

            return message.channel.send(embed.setColor("#E7D774").setDescription(info));
        }
    }
}

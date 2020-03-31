const Discord = require("discord.js");
const config = require("../../config.json")
const emoji = config.emojies
const moment = require('moment');
const fs = require('fs');


module.exports = {
    name: "purge",
    aliases: [],
    category: "moderation",
    description: "Creates a poll in the desired channel.",
    usage: "[command | alias] [#Channel] <amount>",
    run: async (bot, message, args) => {
        // let purge = message.guild.channels.first()
        // if (purge) args.shift()
        // if (!purge) purge = message.guild.channels.find(message.channel.id)
        const logs = bot.channels.get('690242998495215616'); 
        const number = Number(args[0]) === Number(args[0]) ? Number(args[0]) : null;
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("❌ You do not have permissions to purge messages. Please contact a staff member")
        if (number % 1 !== 0) return message.channel.send('Number needs to be a whole number.') 
        if ((number <= 0) || (number >= 100)) return message.channel.send('Number needs to be larger than 1, and smaller than 100.');
        let bulk; 
        await message.channel.bulkDelete(number + 1).then(total => bulk = total).catch(console.error);
        let bulkS = bulk.size
        
            

                //Embed
                const E = new Discord.RichEmbed()
                if (bulkS == number + 1) {
                E.setColor("GREEN") 
                .setTitle("Purge")
                .setDescription(`Purge Successful!`)
                .addField(`Purged Messages`, `${bulkS}/${number + 1}`, true)
                .addField("Purge Mod", message.author.username, true)
                .addField("Channel Purged", message.channel, true)
                .setTimestamp();
                } else {
                
                E.setColor("RED") 
                .setTitle("Purge")
                .setDescription(`Purge Unsuccessful!`)
                .addField(`Purged Messages`, `${bulkS}/${number + 1}`, true)
                .addField("Purge Mod", message.author.username, true)
                .addField("Channel Purged", message.channel, true)
                .setTimestamp();
                }
                logs.send(E)

                const content = bulk.map(m => `[${moment(Number(m.createdTimestamp))}] ${m.author.tag} (${m.author.id}): ${m.attachments.size ? m.content + m.attachments.map(a => a.url).join`, `
                : m.embeds.length
                ? m.embeds.map(e => `${e.author || ''} ${e.description || ''} ${e.fields.map(f => (f.name + ' ') + ' | ' + (f.value + ' ')).join(', ')} ${e.footer || ''}`).join`,`
                : m.content || ''}`);
                const filename = `./${Date.now()}.txt`;
                fs.writeFileSync(filename, content.join`\n`, 'utf8');


                function d() {
                    fs.unlinkSync(filename)
                }

                logs.send({
                    files: 
                    [{ 
                        attachment: filename, 
                        name: `purged-content-${Date.now()}.txt` 
                    }]
                }).catch(console.error).then(setTimeout(d, 3000));

                return;
                } 
}
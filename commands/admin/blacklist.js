const Discord = require("discord.js");
const config = require("../../config.json")
const mysql = require('mysql');

module.exports = {
    name: "blacklist",
    aliases: ["bl"],
    category: "admin",
    description: "Blacklist",
    usage: "[command | alias] <userid/tag>",
    run: async (bot, message, args, con) => {
		if (!config.serveradmin.includes(message.author.id))
		{
				return message.channel.send('You\'re not allowed to use this command.');			    
		} else {
            let tag = message.mentions.users.first()
            let embed = new Discord.RichEmbed()
            embed.setColor("RANDOM")
            let user = bot.users.get(args[0], (err) => { message.channel.send(`[Error] ${err}`) })
                if(!tag) {
                    const { blacklist } = await con.prepare('SELECT blacklist FROM users WHERE userid = ?').get(args[0]);
                    if (blacklist == null) return message.channel.send(`${user.username} can't be found in our database!`)
                    if (blacklist == 0) {
                        con.prepare('UPDATE users SET blacklist = ? WHERE userid = ?').run(1, args[0]);
                        embed.setTitle("Blacklisted added.")
                        embed.addField(`**UserID**`, args[0])
                        message.channel.send(embed)
                } else {
                    con.prepare('UPDATE users SET blacklist = ? WHERE userid = ?').run(0, args[0]);
                    embed.setTitle("Blacklist removed.")
                    embed.addField(`**UserID**`, args[0])
                    message.channel.send(embed)
                }
            } else {
                const { blacklist } = await con.prepare('SELECT blacklist FROM users WHERE userid = ?').get(tag.id);
                if (blacklist == null) return message.channel.send(`${tag.username} can't be found in our database!`)
                if (blacklist == 0) {
                    con.prepare('UPDATE users SET blacklist = ? WHERE userid = ?').run(1, tag.id);
                    embed.setTitle("Blacklisted added.")
                    embed.addField(`**UserID**`, tag.id)
                    message.channel.send(embed)
                } else {
                    con.prepare('UPDATE users SET blacklist = ? WHERE userid = ?').run(0, tag.id);
                    embed.setTitle("Blacklist removed.")
                    embed.addField(`**UserID**`, tag.id)
                    message.channel.send(embed)
                }
            }
        }
    } 
}


        
 
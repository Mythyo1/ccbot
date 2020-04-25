const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
var util = require('bot-utils')
const fs = require('fs')
const { getMember } = require('../../functions.js')

module.exports = {
    name: "level",
    aliases: ["stats"],
    category: "misc",
    description: "Check your level",
    usage: "[command | alias] [member]",
    run: async (bot, message, args, con) => {
        const m = getMember(message, args[0]);
        const row = await con.prepare('SELECT * FROM users WHERE userid = ?').get(m.id)
        if(!row) return message.channel.send("You're not ranked! Send a message to get ranked!")
        const lvl = await con.prepare('SELECT level FROM users WHERE userid = ?').get(m.id)
        const totalxp = await con.prepare('SELECT xp FROM users WHERE userid = ?').get(m.id)
        const txp = Math.pow((3 * (lvl.level + 1)), 2)
        console.log(`Level + 1: ${lvl.level + 1} TotalXP: ${totalxp.xp}`)
        const member = bot.users.get(m.id)
        
        const e = new Discord.RichEmbed()
        .setTitle(`${member.username}'s Stats!`)
        .setColor("RANDOM")
        .addField("**Level:** ", lvl.level, true)
        .addField("**XP:** ", `${totalxp.xp}/${txp}`)
        message.channel.send(e)
    }
}
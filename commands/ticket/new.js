const config = require('../../config.json');
const randomstring = require("randomstring");
const Discord = require("discord.js");

module.exports = {
  name: "new",
  aliases: ["ticket", "create"],
  category: "ticket",
  description: "Ticket!",
  usage: "[command | alias] [Reason]",
  run: async (bot, message, args, con) => {
    let reason = args.join(' ')
    if(!reason) reason = "No reason was specified!"
    let numbers = randomstring.generate({
        length: 4,
        charset: 'numeric'
    });
    const name = `ticket-${numbers}`;
    let row = await con.prepare('SELECT * FROM tickets WHERE userid = ?').get(message.author.id);
    if (!row) {
        message.guild.createChannel(name, { type: "text" }).then(
            (chan) => {
            chan.overwritePermissions(message.guild.roles.find('name', '@everyone'), {
            'VIEW_CHANNEL': false
            })
            chan.overwritePermissions(message.guild.roles.find('name', 'Support Team'), {
                'VIEW_CHANNEL': true
            })
            chan.overwritePermissions(message.author.id, {'VIEW_CHANNEL': true, 'SEND_MESSAGES': true, 'MENTION_EVERYONE': false})
            let category = message.guild.channels.find(c => c.name == "Tickets" && c.type == "category");
            if(!category) return message.channel.send(categorysend)
            message.channel.send(`> <#${chan.id}> has been created!`)
            const e = new Discord.RichEmbed()
            .setTitle(`Welcome ${message.author.username}!`)
            .setDescription("A staff member should be with you within 10 minutes! Depending wether we're online or not. Meanwhile we'd appriciate if you described your problem in more detail.")
            .addField("**Reason:**", reason)
            .setColor("RANDOM")
            .setFooter("Thank you for contacting us!", message.author.displayAvatarURL)
            .setTimestamp();
            chan.send(e)
            con.prepare('INSERT INTO tickets (userid, name, channelid) VALUES (?, ?, ?)').run(message.author.id, name, chan.id);
        })
    } else {
        const id = await con.prepare('SELECT channelid FROM tickets WHERE userid = ?').get(message.author.id);
        return message.channel.send(`> You've already have a ticket open! Ticket: <#${id.channelid}>`)
    }
  }
}
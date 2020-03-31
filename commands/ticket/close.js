const config = require("../../config.json");
const randomstring = require("randomstring");
const Discord = require("discord.js");
const { promptMessage } = require("../../functions.js");

module.exports = {
  name: "close",
  aliases: ["delete", "end"],
  category: "ticket",
  description: "Close a ticket!",
  usage: "[command | alias] [Reason]",
  run: async (bot, message, args, con) => {
    const logs = message.guild.channels.get('692576266896932914'); 
    let reason = args.join(' ')
    if(!reason) reason = "No reason was specified!"
    const channelid = await con.prepare('SELECT channelid FROM tickets WHERE channelid = ?').get(message.channel.id);
    if (!channelid) {
        message.channel.send("You can only use this command in a ticket!")
    } else {
        if(!message.member.roles.has('692398287705079838')) return message.channel.send('> A support team member will close the ticket for you!')
        const userid = await con.prepare('SELECT userid FROM tickets WHERE channelid = ?').get(message.channel.id)
        const promptEmbed = new Discord.RichEmbed()
        .setColor("GREEN")
        .setAuthor(`This verification becomes invalid after 30s.`)
        .setDescription(`Do you want to close the ticket?`)
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reaction collector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                const user = bot.users.get(userid.userid);
                msg.delete();
                const e = new Discord.RichEmbed()
                .setColor("RANDOM")
                .setTitle("Thank you for contacting support!")
                .setDescription(`Your ticket was closed for\n\n${reason}`)
                .setTimestamp();
                user.send(e)

                const channelname = await con.prepare('SELECT name FROM tickets WHERE channelid = ?').get(message.channel.id);

                const embed = new Discord.RichEmbed()
                .setColor("RED")
                .setTitle("Ticket Closed!")
                .setDescription(`Ticket was closed for\n\n${reason}`)
                .addField(`User:`, user.username, true)
                .addField(`Ticket:`, channelname.name, true)
                .setTimestamp();
                logs.send(embed);
                con.prepare('DELETE FROM tickets WHERE channelid = ?').get(message.channel.id);
                const fetch = message.guild.channels.get(message.channel.id)
                fetch.delete();
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Ticket closure canceled.`)
                    .then(m => m.delete(10000));
                }
            });
        }
    }
}

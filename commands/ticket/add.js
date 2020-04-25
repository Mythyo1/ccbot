const { getMember } = require("../../functions.js");
const { RichEmbed } = require('discord.js');

module.exports = {
    name: "add",
    aliases: [],
    description: "Add a user to the ticket",
    usage: "[username | id | mention]",
    run: async (bot, message, args, con) => {
        const member = getMember(message, args[0]);
        const user = await con.prepare('SELECT * FROM tickets WHERE userid = ?').get(message.author.id);
        const channelid = await con.prepare('SELECT * FROM tickets WHERE channelid = ?').get(message.channel.id);
        if(!channelid.channelid) return message.channel.send('> You may only use this command in a ticket.')
        if(!channelid.userid == message.author.id || !message.member.roles.has('692398287705079838')) return message.channel.send('> You\'re not allowed to use this command!')
        if(!args[0]) return message.channel.send('> Please provide a tag/username/userid!')
        if(message.channel.permissionsFor(member).has('VIEW_CHANNEL')) return message.channel.send(`> User ${member.user} has already been added to the ticket!`)
        message.channel.overwritePermissions(member, {'VIEW_CHANNEL': true, 'SEND_MESSAGES': true, 'MENTION_EVERYONE': false})
            let category = message.guild.channels.find(c => c.name == "Tickets" && c.type == "category");
            if(!category) return message.channel.send(categorysend)
            message.channel.send(`> Member: ${member.user} was added to the ticket | <#${message.channel.id}>!`)
    }
}
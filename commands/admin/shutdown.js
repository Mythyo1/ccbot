const config = require('../../config.json');
const Discord = require('discord.js');
const { wait } = require('../../functions.js');

module.exports = {
  name: "shutdown",
  aliases: ["sd"],
  category: "admin",
  description: "shutdown",
  usage: "[command | alias]",
  run: async (bot, message, args) => {
    if (!config.serveradmin.includes(message.author.id)) return message.channel.send('You\'re not allowed to use this command.');			    
    const e = new Discord.RichEmbed()
    .setTitle(`${Math.floor(bot.ping)} ms`)
    .setColor("RANDOM")
    .setFooter("Shutting down.")
    message.channel.send(e).then(mesg => {
      wait(4000)
      setTimeout(process.exit(0), (err) => { message.channel.send(`[ERROR] ${err}`)}, 4000);
    }) 
  }
}                                        
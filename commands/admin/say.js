const config = require('../../config.json');

module.exports = {
  name: "say",
  aliases: ["tell"],
  category: "admin",
  description: "Trolling",
  usage: "[command | alias] <args>",
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have the required permissions to use this command.").then(m => m.delete(5000));
    if (!args.length >= 2) return message.reply("Invalid syntax: `pm!say <id/tag> <text>").then(m => m.delete(5000));

    let user = message.author.id
    if(!user) user = message.mentions.users.first()
    if(!user) user = bot.users.get(args[0], (err) => { message.channel.send(`[Error] ${err}`) })
    if(user != message.author.id) args.shift() 
    if(user == message.author.id) user = bot.users.get(message.author.id)
      let m = args.join(' ')
      message.delete().catch(() => {});
      message.channel.createWebhook('Say')
        .then(async (webhook) => {
        await webhook.sendMessage(m, {
        username: user.username,
        avatarURL: user.displayAvatarURL,     
      })
        .then(webhook.delete());
    });
  }
}                   
                        
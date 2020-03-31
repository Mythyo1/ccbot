const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
var util = require('bot-utils')
const fs = require('fs')

module.exports = {
    name: "suggest",
    aliases: ["suggestion", "sggt"],
    category: "feedback",
    description: "Suggestions ..",
    usage: "[command | alias] <Suggestion>",
    run: async (bot, message, args) => {

        const channel = bot.channels.get('692030022650953897');
        let icon = message.author.displayAvatarURL;

        channel.createWebhook('Suggestion')
          .then(async (webhook) => {
            webhook.send({
              username: message.author.username,
              avatarURL: message.author.displayAvatarURL,
                embeds: [
                  {
                    color: 15193972,
                    fields: [
                      {
                        name: "**Suggestion:**",
                        value: args.join(" ")
                      }
                    ],
                    footer: {
                      text: "Coding Community™️",
                      icon_url: icon
                    }
                  }
                ]
            })
            .then(async (msg) => {
              await msg.react('⬆️');
              await msg.react('⬇️');
              if (message.channel.id !== channel.id) await message.channel.send(`<@${message.author.id}>, your suggestion has been sent to the developers.`) 
              await webhook.delete();
              if (message.channel.id === channel.id) message.delete().catch(() => {});
            });
          });
    }
}

const { RichEmbed } = require('discord.js');
const snek = require('snekfetch');

module.exports = {
  name: "graph",
  aliases: [],
  category: "covid",
  description: "Check country stats for covid-19",
  usage: "[command | alias]",
  run: async (bot, message, args) => {
    
    let embed = new RichEmbed()
    .setTitle('An error has occured!')
    .setColor("RED")
    .setDescription('A country by this name may not exist! Please type exactly how it\'s typed on [here](https://trackcovid.xyz/countries)')

    let api = ' https://corona.lmao.ninja/v2/countries?yesterday=true&sort=todayCases'
    snek.get(api).then(r => { 
        let body = r.body


        let data = body.find(get => get.country.toLowerCase() == args.join(' ').toLowerCase())
        if(!data) message.channel.send(embed)
        
    })
  }
}
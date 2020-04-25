const { RichEmbed } = require('discord.js');
const snek = require('snekfetch');

module.exports = {
  name: "global",
  aliases: ["glo", "covidglobal"],
  category: "covid",
  description: "Check global stats for covid-19",
  usage: "[command | alias]",
  run: async (bot, message, args) => {
    let e = new RichEmbed()
        let api = 'https://api.trackcovid.xyz/all'
        snek.get(api).then(r => { 
            const data = r.body
            const e = new RichEmbed()
            if(data.deaths >= data.recovered) e.setColor("RED")
            if(data.deaths <= data.recovered) e.setColor("GREEN")
            if(data.deaths <= data.cases) e.setColor("GOlD")
              e.setTitle('Covid-19 Global Stats.')
              e.setDescription('A big thanks to 酒。#0001 for their [api](https://api.trackcovid.xyz/)!')
              e.addField('**Cases:**', data.cases, true)
              e.addField('**Deaths:**', data.deaths, true)
              e.addField('**Recovered:**', data.recovered, true)
              e.addField('**Active:**', data.active, true)
              e.addField('**Affected Countries:**', data.affectedCountries, true);
            message.channel.send(e)
      })
  }
}
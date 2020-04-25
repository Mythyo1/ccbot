const { RichEmbed } = require('discord.js');
const snek = require('snekfetch');

module.exports = {
  name: "country",
  aliases: ["covidcountry", "c"],
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

        
        console.log(data)
        const e = new RichEmbed()
        if(data.active >= 7500) e.setColor("RED") 
        if(data.active >= 3000 && data.active <= 7499) e.setColor("GOLD") 
        if(data.active <= 2999) e.setColor("GREEN") 
        e.setThumbnail(data.countryInfo.flag)
        e.setTitle('Covid-19 Country Stats.')
        e.setDescription('A big thanks to `酒。#0001` for their [api](https://api.trackcovid.xyz/)!')
        e.addField('**Country:**', data.country)
        e.addField('**Cases Today:**', data.todayCases, true)
        e.addField('**Cases:**', data.cases, true)
        e.addField('**Cases/Million:**', data.casesPerOneMillion, true)
        e.addField('**Deaths Today:**', data.todayDeaths, true)
        e.addField('**Deaths:**', data.deaths, true)
        e.addField('**Deaths/Millon:**', data.deathsPerOneMillion, true)
        e.addField('**Active:**', data.active, true)
        e.addField('**Recovered:**', data.recovered, true)
        e.addField('**Critical:**', data.critical,true)

        message.channel.send(e)
    })
  }
}
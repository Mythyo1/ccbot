const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");
const mysql = require("mysql");
const ascii = require("ascii-table");
const { xp } = require("./functions.js");
const Canvas = require('canvas');

const Database = require('./handlers/Database');
const con = new Database({
    connectionLimit: 20,
    host: '',
    user: '',
    password: '',
    database: '',
})

// Collections
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.categories = new Discord.Collection();

// Run the command loader
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(bot);
});

bot.on("ready", async () => {
    console.log(`[LOGS] Logged in to ${bot.user.username} (${bot.guilds.size} servers - ${bot.users.size} users)`)
    bot.user.setActivity('Coding Community!', {type: "WATCHING"});
    // const general = bot.channels.get('690800479634194463');
    const Welcome = bot.channels.get('690226792941879302');

    bot.on("guildMemberAdd", async (member) => {
        Welcome.send(`Welcome ${member} to ${member.guild}. Have a read off <#690226887456325696>`) // Send message to general text channel
    });


    bot.on('message', async (message) => {  
    
        if (message.author.bot) return;
        let urow = await con.prepare('SELECT * FROM users WHERE userid = ?').get(message.author.id);
        if (!urow) await con.prepare('INSERT INTO users (userid, blacklist, balance, xp, level) VALUES (?, 0, 0, 0, 0)').run(message.author.id);
        

        const prefix = 'c!'
        const blacklist = await con.prepare('SELECT blacklist FROM users WHERE userid = ?').get(message.author.id);

        if (blacklist.blacklist == 1) return;
        if (message.author.bot) return;
        if (!message.guild) return;

        if (!message.content.startsWith(prefix)) {
            const nowxp = await con.prepare('SELECT xp FROM users WHERE userid = ?').get(message.author.id);
            let newxp = xp() + nowxp.xp
            con.prepare('UPDATE users SET xp = ? WHERE userid = ?').run(newxp, message.author.id);

            const lvl = await con.prepare('SELECT level FROM users WHERE userid = ?').get(message.author.id);
            let lvlup = Math.pow((3 * (lvl.level + 1)), 2)
            const checkxp = await con.prepare('SELECT xp FROM users WHERE userid = ?').get(message.author.id);
            console.log(`checkxp.xp = ${checkxp.xp} | lvlup = ${lvlup} | nowxp.xp = ${nowxp.xp}`)

            if (checkxp.xp >= lvlup) {
                const nowlvl = await con.prepare('SELECT level FROM users WHERE userid = ?').get(message.author.id);
                con.prepare('UPDATE users SET level = ? WHERE userid = ?').run(nowlvl.level += 1, message.author.id);
                con.prepare('UPDATE users SET xp = ? WHERE userid = ?').run(0, message.author.id);
                const e = new Discord.RichEmbed()
                .setTitle(`${message.author.username} has leveled up!`)
                .setColor("RANDOM")
                .setFooter('Continue Chatting!', message.author.displayAvatarURL)
                .setTimestamp();
                message.channel.send(e).then(message.react('🆙'))
            } else {
                return;
            }
        } else {
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
            
            if (cmd.length === 0) return;
            
            // Get the command
            let command = bot.commands.get(cmd);
            // If none is found, try to find it by alias
            if (!command) command = bot.commands.get(bot.aliases.get(cmd));

            // If a command is finally found, run the command
            if (command) 
            command.run(bot, message, args, con);
        }
    });
});


bot.login(config.token)
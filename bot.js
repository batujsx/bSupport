const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const fs = require("fs");
require("./util/eventLoader.js")(client);
const db = require("quick.db");
//-----------------------------------------------\\

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (ayarlar.sahip.includes(message.author.id)) permlvl = 4; 
  return permlvl;
};


var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.mine(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.mine(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.mine(regToken, "that was redacted")));
});

client.login(ayarlar.token);
//---------------------------------|Komutlar|---------------------------------\\
//Geliştirici: BatuhanACAR & Furtsy - Destek 

client.on('message', async msg => {
let sahip = 'id' //ELLEME
  const reason = msg.content.split(" ").slice(1).join(" ");
  if (msg.channel.id === '877620546299392070') { //Destek kanal id
    if(msg.author.id === sahip) return
    if(msg.author.bot) return
    
    if(msg.guild.channels.get(await db.fetch(`destek_${msg.author.id}`))) {
      msg.delete()
      return msg.guild.channels.get(await db.fetch(`destek_${msg.author.id}`)).send(msg.author + " Aktif bir destek talebin bulunmakta.")
    } 
    if(msg.guild.channels.get('877620546299392070')) {// Destek kanal id
      msg.guild.createChannel(`destek-${msg.author.username}`, "text").then(async c => {
        db.set(`destek_${msg.author.id}`, c.id)
      const category = msg.guild.channels.get('877613293659893771') // Destek kategorisi
      c.setParent(category.id)
      let role = msg.guild.roles.get("877271150214930472");//üye yetkisi ıd
      let role2 = msg.guild.roles.find("name", "@everyone");
      await c.overwritePermissions(role, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });
      await c.overwritePermissions(role2, {
          SEND_MESSAGES: false,
          READ_MESSAGES: false
      });
      await c.overwritePermissions(msg.author, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });
    
      const embed = new Discord.RichEmbed()         
      .setColor("GREEN")
      .setDescription(`Selam! <@${msg.author.id}> biletiniz oluşturuldu en kısa süre içerisinde aktif olan bir __MELODİA__ Yetkilisi sizinle ilgilenecektir. Ne için talep oluşturduğunuzu detaylı anlatmayı unutmayın. \n \n> Talep Bilgileri \nTalep Konusu __:__ **${msg.content}** \nTalep Oluşturan __:__ <@${msg.author.id}> \n \nDestek Yetkilileri seninle buradan iletişime geçecektir.`)
      .setAuthor('Bilet oluşturuldu', 'https://media.discordapp.net/attachments/874733956296216607/875932802565173258/logo1.png')
	  .setImage("https://media.discordapp.net/attachments/874733956296216607/875932802565173258/logo1.png")
      .setFooter('Developer by batuhanacar', 'https://cdn.discordapp.com/attachments/874733956296216607/875933863539539988/tumblr_1d3c78abfbdf4e12e660c4b741c4f200_2d397832_1280.jpg');
      await c.send({ embed: embed });
      await c.send(`<@${msg.author.id}> , <@&877631882676805682>`)
      msg.delete()
      db.set(`talep_${c.id}`, msg.content)
      db.set(`kullanici_${c.id}`, msg.author.id)
      }).catch(console.error);
    }
  }
});
  



client.on("message", message => {
if (message.channel.name.startsWith(`destek-`)) {
}
})



client.on("message", message => {
if (message.content.toLowerCase() === "!kapat") {
    if (!message.channel.name.startsWith(`destek-`)) return
  
    let yetki = false;
  
    if (message.member.roles.has("877555264205758535")) yetki = true; //Talep yetkilisi ID
    else yetki = false;
  
  if (yetki == false) return message.channel.send("Destek taleplerini yalnızca yetkililer kapatabilir.");
  
    if(message.author.bot) return
    var deneme = new Discord.RichEmbed()
    .setColor("#f0393b")
    .setAuthor(`Bilet kapatma`)
    .setDescription(`Bileti kapatılması için tekrardan, \n10 saniye içinde \`!kapat\` yazınız.`)
    message.channel.send(deneme)
    .then((m) => {
      message.channel.awaitMessages(response => response.content.toLowerCase() === '!kapat', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then(async (collected) => {
          message.channel.delete();
        const embed = new Discord.RichEmbed()
		  .setAuthor('DESTEK LOG', 'https://media.discordapp.net/attachments/874733956296216607/875932802565173258/logo1.png')
          .setColor('#494747')
          .setDescription(`> Detaylar \nKapatan: ${message.author} \nKapatılan kanal: **${message.channel.name}**`)
          .setThumbnail("https://cdn.discordapp.com/attachments/874733956296216607/875926451218690088/unknown.png")
          .setFooter('Developer by batuhanacar', 'https://media.discordapp.net/attachments/874733956296216607/875933863539539988/tumblr_1d3c78abfbdf4e12e660c4b741c4f200_2d397832_1280.jpg');
          client.channels.get("877613313582825483").send("", embed); //destek kapanınca log atacak kanal id
          db.delete(`talep_${message.channel.id}`)
        })
        .catch(() => {
          m.edit('Destek Talebi kapatma isteğin zaman aşımına uğradı!').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
}
});


//bot tamamen Fursty ve BatuhanACAR'a aittir lisanslıdır.
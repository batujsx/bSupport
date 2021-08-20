const Discord = require('discord.js')
const { RichEmbed } = require('discord.js')
exports.run = (client, message, args) => {

  let mcTR = args.slice().join(' ')
  const Mesaj = new RichEmbed()
    .setColor('BLUE')
	.setAuthor('Destek Talebi', 'https://media.discordapp.net/attachments/874733956296216607/875932802565173258/logo1.png')
    .setThumbnail("https://cdn.discordapp.com/attachments/874733956296216607/877639308285190204/unknown.png")
	.setImage("https://cdn.discordapp.com/attachments/874733956296216607/877639132489326642/Baslksz-3.png")
.setDescription("> Nasıl Destek Talep Oluşturabilirim? \nBu kanala bir mesaj bırakarak `Destek Talep` oluşturabilirsiniz. \n \n> Troll talep cezası \nTroll amaçlı oluşturulan talepler kapatılır ve oluşturan kişiye yasaklanma ya da talep açmama cezası verilir. \n \n> Talep oluşturdum kanal nerede? \nTalep oluşturduktan sonra sana bu kanalın bulunduğu kategoride **talep-** ön ekli bir kanal açılacak oradan destek alabilirsin.")

message.channel.send(Mesaj)
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['destek'],
  permLevel: 2
}

exports.help = {
  name: 'destek'
}

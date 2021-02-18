module.exports = {
  name: 'rep',
  description: 'Reputation stats',
  usage: 'help',
  cooldown: 1,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const Discord = require('discord.js');
    const repController = require('../vitek_db/repController');
    const getMention = require('../vitek_modules/getMention');
    const { prefix } = require('../bot_config.json');

    if(args[0] == 'ranking') {
      repController.getRanking(message.guild.id, message, items => {
        let description = `**Top 10 on** \`\`${message.guild.name}\`\`\n\n\`\`Place | User | Points\`\`\n`;
        if(items.length == 0) { description += '**NONE :(**'; }
        else {
          for(let i = 0; i < items.length; i++) {
            description += `**${i + 1}.** | <@${items[i]._id.user_id}> | ${items[i].value}\n`;
          }
        }

        sendEmbed(`Rep - Top 10 | ${message.guild.name}`, description, message.guild.iconURL());
      });
    }
    else if(args[0] == 'history') {
      let member = null;
      if(!args[1]) member = getMention.member(`<@${message.author.id}>`, message);
      else member = getMention.member(args[1], message);
      if(!member) return message.channel.send('You must select one user that is on the server!');

      repController.getUserHistory(member.id, message.guild.id, message, (items, allPoints, pointsOnServer) => {
        let description = `All points: ${allPoints}\nPoints on \`\`${message.guild.name}\`\`: ${pointsOnServer}\n\n**Last 10 reps:**\n`;

        if(items.length == 0) { description += '**NONE :(**'; }
        else {
          description += '``Value | Reason | Sender``\n';
          for(const item of items) {
            description += `**${item.value}** | *${repController.sliceReason(item.reason)}* | <@${item.sender.user_id}>\n`;
          }
        }

        sendEmbed(`Rep - History | ${getMention.username(member)}`, description, getMention.avatar(member));
      });
    }
    else {
      sendEmbed('Rep - Help', `\`\`${prefix}+rep <@User> <reason>\`\` - Give a positive point to the user
      \`\`${prefix}-rep <@User> <reason>\`\` - Give a negative point to the user
      \`\`${prefix}rep history\`\` - Your rep history
      \`\`${prefix}rep history <@User>\`\` - Check someone's rep history
      \`\`${prefix}rep ranking\`\` - Ranking`);
    }

    function sendEmbed(title, description, thumbnail = null) {
      const embed = new Discord.MessageEmbed()
        .setColor('#fff200')
        .setTitle(title)
        .setThumbnail(thumbnail == null ? message.client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) : thumbnail)
        .setDescription(description);
      message.channel.send(embed);
    }
  },
};
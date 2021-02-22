module.exports = {
  name: 'word',
  description: 'Words usage stats',
  usage: 'help',
  cooldown: 2,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const wordCounter = require('../vitek_db/wordCounter');
    const chartGenerator = require('../vitek_modules/chartGenerator');
    const { sendEmbed } = require('../vitek_modules/embed');

    if(args[0] == 'usage') {
      const _args = message.cleanContent.toLowerCase().split(' ');
      _args.shift();
      _args.shift();
      let words = _args.join(' ').split(',');
      words = words.filter(el => { return el !== null && el !== ''; });
      words = words.map(str => str.trim());
      words = Array.from(new Set(words));
      if(!words[0]) return message.channel.send('You must give atleast one word!');
      console.log(words);
      wordCounter.getUsage(words, message.guild.id, message, (labels, data) => {
        chartGenerator.sendChart(message, data,
          { width: 1500, height: 1000, chartLabels: labels, chartTitle: ['Words usage stats', ' '], unit: '' });
      });
    }
    if(args[0] == 'ranking') {
      if(!args[1].trim()) return message.channel.send('You must give a word!');
      wordCounter.getRanking(args[1].trim().toLowerCase(), message.guild.id, message, (labels, data) => {
        chartGenerator.sendChart(message, data,
          { width: 1500, height: 1000, chartLabels: labels, chartTitle: ['Word usage ranking', ' '], unit: '' });
      });
    }
    else {
      sendEmbed(message, 'Word - Help', `\`.word usage <Word1, Word2, Word3 [...]>\` - Check usage of the specified words
      \`.word ranking <Word>\` - Show the word use for each user`);
    }
  },
};
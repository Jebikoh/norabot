module.exports = {
    name: 'prune',
    description: 'Delete up to 99 messages',
    aliases: ['p'],
    usage: `[command amount]`,
    execute(message, args) {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('That is not a valid number.');
        }
        else if (amount <= 1 || amount > 100) {
            return message.reply('The number must be between 1 and 99.');
        }

        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('Sorry, an error occured. If the problem persists, contact the developer');
        });
    },
};
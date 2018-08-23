module.exports = {
    name: 'ping',
    description: 'A basic ping command to test bot availability',
    aliases: ['p'],
    usage: `[command]`,
    group: 'Basic',
    execute(message, args) {
        message.channel.send('Pong!')
    },
};
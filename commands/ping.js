module.exports = {
    name: 'ping',
    description: 'A basic ping command to test bot availability',
    execute(message, args) {
        message.channel.send('Pong!')
    },
};
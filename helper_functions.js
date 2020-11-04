const { allowedChannels, commandPrefix } = require("./config.json");

exports.userIsAdmin = (user) => user.id === process.env.ADMIN_ID;
exports.onlyAllowedChannels = () => allowedChannels.length > 0;
exports.channelAllowed = (channel) => allowedChannels.includes(channel.name);

exports.parseMessage = (msg) => {
    let hasPrefix = false;
    let messageBody = msg.content;

    if (messageBody.startsWith(commandPrefix)) {
        hasPrefix = true;
        messageBody = messageBody.slice(commandPrefix.length);
    }

    messageBody = messageBody.split(" ");

    return {
        hasPrefix,
        command: messageBody[0],
        arguments: messageBody.slice(1),
        raw: msg,
    };
};

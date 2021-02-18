const fetch = require("node-fetch");

const { global } = require("./global");
const { allowedChannels, commandPrefix } = require("./config.json");

exports.userIsAdmin = (user) => user === global().adminUser;
exports.onlyAllowedChannels = () => allowedChannels.length > 0;
exports.channelAllowed = (channel) => allowedChannels.includes(channel.name);

exports.parseMessage = (msg) => {
    let hasPrefix = false;
    let messageBody = msg.content;

    if (messageBody.startsWith(commandPrefix)) {
        hasPrefix = true;
        messageBody = messageBody.slice(commandPrefix.length);
        console.log(`Number of attachments in command: ${msg.attachments.size}`);
        if (msg.attachments.size === 1) {
            let file = message.attachments[0];
            console.log("Attachment detected!");
            console.log(`URL: ${file.url}`);
        }
    }

    messageBody = messageBody.trim().split(/ +/);

    return {
        hasPrefix,
        command: messageBody[0].toLowerCase(),
        arguments: messageBody.slice(1),
        raw: msg,
    };
};

exports.loadSession = (slug) => {
    const query = JSON.stringify({
        query: `
            {
                session(slug: "${slug}") {
                    date
                    url
                    challenge {
                        name
                        blurb
                    }
                    tracks {
                        name
                        artist
                        duration
                        sessionSubsection
                        url
                    }
                }
            }
        `,
    });
    const response = fetch(global().apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: query,
    })
        .then((r) => r.json())
        .then((r) => r.data.session);
    return response;
};

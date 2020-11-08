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
    // const apiUrl = "https://www.trommelkreis.club/api";
    const apiUrl = "http://localhost:5000/api";
    const response = fetch(apiUrl, {
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

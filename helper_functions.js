const fetch = (...args) => import("node-fetch")
    .then(({ default: fetch }) => fetch(...args));

const { global } = require("./global");

exports.userIsAdmin = (user) => user === global().adminUser;
exports.channelAllowed = (channel) => global().allowedChannel === channel.name;

exports.parseMessage = (msg) => {
    let hasPrefix = false;
    let messageBody = msg.content;
    let files = [];

    if (messageBody.startsWith(global().commandPrefix)) {
        hasPrefix = true;
        messageBody = messageBody.slice(global().commandPrefix.length);
    }

    messageBody = messageBody.trim().split(/ +/);

    if (msg.attachments.size > 0)
        msg.attachments.forEach(file => files.push(file))

    return {
        hasPrefix,
        command: messageBody[0].toLowerCase(),
        arguments: messageBody.slice(1),
        files,
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

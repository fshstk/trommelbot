const { global } = require("./global");

exports.confirmVoiceChannelSetup = () => {
    if (!global().voiceChannel) throw Error("no voice channel specified");
    const permissions = global().voiceChannel.permissionsFor(global().bot.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) throw Error("insufficient privileges");
};

exports.playURL = (urlString) => {
    exports.confirmVoiceChannelSetup();

    global().voiceChannel.join()
        .then((connection) => {
            global().isPlaying = true;
            connection.play(urlString).on("finish", exports.stopPlaying);
        })
        .catch((error) => {
            global().voiceChannel.leave();
            console.error(error);
        });
};

exports.stopPlaying = () => {
    global().isPlaying = false;
    global().voiceChannel.leave();
};

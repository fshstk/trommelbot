const { global } = require("./global");

exports.confirmVoiceChannelSetup = () => {
    if (!global().voiceChannel) throw Error("no voice channel specified");
    const permissions = global().voiceChannel.permissionsFor(global().bot.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) throw Error("insufficient privileges");
};

const cleanup = () => {
    global().voiceChannel.leave();
    // file.delete(); // TODO: implement this
};

const playFileAndCleanup = (connection, file) => {
    const dispatcher = connection.play(file);
    dispatcher.on("end", () => cleanup(file));
};


exports.playURL = (urlString) => {
    assertChannelPermissions();
    // const file = downloadMP3(urlString);
    global().voiceChannel.join()
        .then((connection) => playFileAndCleanup(connection, urlString))
        .catch((error) => console.log(error));
};

exports.stop = () => {

};

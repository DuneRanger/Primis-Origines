const path = require("path");

module.exports.ping1 = async function ping(msg) {
    await msg.channel.send("pong");
}

module.exports.ping2 = async function ping(msg) {
    await msg.channel.send({files: [{attachment: path.resolve("./images/Matus.png"), name: "Matus.png"}]});
}
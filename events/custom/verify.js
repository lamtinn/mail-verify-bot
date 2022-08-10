const client = require("./../../index"),
    Discord = require("discord.js");

const utils = require("./../../utils/utils");

client.on("guildMemberAdd", async (member) => {
    console.log(member.user.tag)
});
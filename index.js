console.clear();

const Discord = require("discord.js"),
    client = new Discord.Client({ intents: 32767 });

const utils = require("./utils/utils"),
    cl = require("chalk");

client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();

process.on("unhandledRejection", (reason, p) => {
    console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.red("Error"), cl.white.bold("Unhandled Rejection/Catch"));
    console.log();
    console.log(reason, p);
});

process.on("uncaughtException", (err, origin) => {
    console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.red("Error"), cl.white.bold("Uncaught Exception/Catch"));
    console.log();
    console.log(err, origin);
});

if (!utils.config.Client.Token) {
    console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.red.bold("Please enter the bot Token in to config.yml!"));
    process.exit(1);
} else {
    console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.white("Checking the token and login!"));
    client.login(utils.config.Client.Token)
        .catch(error => {
            if (error.message.includes("An invalid token was provided")) {
                console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.red("[2/2]"), cl.white.bold("Your bot token is incorrect! Shutting down..."));
            } else {
                console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.red("[2/2]"), cl.white.bold("An error occured while attempting to login to the bot!"));
                console.log(error);
            };
            process.exit();
        });
    ['index'].forEach(handler => require(`./handlers/${handler}`)(client));
};

module.exports = client;
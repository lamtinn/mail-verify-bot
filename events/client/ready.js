const client = require("./../../index"),
  cl = require("chalk");

const utils = require("../../utils/utils");

client.on("ready", async () => {
  const guildServer = client.guilds.cache.get(utils.config.Guild.ID);

  if (!guildServer) {
    console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.white("Invalid guild with id"), cl.red.bold(utils.config.Guild.ID));
    process.exit(1);
  };

  console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.white("Connected to"), cl.green(client.user.tag));
  console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.white("In guild"), cl.yellow(guildServer.name || "None"));
});


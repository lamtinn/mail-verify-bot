const { glob } = require("glob"),
  { promisify } = require("util"),
  Load = promisify(glob);

const utils = require("./../utils/utils"),
  cl = require("chalk");

module.exports = async (client) => {
  console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.green("Valid token. Logged in successfully!"))

  const events = await Load(`${process.cwd()}/events/**/*.js`);
  events.map((value) => require(value));
  console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.white("Successfully loaded"), cl.green.bold(events.length), cl.white(events.length > 1 ? "events!" : "event!"));
  
  const sl_cmds = [], cmds = await Load(`${process.cwd()}/SlashCommands/*/*.js`);
  cmds.map((value) => {
    const file = require(value);
    if (!file?.name) return;
    client.slashCommands.set(file.name, file);
    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
    sl_cmds.push(file);
  });
  console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.white("Successfully loaded"), cl.green.bold(sl_cmds.length), cl.white(sl_cmds.length > 1 ? "commands!" : "command!"));
  
  client.on("ready", async () => {
    if (!utils.config.Guild.ID) {
      console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.white("Guild ID in config file is missing!"));
      console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.red("Couldn't find Guild ID to set the Slash Cmds"));
      console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.red("Enter your Guild ID in config.yml now!"));
      process.exit();
    } else {
      await client.guilds.cache.get(utils.config.Guild.ID).commands.set(sl_cmds);
    };
  });
};
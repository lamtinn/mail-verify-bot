const fs = require("fs"),
    yaml = require("js-yaml");

module.exports = {
    config: yaml.load(
        fs.readFileSync("./configs/config.yml", "utf8")
    ),
};
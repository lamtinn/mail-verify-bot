const fs = require("fs"),
    yaml = require("js-yaml");

const cf = yaml.load(fs.readFileSync("./configs/config.yml", "utf8")),
    nodemailer = require("nodemailer"),
    path = require("path");

module.exports = {
    config: yaml.load(
        fs.readFileSync("./configs/config.yml", "utf8")
    ),
    CodeGenerate: function (n) {
        var add = 1, max = 12 - add;
        if (n > max) {
            return CodeGenerate(max) + CodeGenerate(n - max);
        };
        max = Math.pow(10, n + add);
        var min = max / 10,
            number = Math.floor(Math.random() * (max - min + 1)) + min;
        return ("" + number).substring(add);
    },
    Transporter: nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: cf.Mail.Email,
                pass: cf.Mail.Password
            },
            tls: {
                rejectUnauthorized: false
            },
        },
    ),
    handlebarOptions: {
        viewEngine: {
            partialsDir: path.resolve("./assets/mail/"),
            defaultLayout: false,
        },
        viewPath: path.resolve("./assets/mail/"),
    },
};
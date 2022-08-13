const client = require("./../../index"),
    Discord = require("discord.js"),
    hbs = require('nodemailer-express-handlebars');

const utils = require("./../../utils/utils"),
    cl = require("chalk");

client.on("guildMemberAdd", async (member) => {
    const verfiyCode = utils.CodeGenerate(6);
    let startVerify_embed = new Discord.MessageEmbed()
        .setTitle("✅ START VERIFICATION")
        .setColor("#00FF94")
        .setDescription("**[1] Content:**\n> To complete the **access** to the server. You must\n> complete the required __authentication__ steps!\n> \n> Follow the *instructions below*! Thanks <3\n**[2] Information:**\n> __**User:**__ {user_tag}\n> (`{user_id}`)"
            .replace("{user_tag}", `<@${member.user.id}>`)
            .replace("{user_id}", member.user.id)
        )
        .setTimestamp()
        .setFooter({
            text: `The process will cancel in ${Math.round(utils.config.Verify.ConfirmTime / 60)} minutes!`,
            iconURL: member.user.displayAvatarURL()
        })
        .addFields({
            name: "📌 __**Confirm**__",
            value: "```Click the button at the bottom!```",
            inline: true
        })
    
    ConfirmButton = new Discord.MessageButton()
        .setCustomId("verify-confirm")
        .setLabel("Verify")
        .setStyle("SUCCESS")
        .setEmoji("💸")
    
    const row = new Discord.MessageActionRow()
        .addComponents(ConfirmButton);
    
    const verifyMsg = await member.send({
        embeds: [startVerify_embed],
        components: [row]
    })
        .catch(error => console.log(error));
    const verifyCollector = verifyMsg.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: utils.config.Verify.ConfirmTime * 1000,
        errors: ['time']
    });

    verifyCollector.on("collect", async (i) => {
        switch (i.customId) {
            case "verify-confirm":
                await MailCollector(verifyMsg);
                break;
        };
    });

    verifyCollector.on("end", collected => {
        if (collected.size == 0) {
            switch (utils.config.Punishment.ConfirmTimeOut.Type) {
                case "BAN":
                    verifyMsg.delete();
                    let ConfirmTimeOutBan_embed = new Discord.MessageEmbed()
                        .setTitle("🔴 YOU HAVE BEEN KICKED")
                        .setColor("#FF0834")
                        .setDescription("**[1] Content:**\n> The specified __confirmation time__ has elapsed, and\n> you have received the **punishment** from the server!\n**[2] Information:**\n> __**User:**__ {user_tag}\n> (`{user_id}`)\n> __**Punishment Type:**__ `Ban`"
                            .replace("{user_tag}", `<@${member.user.id}>`)
                            .replace("{user_id}", member.user.id)
                        )
                        .setTimestamp()
                        .setFooter({
                            text: `Requested by ${member.user.tag}`,
                            iconURL: member.user.displayAvatarURL()
                        })
                        .addFields({
                            name: "📝 __**Reason**__",
                            value: "```{reason}```"
                                .replace("{reason}", utils.config.Punishment.ConfirmTimeOut.Reason || "None"),
                            inline: true
                        })
                    member.send({ embeds: [ConfirmTimeOutBan_embed] })
                        .catch(error => console.log(error));
                    member.ban({ reason: utils.config.Punishment.ConfirmTimeOut.Reason || "None" })
                        .catch(error => console.log(error));
                    break;
                case "KICK":
                    verifyMsg.delete();
                    let ConfirmTimeOutKick_embed = new Discord.MessageEmbed()
                        .setTitle("🔴 YOU HAVE BEEN KICKED")
                        .setColor("#FF0834")
                        .setDescription("**[1] Content:**\n> The specified __confirmation time__ has elapsed, and\n> you have received the **punishment** from the server!\n**[2] Information:**\n> __**User:**__ {user_tag}\n> (`{user_id}`)\n> __**Punishment Type:**__ `Kick`"
                            .replace("{user_tag}", `<@${member.user.id}>`)
                            .replace("{user_id}", member.user.id)
                        )
                        .setTimestamp()
                        .setFooter({
                            text: `Requested by ${member.user.tag}`,
                            iconURL: member.user.displayAvatarURL()
                        })
                        .addFields({
                            name: "📝 __**Reason**__",
                            value: "```{reason}```"
                                .replace("{reason}", utils.config.Punishment.ConfirmTimeOut.Reason || "None"),
                            inline: true
                        })
                    member.send({ embeds: [ConfirmTimeOutKick_embed] })
                        .catch(error => console.log(error));
                    member.kick({ reason: utils.config.Punishment.ConfirmTimeOut.Reason || "None" })
                        .catch(error => console.log(error));
                    break;
            };
        };
    });

    async function MailCollector() {
        let EnterMail_embed = new Discord.MessageEmbed()
            .setTitle("📬 PLEASE ENTER YOUR MAIL")
            .setColor("#05FFF0")
            .setDescription("**[1] Content:**\n> You have successfully __confirmed__ and\n> will now **proceed** with the verification!\n> \n> Please enter your mail *to verify*!\n**[2] Notice:**\n> You need to enter the **mail address** with the\n> __correct format__, or process will be canceled")
            .setTimestamp()
            .setFooter({
                text: `Requested by ${member.user.tag}`,
                iconURL: member.user.displayAvatarURL()
            })
            .addFields({
                name: "🔖 __**Global Format**__",
                value: "```email@domain.com```",
                inline: true
            })
        const enterMailMsg = await verifyMsg.edit({ embeds: [EnterMail_embed], components: [] })
            .catch(error => console.log(error));

        const enterMail_filter = (message) => {
            if (message.author.id !== member.id) return;
            if (message.content.includes("@")) {
                return true;
            }
            else if (!message.content.includes("@")) {
                let WrongFormat_embed = new Discord.MessageEmbed()
                    .setTitle("❌ WRONG EMAIL FORMAT")
                    .setColor("RED")
                    .setDescription("**[1] Content:**\n> The **email** address you just entered has an\n> __incorrect__ format. So the process was *aborted*!")
                    .setTimestamp()
                    .setFooter({
                        text: `Requested by ${member.user.tag}`,
                        iconURL: member.user.displayAvatarURL()
                    })
                member.send({ embeds: [WrongFormat_embed] })
                    .catch(error => console.log(error));
                return;
            };
        };

        try {
            const enterMail_res = await enterMailMsg.channel.awaitMessages({
                enterMail_filter,
                max: 1,
                time: utils.config.Verify.EnterMailTime * 1000,
                errors: ["time"],
            });

            if (enterMail_res) {
                var mail = enterMail_res.first().content;
                EnterCode(mail, enterMailMsg);
            };
        } catch (error) {     
            if (error == "[object Map]") {
                switch (utils.config.Punishment.EnterMailTimeOut.Type) {
                    case "BAN":
                        member.ban({ reason: utils.config.Punishment.EnterMailTimeOut.Reason || "None" })
                            .catch(error => console.log(error));
                        break;
                    case "KICK":
                        member.kick({ reason: utils.config.Punishment.EnterMailTimeOut.Reason || "None" })
                            .catch(error => console.log(error));
                        break;
                };
            };
            let ProcessCancellation_embed = new Discord.MessageEmbed()
                .setTitle("🔴 PROCESS CANCELLATION")
                .setColor("RED")
                .setDescription("**[1] Content:**\n> The current process has been **suspended**,\n> you can check the __reason__ right below!\n**[2] Logs:**\n```" + error + "```")
                .setTimestamp()
                .setFooter({
                    text: `Requested by ${member.user.tag}`,
                    iconURL: member.user.displayAvatarURL()
                })
            enterMailMsg.edit({ embeds: [ProcessCancellation_embed] })
                .catch(error => console.log(error));
        };
    };

    async function EnterCode(mail, enterMailMsg) {
        utils.Transporter.use('compile', hbs(utils.handlebarOptions));
        var mailOptions = {
            from: utils.config.Mail.Config.From,
            to: mail,
            subject: "Your verify code!",
            template: "verify-code",
            context: {
                user_tag: member.user.tag,
                guild_name: client.guilds.cache.get(utils.config.Guild.ID).name,
                time: Math.round(utils.config.Verify.EnterCodeTime / 60),
                verify_code: verfiyCode
            },
        };
        utils.Transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.red("Error"), cl.white.bold("Sending mail to"), cl.red.bold(mail), cl.white.bold("failed!"));
                console.log(error);
            };
        });
        let EnterCode_embed = new Discord.MessageEmbed()
            .setTitle("📝 ENTER YOUR VERIFY CODE")
            .setColor("GOLD")
            .setDescription("**[1] Content:**\n> We have sent an email **containing** a\n> __verification__ code. Please check your\n> mailbox and *enter* the verification code!\n**[2] Information:**\n> __**Mail:**__ ```{mail}```"
                .replace("{mail}", mail)
            )
            .setTimestamp()
            .setFooter({
                text: `Requested by ${member.user.tag}`,
                iconURL: member.user.displayAvatarURL()
            })
        const enterCode_msg = await member.send({ embeds: [EnterCode_embed] })
            .catch(error => console.log(error));

        const enterCode_filter = (message) => {
            if (message.author.id !== member.id) return;
            if (message.content === verfiyCode) {
                return true;
            }
            else if (message.content !== verfiyCode) {
                let WrongVerifyCode_embed = new Discord.MessageEmbed()
                    .setTitle("❌ WRONG VERIFY CODE")
                    .setColor("RED")
                    .setDescription("**[1] Content:**\n> The __verification__ code you just entered\n> does not match the verification **code**\n> that was sent. Please check again!")
                    .setTimestamp()
                    .setFooter({
                        text: `Requested by ${member.user.tag}`,
                        iconURL: member.user.displayAvatarURL()
                    })
                member.send({ embeds: [WrongVerifyCode_embed] })
                    .catch(error => console.log(error));
                return;
            };
        };

        try {
            const enterCode_res = await enterCode_msg.channel.awaitMessages({
                enterCode_filter,
                max: 1,
                time: utils.config.Verify.EnterCodeTime * 1000,
                errors: ["time"],
            });
            if (enterCode_res) {
                let VerifySuccess_embed = new Discord.MessageEmbed()
                    .setTitle("✅ VERIFICATION COMPLETED")
                    .setColor("GREEN")
                    .setDescription("**[1] Content:**\n> The verification code you just entered is\n> correct, the verification was successful!\n> You can go back to discord right now!\n**[2] Information:**\n> __**User:**__ {user_tag}\n> (`{user_id}`)\n> __**Status:**__ `✅ Success`"
                        .replace("{user_tag}", `<@${member.user.id}>`)
                        .replace("{user_id}", member.user.id)
                    )
                    .setTimestamp()
                    .setFooter({
                        text: `Requested by ${member.user.tag}`,
                        iconURL: member.user.displayAvatarURL()
                    })
                const successMsg = await member.send({ embeds: [VerifySuccess_embed] })
                    .catch(error => console.log(error))
                for (let roleID of utils.config.Guild.Role.VerifyRole) {
                    try {
                        member.roles.add(roleID);
                    } catch (error) {
                        console.log(cl.gray(`[${new Date().toLocaleString()}]`), cl.green.bold("[MailVerify]"), cl.white("Error when adding role"), cl.red.bold(roleID), cl.white("for user"), cl.red.bold(member.user.tag));
                        console.log(error);
                        return;
                    };
                };
                setTimeout(() => {
                    for (let msg of [verifyMsg, enterMailMsg, enterCode_msg, successMsg]) {
                        try {
                            msg.delete()
                        } catch (error) {
                            return;
                        };
                    };
                }, 15000)
            };
        } catch (err) {
            if (err == "[object Map]") {
                switch (utils.config.Punishment.EnterCodeTimeOut.Type) {
                    case "BAN":
                        member.ban({ reason: utils.config.Punishment.EnterCodeTimeOut.Reason || "None" })
                            .catch(error => console.log(error));
                        break;
                    case "KICK":
                        member.kick({ reason: utils.config.Punishment.EnterCodeTimeOut.Reason || "None" })
                            .catch(error => console.log(error));
                        break;
                };
            };
            let ProcessCancellation_embed = new Discord.MessageEmbed()
                .setTitle("🔴 PROCESS CANCELLATION")
                .setColor("RED")
                .setDescription("**[1] Content:**\n> The current process has been **suspended**,\n> you can check the __reason__ right below!\n**[2] Logs:**\n```" + err + "```")
                .setTimestamp()
                .setFooter({
                    text: `Requested by ${member.user.tag}`,
                    iconURL: member.user.displayAvatarURL()
                })
            enterCode_msg.edit({ embeds: [ProcessCancellation_embed] })
                .catch(error => console.log(error));
        };
    };
});
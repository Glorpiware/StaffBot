const { SlashCommandBuilder } = require('discord.js');
const RCON = require('../../rcon');
const fs = require('fs');
const path = require('path');
const ENV = process.env;

let PATH = path.join(
    process.cwd(),
    'users.json'
);

let CommandData = new SlashCommandBuilder()
        .setName('username')
        .setDescription('Whitelist your minecraft account and connect your discord!')
        .addStringOption(
            (option) => {
                return option
                    .setName('username')
                    .setDescription('The minecraft username to link')
                    .setRequired(true);
            });

module.exports = {
	data: CommandData,

	async execute(interaction) {
        let DATA = JSON.parse( fs.readFileSync(PATH).toString() );
        
        const username = interaction.options.getString('username');

        let userID = interaction.member.id;
        if (DATA['byID'][userID]) {
            return await interaction.reply(`UserID already whitelisted!`);
        }
        if (DATA['byName'][username]) {
            return await interaction.reply(`Username already whitelisted!`);
        }

        const channel = interaction.client.channels.cache.get(ENV.LOG_CHANNEL);

        let rcon = await RCON();
        let res = await rcon.execute(`whitelist add ${username}`);

        if (String(res).includes('That player does not exist')) {
            await interaction.reply(`Username \`${username}\` is not a valid minecraft account. Are you sure you provided the correct username?`);
            return;
        }

        DATA['byID'][userID] = username;
        DATA['byName'][username] = userID;
        fs.writeFileSync(PATH, JSON.stringify(DATA));

        channel.send(`**<@${userID}>** \`${interaction.member.user.username}\` did a whitelist - \`${username}\``);
        channel.send('`' + res + '`');

		await interaction.reply(`Added \`${username}\` ( <@${userID}> ) to the whitelist! Access to this channel will be removed in 15 seconds!`);

        rcon.disconnect();

        setTimeout(async () => {
            await interaction.member.roles.add(ENV.ROLE_ID);
            await interaction.member.setNickname(username, 'Minecraft username');
        }, 15 * 1000);
	},
};
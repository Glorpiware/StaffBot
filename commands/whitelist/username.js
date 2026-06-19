const { SlashCommandBuilder } = require('discord.js');
const RCON = require('../../rcon');
const fs = require('fs');
const path = require('path');

let PATH = path.join(
    process.cwd(),
    'users.json'
);

let DATA = JSON.parse( fs.readFileSync(PATH).toString() );

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
        const username = interaction.options.getString('username');

        let userID = interaction.member.id;
        if (DATA['byID'][userID]) {
            return await interaction.reply(`UserID already whitelisted!`);
        }
        if (DATA['byName'][username]) {
            return await interaction.reply(`Username already whitelisted!`);
        }

        let rcon = await RCON();
        let res = await rcon.execute(`whitelist add ${username}`);

        DATA['byID'][userID] = username;
        DATA['byName'][username] = userID;
        fs.writeFileSync(PATH, JSON.stringify(DATA));
        

        await interaction.member.roles.add('1445792490300112897');

		await interaction.reply(`Added \`${username}\` to the whitelist!`);

        rcon.disconnect();
	},
};
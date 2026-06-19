const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const ENV = process.env;

let PATH = path.join(
    process.cwd(),
    'users.json'
);

let CommandData = new SlashCommandBuilder()
        .setName('mention')
        .setDescription('Mentions the discord user by minecraft username')
        .addStringOption(
            (option) => {
                return option
                    .setName('username')
                    .setDescription('The minecraft username to mention')
                    .setRequired(true);
            });

module.exports = {
	data: CommandData,

	async execute(interaction) {

        let DATA = JSON.parse( fs.readFileSync(PATH).toString() );

        let member = interaction.member;
        let roles = member.roles;
        roles = roles.valueOf();

        // console.log(JSON.stringify(roles));
        let supportRole = roles.findKey(role => role.id == '1319632404964708405');
        console.log(supportRole);
        if (!supportRole) {
            return await interaction.reply(`No permission`);
        }

        const username = interaction.options.getString('username');

        if (!DATA['byName'][username]) {
            return await interaction.reply(`Username is not whitelisted!`);
        }

		await interaction.reply(`<@${DATA['byName'][username]}>`);
	},
};
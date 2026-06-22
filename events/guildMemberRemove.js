const { Events, ActivityType } = require('discord.js');

const fs = require('fs');
const path = require('path');
const RCON = require('../rcon');
const ENV = process.env;

let PATH = path.join(
	process.cwd(),
	'users.json'
);

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		let DATA = JSON.parse( fs.readFileSync(PATH).toString() );

		const userID = member.id;
		const client = member.client;

		console.log(`> ${member.username} ${userID} left the discord!`);

		let username = '----';

		const channel = client.channels.cache.get(ENV.LOG_CHANNEL);

		console.log(DATA['byID'], DATA['byID'][userID], userID)

		if (DATA['byID'][userID]) {
			username = DATA['byID'][userID];
			console.log(` | MC username: ${username}`);

			channel.send(`**<@${userID}>** \`${member.user.username}\` left the discord - \`${username}\``);

			delete DATA['byID'][userID];
			delete DATA['byName'][username];
			fs.writeFileSync(PATH, JSON.stringify(DATA));

			let rcon = await RCON();
			res = await rcon.execute(`whitelist remove ${username}`);
			rcon.disconnect();
			channel.send('`' + res + '`');
		}
	},
};
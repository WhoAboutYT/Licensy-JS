# About the development & some pr stuff

## Some Main Guidelines:
- Always use `npx prettier --write .` and make sure that you have not modified the .prettierrc file. 
- PR's for README's will not be accepted, however self-committed with credit (to avoid PR's for a contributor tag)
- PR's for the .prettierrc file will not be accepted unless I like it 🙂 
- Test your code before committing to a PR. If your code fails, it will most likely not be merged.
- When testing your code, if it works well, once creating a PR remove your token from config.json.
- In PR's, make a "changelog" on what you did. Example:
```diff
+ Implemented Command ping
- Removed command "addLicense" that was causing issues.
! Fixed some asynchronous function "foobar" on index.js
```

### Events: 

- Review handlers/events.js
- These take in arguments from client.on("EventX", ...args, client)
- This means that you don't need a way to access the client for example interaction.client as its already passed in.
- Example: 
  - No: client.on("interactionCreate", (interaction) => interaction.client)
  - Yes: client.on("interactionCreate", (interaction, client) => client);
```js
// Example Event:
const { Chalk } = require('chalk');
const chalk = new Chalk({ level: 3 });
const log = console.log;

module.exports = {
  name: 'ready',
  execute: client => {
    log('-- -- -- --  --');
    log('-____________-');
    log('-| LicensyJS |-');
    log('---------------');
    log('-- -- -- --  --');
    log(chalk.blue('[READY]  ..  Bot Online!'));
    log(chalk.rgb(0, 183, 255)(`[READY] Bot online as ${client.user.tag}`));
  },
};
```

### Commands:
- Review handlers/commands.js
- Example Command:
```js
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
}; // from: discordjs.guide
``` 
- It should be common practice to put "async"  in front of the execute function to allow proper asynchronous operations (e.g api calls).

### Bootup checks

Bootup checks are stored src/bootup.js. These are just checks to see if config.json has been modified or if its a fresh installation. If you would like to improve the way this works, feel free to create a PR (I spent like 2-4 minutes on it besides color choices and formatting.)

There are more options in the config.json file, such as debug, this is useful for testing websocket connections. 

### Client login Error handling

Client login Error handling is stored at src/utils/ClientLoginErrorHandling.js

These errors are stored [here (discord.js websocket code)](https://github.com/discordjs/discord.js/blob/d1f56ffb2a663ec654d7457489b22e2c401669eb/packages/ws/src/ws/WebSocketShard.ts#L914). Once Discord.JS updates there might be new errors, and it will most likely be oversighted. Feel free to create a PR on those. 

I am personally not planning to implement sharding until the bot gets a bit more popular.

### Using Chalk RGB

Visual Studio Code has a in-built feature to select rgb. Therfore, if you do chalk.rgb(0,0,0) you can select the black square to choose your own RGB inside of the code editor itself.

#### (Known Issues)

- On pterodactyl Systems the Bootup questions wont show up but you can enter in questions
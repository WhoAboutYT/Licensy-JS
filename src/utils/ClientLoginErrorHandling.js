const codes = require('discord.js').DiscordjsErrorCodes;
const { Chalk } = require('chalk');
const chalk = new Chalk({ level: 3 });

function log20TimesThenExit(text) {
  for (let i = 0; i < 20; i++) {
    console.log(text);
  }

  process.exit(1);
}

module.exports = error => {
  if (error.code === codes.TokenInvalid) {
    log20TimesThenExit(chalk.bgRedBright('[ERR] LoginError   |   Bad Token , refresh token from discord.com/developers and edit the config file.'));
  } else if (error.message == 'Used disallowed intents') {
    log20TimesThenExit(chalk.bgRedBright('[ERR] LoginError   |   Disallowed intents, goto discord.com/developers under "Priveleged Gateway Intents" and check it all!!'));
  } else if (error.message == 'Used invalid intents') {
    log20TimesThenExit(
      chalk.bgRedBright(
        "[ERR] LoginError   |   Invalid intents!  Make sure to only edit intents if you know what you're doing. If you know what you are doing check github for any updates or create an issue.",
      ),
    ); //I've tried using invalid intents, not entirely sure how this error gets pulled. (Nor do i really care) but if you want to see for yourself : https://github.com/discordjs/discord.js/blob/d1f56ffb2a663ec654d7457489b22e2c401669eb/packages/ws/src/ws/WebSocketShard.ts#L914
  } else if (error.message == 'Used an invalid API version') {
    log20TimesThenExit(chalk.bgRedBright('[ERR] LoginError   |   Invalid api version!!  This is most likely a Discord.JS issue!'));
  } else if (error.message == 'Sharding is required') {
    log20TimesThenExit(chalk.yellow("[ERR] Sharding is Required! Congrats on getting lots of servers. However, the bot dosen't support sharding. Create a PR or a Issue and maybe (probably not) I will work on sharding."));
  } else if (error.message == "Invalid shard") {
    log20TimesThenExit(chalk.bgRedBright("[ERR] Invalid Shard   | Bot is attempting to connect to a invalid shard, Verify Sharding Config."))
  } else if (error.message == "Authentication failed") {
    log20TimesThenExit(chalk.bgRedBright("[ERR] Auth Error   | Bot authentication has failed. Ensure you have correct login details"))
  } else {
    log20TimesThenExit(chalk.bgRedBright(`[ERR] Unknown!  ${error.message}`))
  }
};

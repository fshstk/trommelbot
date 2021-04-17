# Digitaler Trommelkreis Discord Bot

This is the repository for a Discord bot associated with
the [Digitaler Trommelkreis](https://github.com/fshstk/trommelkreis/), a website for a biweekly
music production workshop based on Django.

While you are welcome to deploy your own version, or fork the project and play
around with it, its main purpose is to power the original [Digitaler
Trommelkreis](https://www.trommelkreis.club) project, so don't expect anything
in the way of documentation.

## Features

The bot communicates with the Trommelkreis archive API, allowing users to view session metadata and listen to tracks in the archive.

### Available Commands
- `trommel`: …kreis!
- `info`: Display help message
- `sesh`: Load a session whose slug matches the current date in `YYYYMMDD`
  format.
- `sesh [YYYYMMDD or archive URL]\`: Load a specific session.
- `sesh forget`: Unload the current session.
- `play`: Play the current track from the beginning.
- `play next`: Play the next track of the current session.
- `play prev`: Play the previous track of the current session.
- `play [#]`: Play a specific track of the current session.
- `stop`: Stop playing.
- `pause`: Pause.

Additionally, two admin commands are available:
- `lock`: Lock the bot.
- `unlock`: unlock the bot.

When locked, the bot will only respond to commands by the admin user as
specified by the `ADMIN_ID` env variable

## Deployment

`Procfile` and `.buildpacks` files for Heroku-compatible deployments are
included, so if you want to deploy your own version of this site it shouldn't be
too complicated. The original site is hosted and deployed using
[Dokku](https://dokku.com/).

You should be able to deploy this app in four easy steps:
1. Install [Heroku](https://heroku.com).
2. Clone this repository.
3. Follow the Discord instructions on how to generate a bot token
4. Follow the Heroku instructions on how to deploy an app.

Additionally, you must make sure the following env variables are set in your app
dashboard:

- `ADMIN_ID` (Discord user ID of the admin user)
- `COMMAND_PREFIX` (command prefix to use for addressing bot, or empty string if
  none)
- `ALLOWED_CHANNEL` (the bot will only react to commands in channels whose name
  matches this string)
- `DEBUG` (1 or 0)
- `CHANNEL_ID` (fixed ID of the voice channel in which to stream)
- `BOT_TOKEN` (you need to create a bot via the Discord developer portal to get
  one of these)
- `API_URL` (URL of the backend API. Use `https://trommelkreis.club/api` for the
  original archive.)

## License

All code is licensed under GPLv3.
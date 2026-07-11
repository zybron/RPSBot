# RPSBot
A discord bot for randomly generating rock, paper, scissors.

Commands: <br>
Use `/rps` to throw a challenge.<br>
Use `/static` to throw a challenge against the bot and it will show you the results.<br>
Use `/help` to show a help message.

## Running with Docker

Build and run locally:

```
docker build -t rpsbot .
docker run -d --name rpsbot -e TOKEN=your-bot-token rpsbot
```

Or via `docker-compose`:

```yaml
services:
  rpsbot:
    image: ghcr.io/zybron/rpsbot:latest
    container_name: rpsbot
    environment:
      - TOKEN=your-bot-token
    restart: unless-stopped
```

Environment variables:

| Variable | Required | Purpose |
|---|---|---|
| `TOKEN` | yes | Discord bot token |
| `CLIENT_ID` | only for `deploy-commands.js` | Discord application/client ID, used to register slash commands |
| `GUILD_ID` | no | present for future guild-scoped command registration; currently unused |

Slash commands only need to be (re-)registered when a command is added or changed — run `node deploy-commands.js` (with `TOKEN`/`CLIENT_ID` set) once, not on every container start.

A GitHub Actions workflow (`.github/workflows/docker-publish.yml`) builds and publishes the image to `ghcr.io/zybron/rpsbot` on every push to `master`.


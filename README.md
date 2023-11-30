# Smart home script

<p>
  <a href="/LICENSE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="MIT"></a>
  <a href="https://medium.com/@sandoche" target="_blank"><img src="https://badgen.net/badge/icon/medium?icon=medium&label" alt="medium: sandoche"></a>
  <a href="https://twitter.com/sandochee">
    <img alt="Twitter: sandochee" src="https://img.shields.io/twitter/follow/sandochee.svg?style=social" target="_blank" />
  </a>
</p>

Smart automation with hue and wiz bulbs, this contains a tiny vue app, a simple API for tuning on, off, dimming and resetting lights, and a cron job for making automations.

## 🏷️ Devices supported

- Philips Hue
- Wiz

## ⚡ Set up

```bash
pnpm install
pnpm setup:hue

# put the hue bridge user and client key in the .env file and fill the other variables

pnpm build
pnpm start

# open http://localhost:3000
```

## ⚙️ API

- `/on` - Turn on all lights
- `/off` - Turn off all lights
- `/reset` - Reset to default settings of the lights that are on
- `/update/:brightness/:temperature/:color` - Update the lights that are on with the given parameters

## 📝 Notes

- Color changing is not implemented

## 📖 Documentation

- https://github.com/uditkarode/wikari
- https://github.com/peter-murray/node-hue-api

## ⭐️ Show your support

Please ⭐️ this repository if this project helped you!

<a href="https://www.patreon.com/sandoche">[![patreon.png](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/sandoche)</a>

## 🍺 Buy me a beer

If you like this project, feel free to donate:

- PayPal: https://www.paypal.me/kanbanote
- Bitcoin: 19JiNZ1LkMaz57tewqJaTg2hQWH4RgW4Yp
- Ethereum: 0xded81fa4624e05339924355fe3504ba9587d5419
- Monero: 43jqzMquW2q989UKSrB2YbeffhmJhbYb2Yxu289bv7pLRh4xVgMKj5yTd52iL6x1dvCYs9ERg5biHYxMjGkpSTs6S2jMyJn

## 📄 License

[MIT License](./LICENSE)

Copyright (c) Sandoche Adittane

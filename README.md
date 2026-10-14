# Smarter Chat for Google Tag Manager

> A Google Tag Manager tag template that adds a [Smarter](https://smarter.sh) chatbot to any site with a GTM web
> container: a chat launcher in a corner of the page, or a chat in an element of the page.

[![Test](https://github.com/smarter-sh/smarter-gtm-template/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/smarter-sh/smarter-gtm-template/actions/workflows/test.yml)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

The template loads the embed script of [`@smarter.sh/ui-chat`](https://github.com/smarter-sh/smarter-chat) from
jsDelivr, which renders the chat in a Shadow DOM, so the site's css can't break it. The chatbot is an LLMClient that you
build and deploy on a Smarter platform.

**[User guide](https://docs.smarter.sh/en/latest/smarter-framework/smarter-gtm.html)** ·
**[Architecture decisions](doc/adr/000-intro.md)**

## Use it

1. In your container, **Templates → Tag Templates → Search Gallery**, find **Smarter Chat**, and add it. (Or **New → ⋮
   → Import**, and choose this repository's `template.tpl`.)
2. **Tags → New → Smarter Chat**. Enter your deployed LLMClient's url, and choose the launcher's position, label and
   color.
3. Trigger it on **All Pages** (a single-page app can also use **History Change**; the template adds a chatbot once).
4. In the tag's **Advanced Settings → Consent Settings**, require `functionality_storage`: the chat keeps its session in
   a cookie.
5. Preview, then publish the container.

The LLMClient's manifest must allow your site's origin:

```yaml
spec:
  config:
    prompt:
      allowedOrigins:
        - https://www.example.com
```

| Field                           | Embed script option          | Notes                                                        |
| ------------------------------- | ---------------------------- | ------------------------------------------------------------ |
| Chatbot url                     | `chatbot`                    | Required.                                                    |
| Api key                         | `apiKey`                     | Only for an LLMClient that requires one. Public in the page. |
| Launcher position, label, color | `position`, `label`, `color` |                                                              |
| Start with the chat open        | `open`                       |                                                              |
| Advanced → Target element       | `target`                     | A css selector: the chat goes in that element, inline.       |
| Advanced → Height               | `height`                     |                                                              |
| Advanced → Embed script version | (the script's url)           | Defaults to the version that the template is tested with.    |

The template's permissions: inject scripts from `https://cdn.jsdelivr.net/npm/@smarter.sh/ui-chat@*`; read and write
`SmarterChatConfig`, read `SmarterChat.version`, execute `SmarterChat.mount`; log to the console in Preview mode.

## Development

```console
make init      # npm dev dependencies, pre-commit hooks
make test      # template.tpl's ___TESTS___ scenarios in Node, the sandbox lint, the sections and metadata.yaml
make lint
```

The repository is developed with [Agent Skills](skills/README.md) for AI coding agents; start with
[CLAUDE.md](CLAUDE.md). See [CONTRIBUTING.md](.github/CONTRIBUTING.md).

## License

[Apache-2.0](LICENSE), as the Community Template Gallery requires. The embed script that the template loads is
AGPL-3.0-or-later.

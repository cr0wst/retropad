# RetroPad

<p align="center">
  <img src="static/favicon.svg" alt="RetroPad Logo" width="80" />
</p>

![Build Status](https://github.com/cr0wst/retropad/actions/workflows/deploy.yaml/badge.svg)

RetroPad is your digital gaming notebook, like your vintage gaming binder, brought into the modern world.

Organize your game notes and collaborate with others.

## Running Locally

To setup the project locally, start by cloning the repository, and installing dependencies:

```sh
git clone git@github.com:cr0wst/retropad.git
pnpm install
```

Copy the `.env.example` file to `.env` and fill in the values:

```sh
cp .env.example .env
```

And, finally, run your local environment:

```sh
pnpm run dev
```

## Deployment

RetroPad is designed to deploy to [Cloudflare Workers](https://developers.cloudflare.com/workers/).

- See `.github/workflows/deploy.yaml` for CI/CD setup.
- Database migrations use Cloudflare D1.

---

## License

[MIT](LICENSE)

# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

```sh
yarn dev
```

This starts your app in development mode, which will purge the server require cache when Remix rebuilds assets so you don't need a process manager restarting the express server.

## Deployment

First, build your app for production:

```sh
yarn build
```

Then run the app in production mode:

```sh
yarn start
```

Now you'll need to pick a host to deploy it to.

## Formatting

```sh
yarn fmt
```

Format your code.

## Database

```sh
# initialize database
yarn prisma db push
```

### DIY

If you're familiar with deploying express applications you should be right at home just make sure to deploy the output of `remix build`

- `server/build/`
- `public/build/`

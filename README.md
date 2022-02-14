# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Database

Before you start dev/build your project, you need to initialize the database.

With `DATABASE_URL` environment variable set, you can use the following command to initialize the database:

```sh
# generate types according to prisma/scheme.prisma file
yarn prisma db push

# add some preset data to the database
yarn prisma db seed
```

If you don't want to export `DATABASE_URL` environment variable every time, you can write it in `.env` file. The program will automatically read the `.env` file and use the `DATABASE_URL` value.

```
echo DATABASE_URL=postgres://user:password@host:port/database > .env
```

## Development

Before start developing your project, you need to make sure that the database is initialized.

Then you can start developing your project with the following command:

```sh
yarn dev
```

The command will watch on `styles` and `app` folders and rebuild the project when they are changed. But it will not watch on `server` folders.

## Deployment

First, build your app for production:

```sh
yarn build
```

Then run the following command to start your app in production mode:

```sh
yarn start
```

## Formatting

Format all the code in your project with the following command:

```sh
yarn fmt
```

Before you commit, please format your code first.

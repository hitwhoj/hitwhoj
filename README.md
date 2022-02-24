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

## MinIO

You need those environment variables to configure MinIO:

- `S3_END_POINT`: end point, defaults to `localhost`
- `S3_PORT`: port number, defaults to `9000`
- `S3_SSL`: enable SSL, defaults to `false`
- `S3_ACCESS_KEY`: access key, defaults to `""`
- `S3_SECRET_KEY`: secret key, defaults to `""`
- `S3_ROOT_USER`: alias to `S3_ACCESS_KEY`
- `S3_ROOT_PASSWORD`: alias to `S3_SECRET_KEY`
- `S3_BUCKET`: bucket name, defaults to `""`

Just write them in `.env` file.

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

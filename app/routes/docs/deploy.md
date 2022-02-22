---
meta:
  title: "Help: Deployment - HITwh OJ"
---

# Deployment

Deploy our project is very easy.

1.  Clone our project

    You can use `git clone` to clone our project.

    ```sh
    git clone https://git.hit.edu.cn/hitwhoj/hitwhoj.git
    cd hitwhoj
    ```

2.  Install dependencies

    You can use `yarn install` to install dependencies.

    ```sh
    yarn install
    ```

3.  Configure database

    You need to install postgresql yourself.

    Afterwards, write connection string to `.env` file.

    ```sh
    echo "DATABASE_URL=postgres://user:password@host:port/database" >> .env
    ```

    Then you can use `yarn prisma db push` to initialize database.

4.  Configure MinIO storage

    You need to install MinIO yourself.

    Afterwards, write connection string to `.env` file.

    ```sh
    # end point, defaults to localhost
    echo "S3_END_POINT=localhost" >> .env

    # port number, defaults to 9000
    echo "S3_PORT=9000" >> .env

    # enable SSL, defaults to false
    echo "S3_SSL=true" >> .env

    # access key, defaults to "", choose one of the following:
    echo "S3_ACCESS_KEY=access_key" >> .env
    echo "S3_ROOT_USER=access_key" >> .env

    # secret key, defaults to "", choose one of the following:
    echo "S3_SECRET_KEY=secret_key" >> .env
    echo "S3_ROOT_PASSWORD=secret_key" >> .env

    # bucket name, defaults to ""
    echo "S3_BUCKET=bucket_name" >> .env
    ```

    If you host MinIO and the server on the same machine, you only need to configure `S3_ACCESS_KEY`, `S3_SECRET_KEY` and `S3_BUCKET` environment variables.

5.  Build the project

    You can use `yarn build` to build the project.

    ```sh
    yarn build
    ```

6.  Start the project

    You can use `yarn start` to start the project.

    ```sh
    yarn start
    ```

    You can visit the project by `http://localhost:8080`.

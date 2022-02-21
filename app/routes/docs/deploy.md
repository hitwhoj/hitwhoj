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
    echo "DATABASE_URL=postgres://user:password@host:port/database" > .env
    ```

    Then you can use `yarn prisma db push` to initialize database.

4.  Build the project

    You can use `yarn build` to build the project.

    ```sh
    yarn build
    ```

5.  Start the project

    You can use `yarn start` to start the project.

    ```sh
    yarn start
    ```

    You can visit the project by `http://localhost:8080`.

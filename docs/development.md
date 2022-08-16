# 开发说明

WIP

本文讲述开发本项目所要使用到的各种工具的使用方法。

## 本地部署

先将网站克隆到本地

    git clone git@git.hit.edu.cn:hitwhoj/hitwhoj.git
    cd hitwhoj

接着使用 `yarn` 安装依赖

    yarn install

yarn 在 install 之后会自动运行一个 postinstall hook，包括：

- `patch-package`: 应用对于 node_modules 中若干依赖的手动修复，这些修复存放在项目的 `/patches` 文件夹中。
- `prisma generate`: 解析 Prisma 的 Schema 文件，以生成可供用于 TypeScript 类型检查的 `@prisma/client` 模块。

---

之后需要您手动部署安装好 PostgreSQL 数据库，并将数据库的链接信息添加到 `.env` 文件中。

    // .env
    DATABASE_URL=postgres://user:password@localhost:5432/dbname

`.env` 是用于存放启动网站时的环境变量文件，用于进行网站启动时的配置工作。由于其中可能包含敏感的信息，因此会被 git 忽略。

之后便可以初始化数据库，使用 `yarn prisma db push` 将 schema 写入数据库中。

    // 初始化数据库
    yarn prisma db push

---

之后需要手动安装 MinIO，并同样将 MinIO 的链接信息添加到 `.env` 文件中。

    // .env
    S3_ENDPOINT=localhost
    S3_PORT=9000
    S3_ACCESS_KEY=minioadmin
    S3_SECRET_KEY=minioadmin
    S3_BUCKET=hitwhoj

其中的 `S3_ENDPOINT` 可以设置为 MinIO 服务器的 IP 地址，默认为 `localhost`，`S3_PORT` 默认为 9000，其余三个选项都必须手动提供，否则启动时将会报错。

---

配置完毕之后还有一些额外的选项可以写到 `.env` 文件中，其中包括：

    // .env
    JUDGE_PORT=3000           // 网站与评测机之间通信的端口
    JUDGE_PRIVATE_KEY=abaaba  // 网站与评测机之间通信的密钥
    MAX_FILE_SIZE=20000000    // 网站允许上传的文件大小，默认为 20MB

## 启动网站

若要以生产模式启动网站，则需要预先构建静态资源。

    yarn build

构建会生成若干文件到 `.cache/`, `build`, `public/build`, `app/styles` 文件夹中。

这些不同的目录表示的是不同的构建目标：

- `.cache/`: Remix 的缓存目录，用于存放构建过程中的临时文件。
- `build/`: 后端代码的构建目标，是 `app/` 目录中所有后端部分代码的打包。
- `public/build/`: 前端代码的构建目标，是 `app/` 目录中所有前端部分代码的打包。
- `app/styles`: 前端样式代码的构建目标，是 `styles/` 目录中所有 SCSS 样式代码的打包。

> **？？？为什么要单独构建 SCSS 样式？**
>
> 因为睿智的 Remix 不支持直接导入 SCSS 样式（不支持 PostCSS 那一套），于是我们只能手动编译。

另外 `app/styles` 中的内容也会被打包进 `public/build/` 中。

构建完成之后就可以通过 `yarn start` 启动网站了。

    yarn start

若要以开发模式启动网站，可以不手动构建静态资源。

    yarn dev

dev 服务器会自动监听 app/ 目录下的文件变化，并自动刷新网站的页面。

## 跑测试

跑测试需要在数据库中预先填入一些特定的数据，以满足权限检查测试的要求。

这些测试的数据写在 `tests/seed.ts` 文件中，需要预先清空数据库之后再初始化。

    node -r esbuild-register tests/seed.ts

如果上文正常结束，则可以使用 `yarn test` 命令进行测试，coverage 的结果也会一并显示在终端里面。

    yarn test

## 其他有用的命令

往数据库中填入一些简单的可供调试的测试数据

    yarn prisma db seed

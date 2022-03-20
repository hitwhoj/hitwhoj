---
meta:
  title: "Help: Deployment on Windows - HITwh OJ"
---

## Deployment on Windows

~~Deploy our project is very easy.(?)~~

~~Why is this document in English? Because it can torture those who read this.~~

### Install PostgreSQL

Download [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads), then install just following the setup wizard.

It will automatically create a service and running on port 5432.

### Install MinIO

Follow the steps below or you can just refer to this: https://juejin.cn/post/6973840027524530206

1. Download the executable program from  [minio](https://min.io/).

2. Start minio.exe:

   ```bash
   ./minio.exe server D:\minIO\file # the path to store files
   ```

3. Set minio as a service to keep running: (we use WinSW here, or you can use other tools if you want)

   1. Download [WinSW](https://github.com/winsw/winsw/releases), and copy it into the same folder with minio.exe, then rename it, for example `minio-server.exe`.

   2. Touch the xml file with the same name, for example  `minio-server.xml` , write the config below:

      ```xml
      <service>
        <id>minio-server</id>
        <name>minio-server</name>
        <description>minio-server</description>
        <env name="HOME" value="%BASE%" />
        <executable>%BASE%\minio.exe</executable>
        <arguments>server "%BASE%\data"</arguments>
        <logpath>%BASE%\logs</logpath>
        <log mode="roll-by-size-time">
          <sizeThreshold>10240</sizeThreshold>
          <pattern>yyyyMMdd</pattern>
          <autoRollAtTime>00:00:00</autoRollAtTime>
          <zipOlderThanNumDays>5</zipOlderThanNumDays>
          <zipDateFormat>yyyyMMdd</zipDateFormat>
        </log>
      </service>
      ```

   3. Create the service:

      ```bash
      minio-server.exe install
      ```

   4. Start the minio service:

      ```bash
      net start minio-server # run as Administrator
      ```

      (or other ways you like, for example, start the service by the task manager)

### install nvm

This project needs your node version to be 16, maybe you have to [install nvm](https://github.com/coreybutler/nvm-windows/releases) yourself. (or just install node v16 is fine).

### Clone and set config

1. Clone and install dependences:

   ```bash
   git clone https://git.hit.edu.cn/hitwhoj/hitwhoj.git
   cd hitwhoj
   yarn install
   ```

2. Configure environment:

   database:

   Write connection string to `.env` file. (Of course, you can manually create it.)

   ```bash
   echo "DATABASE_URL=postgres://user:password@host:port/database" >> .env
   ```

   for example: (create a new database before)

   ```bash
   echo "DATABASE_URL=postgres://postgres:password@localhost:5432/hitwhoj" >> .env
   ```

   minio: (create a new bucket at localhost:9000 before)

   ```bash
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

   then your `.env` may look like this:

   ```bash
   DATABASE_URL=postgres://postgres:myPassword@localhost:5432/hitwhoj
   S3_END_POINT=localhost
   S3_PORT=9000
   S3_ACCESS_KEY=minioadmin
   S3_SECRET_KEY=minioadmin
   S3_BUCKET=hitwhoj
   ```

### Init database

```bash
yarn prisma db push
yarn prisma db seed # add some data in development mode
```

### Build and run the project

```bash
yarn build
yarn dev
```

Then enjoy ~~guguing~~ coding!


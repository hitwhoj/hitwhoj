# 部署网站

注意：本文介绍的是在 Linux 作业系统下的通用部署方式，对于在 Windows 作业系统部署，可以[参考这里](/docs/deploy-windows.md)。

## 安装依赖

需要预先安装以下软件：

- [PostgreSQL][postgres]: 版本任意
- [MinIO][minio]: 版本任意
- [Node.js][nodejs]: 需要 v16，其他版本未经测试

## 构建

```bash
git clone --depth=1 -b dev git@git.hit.edu.cn:hitwhoj/hitwhoj.git
cd hitwhoj

# 安装依赖
yarn install
# 构建
yarn build
```

## 配置

之后需要配置 `.env` 文件在启动的时候自动设置环境变量，具体如下：

```bash
# === 数据库配置 ===

DATABASE_URL=postgres://username:password@localhost:5432/dbname

# === MinIO 配置 ===

S3_ENDPOINT=localhost
S3_PORT=9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=hitwhoj

# === 网站配置 ===

## 网站监听端口
PORT=8080

## 与评测机通信时的密钥
# 如果非空，则需要在配置评测机的时候也输入相同的密钥
JUDGE_PRIVATE_KEY=hitwhoj

## 最大文件上传大小
MAX_FILE_SIZE=20000000 # 默认 20MB
```

配置完成之后需要初始化数据库，具体如下：

```bash
# 初始化数据库
yarn prisma db push

## **如果您在开发模式，可以填充一些模拟数据到数据库中来测试**
## **如果在生产环境就不需要**
#yarn prisma db seed
```

## 启动网站

使用 `yarn start` 启动网站。

## 本地代理

如果您打算使用 80/443 端口来开放网站，我们推荐使用 nginx 作为代理来监听 80/443 端口，再将流量转发到 8080 端口。

```conf
# /etc/nginx/nginx.conf

http {
  include       mime.types;
  default_type  application/octet-stream;

  sendfile           on;
  keepalive_timeout  65;

  server {
    listen       80;
    server_name  localhost;

    return 301 https://$host$request_uri;
  }

  server {
    listen       443 ssl;
    server_name  localhost_ssl;

    ssl_certificate      /path/to/fullchain.pem;
    ssl_certificate_key  /path/to/privkey.pem;

    location / {
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_pass http://127.0.0.1:8080;
    }
  }
}
```

## 部署评测机

请参阅[部署评测机](/docs/deploy-judge.md)。

[postgres]: https://www.postgresql.org/
[minio]: https://min.io/
[nodejs]: https://nodejs.org/en/

# 部署评测机

## 安装依赖

需要预先安装以下软件：

- [docker][docker]: 就是 docker，<s>不会有人没听说过吧？</s>

## 安装评测机

```bash
git clone --depth=1 -b master git@git.hit.edu.cn:hitwhoj/judger.git
cd judger

# 安装依赖
yarn install
```

## 配置

笑死，根本没有写怎么配置，他只会监听本地 3000 端口。

## 启动

简单粗暴，如果 docker 没有初始化完成他会自动 pull 和 build。

```bash
yarn start
```

[docker]: https://www.docker.com/

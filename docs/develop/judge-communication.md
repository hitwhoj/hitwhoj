# 网站与评测机之间的通信协议

网站部分与评测机部分在设计时便分离了开来，因此咱们可以动态地调整评测机的数量。

## 建立 WebSocket 信道

分为两种方式，第一种是网站主动向评测机发起连接，适用于网站部署在内网的情况。这种情况下可以通过网站的前端 UI 界面填入评测机的 ip 地址和端口号，然后建立连接。

第二种情况是评测机主动向网站发起连接，这时需要在启动评测机的时候指定好网站的服务器 ip 地址和端口，之后再启动评测机进程。

## 通讯协议

假设网站和评测机之间建立好了稳定的 WebSocket 信道，接着就需要按照以下的通讯协议来进行通信。

无论是网站还是评测机发送信息，都必须使用 JSON 格式编码所有参数。对方在收到 JSON 格式的信息后，直接使用 JSON.parse() 函数来解析原来的数据。

### 网站广播目前有待领取的任务

```json
{
  "type": "mission"
}
```

### 评测机回复可以领取评测任务

当评测机受到来自网站广播的待领取任务数据包时，检查自身是否有空余的计算资源。

如果自身有空余的计算资源，则返回一个可以领取的任务数据包，否则什么也不返回。

```json
{
  "type": "mission"
}
```

### 网站分配任务给评测机

当网站收到来自评测机的回复之后，立即检查当前是否有待领取的评测任务。

如果有待领取的评测任务，则将该任务分配给当前的评测机，否则什么也不返回。

```json
{
  "type": "task",
  "id": 114514, // 评测的 id
  "code": "print(\"Hello, World!\")", // 评测的代码
  "language": "py", // 评测的语言
  "files": {
    // 所有数据文件的 uuid
    "config.json": "92ef12a1-5c81-4e54-a00c-b0ac49a73b2e",
    "1.in": "e584a209-0c9e-4fbc-b113-559f0aa13f9d",
    "1.out": "bc3337aa-10c4-4054-8aee-782a5ef2da85"
  }
}
```

分配任务之后网站启动一个计时器，如果两分钟之后依然没有收到来自评测机的评测结束数据包，则将该任务认定为评测超时，并丢弃之后关于该任务 id 的所有数据包。

### 评测机请求同步数据

当评测机收到来自网站分配的任务之后，检查自身是否有空余的计算资源。

如果没有空余的计算资源，则返回一个[评测机拒绝评测][]数据包，否则将资源标记为占用，并且立刻开始同步数据。

评测机首先检查自身缓存中是否有目标文件，如果有，则直接使用这个缓存，否则向网站发送请求同步的数据包。

```json
{
  "type": "sync",
  "uuid": "92ef12a1-5c81-4e54-a00c-b0ac49a73b2e"
}
```

之后评测机启动一个计时器，如果 1min 之后仍然没有收到来自网站同步的数据，则将该数据标记为丢失，取消接下来的评测，并且直接返回评测结束。

### 网站返回同步数据

当网站收到来自评测机的同步数据请求之后，从数据库中读取相应的文件，并且以 base64 形式返回数据。

```json
{
  "type": "sync",
  "uuid": "92ef12a1-5c81-4e54-a00c-b0ac49a73b2e",
  "data": "MTE0NTE0MTkxOTgxMA=="
}
```

### 评测机拒绝评测

如果评测机当前没有空余的计算资源却还被网站分配了任务，则返回一个拒绝评测的数据包。

```json
{
  "type": "reject",
  "id": 114514
}
```

当网站收到该数据包之后应该将这个 id 对应的任务重新加入到待领取任务队列中。

### 评测机同步任务进度

每当评测机评测取得进度时（具体包括：数据同步结束，编译结束，任意数据点运行结束等），都应该发送一个进度数据包给网站。

```json
{
  "type": "progress",
  "id": 114514,
  "status": "Running",
  "message": "compile warnings ...",
  "subtasks": [
    {
      "status": "Accepted",
      "tasks": [
        {
          "status": "Accepted",
          "time": 0,
          "memory": 114514,
          "message": "4 numbers correct"
        }
      ]
    },
    {
      "status": "Running",
      "tasks": [
        {
          "status": "Running",
          "time": -1,
          "memory": -1,
          "message": ""
        }
      ]
    },
    {
      "status": "Pending",
      "tasks": [
        {
          "status": "Pending",
          "time": -1,
          "memory": -1,
          "message": ""
        }
      ]
    }
  ]
}
```

### 评测结束

当评测机评测结束之后返回一个评测结束数据包。

```json
{
  "type": "finish",
  "id": 114514,
  "status": "Wrong Answer",
  "message": "compile warnings ...",
  "subtasks": [
    {
      "status": "Accepted",
      "tasks": [
        {
          "status": "Accepted",
          "time": 0,
          "memory": 121299,
          "message": "4 numbers correct"
        }
      ]
    },
    {
      "status": "Wrong Answer",
      "tasks": [
        {
          "status": "Wrong Answer",
          "time": 1,
          "memory": 122999,
          "message": "line 1: find 2, expected 3"
        }
      ]
    },
    {
      "status": "Accepted",
      "tasks": [
        {
          "status": "Accepted",
          "time": 20,
          "memory": 203023,
          "message": "1299 numbers correct"
        }
      ]
    }
  ]
}
```

当网站收到该数据包之后应该将这个 id 对应的任务标记为已完成，并且将这个任务的结果写入数据库，之后丢弃所有与该 id 对应的任务的所有同步进度数据包。

### 网站询问状态

网站想跟评测机打乒乓球。

```json
{
  "type": "ping"
}
```

### 评测机回应状态

只要评测机收到来自网站的乒乓球，就打回去。

```json
{
  "type": "pong"
}
```

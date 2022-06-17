---
meta:
  title: 帮助：评测相关 - HITwh OJ
---

# 评测相关

本站提供对编程代码的在线评测服务。

## 提交

用户可以对于某一道题目提交自己的实现代码，网站会使用一些测试数据来尝试运行程序，根据评测的结果判断程序的正确性和健壮性。

用户在提交代码的时候需要选择代码使用的语言，以及一些可选的额外编译选项，网站会根据所选的语言和编译选项来测试用户所提交的代码。

当网站评测结束之后，用户便可以查看评测结果。

评测结果有以下几种：

- **Accepted**：代码通过所有测试用例，并且程序运行正常。
- **Wrong Answer**：代码对于一部分测试数据输出了错误的结果。
- **Time Limit Exceeded**：代码运行时间超过了题目规定的时间限制。
- **Memory Limit Exceeded**：代码使用了超过了题目规定的内存限制。
- **Runtime Error**：代码运行时出现了非预期的错误。
- **Compile Error**：代码编译时出现了非预期的错误。
- **System Error**：网站评测系统出现了非预期的错误，如果出现此类错误，请联系网站管理员。

## 测试数据

对于出题人来说，创建完题目之后需要上传一些测试数据，以便于网站对代码进行评测。

网站支持三种不同的评测方式：

1. 普通评测：使用出题人预先给出的测试数据进行一一评测。
2. 交互式评测：使用一个特殊的程序（SPJ）来跟用户的代码进行交互式评测。
3. 动态评测：使用出题人预选给出的测试数据生成程序和标准代码进行动态地生成测试数据并评测。

题目数据文件中必须包含 `config.json` 文件才能开始支持评测，该文件的内容如下：

### config.json

```json
{
  // 评测方式，可以是 `default`, `interactive`, `dynamic`, `submit_answer` 中的一种。
  "type": "default",

  // 提答题的答案，仅限 type 为 `submit_answer` 时有效
  "answer": "114514",

  // Special Judge 类型，支持 `default`, `testlib` (可选, 默认为 `default`)
  "checkerType": "default",
  // Special Judge 源程序文件 (可选)
  "checkerName": "spj.cpp",

  // 交互题的交互程序，仅限 type 为 `interactive` 时有效
  "interactive": "interactive.cpp",

  // 动态题目的生成数据代码，仅限 type 为 `dynamic` 时有效
  "mkdata": "mkdata.cpp",
  // 动态题目的标准代码，仅限 type 为 `dynamic` 时有效
  "std": "std.cpp",

  // 全局默认时间限制 (ms)
  "time": 1000,
  // 全局默认内存限制 (byte)
  "memory": 256000000,

  // 所有子任务，每个子任务中需要通过所有的数据点才能得到该子任务的分数
  "subtasks": [
    {
      // 子任务的分值
      "score": 20,
      // 子任务的特殊时空间限制
      "time": 1000,
      "memory": 256000000,
      // 子任务的所有数据点
      "cases": [
        // 一般数据点
        { "input": "1.in", "output": "1.ans" },
        { "input": "2.in", "output": "2.ans" },
        // 也可以再次指定时空间限制
        {
          "input": "2.in",
          "output": "2.ans",
          "time": 2000,
          "memory": 512000000
        },

        // 对于 type 为 `dynamic` 时可以使用动态数据点
        // `args` 中的参数会传入 `mkdata` 的 argv 中
        { "args": "1000" },
        { "args": "1000" },
        // 时空间限制依旧可以特殊指定
        { "args": "1000", "time": 2000, "memory": 512000000 }
      ]
    }
  ]
}
```

### 样例 1：

普通评测方式中，只有通过了一个 subtask 中的所有测试点才算通过该 subtask，得到对应的分数。

```json
{
  "type": "default",
  "checkerType": "testlib",
  "checkerName": "spj.cpp",
  "subtasks": [
    {
      "score": 60,
      "tasks": [
        { "input": "1.in", "output": "1.out" },
        { "input": "2.in", "output": "2.out" },
        { "input": "3.in", "output": "3.out" }
      ]
    },
    {
      "score": 20,
      "tasks": [
        { "input": "4.in", "output": "4.out" },
        { "input": "5.in", "output": "5.out" },
        { "input": "6.in", "output": "6.out" }
      ]
    },
    {
      "score": 20,
      "tasks": [
        { "input": "7.in", "output": "7.out" },
        { "input": "8.in", "output": "8.out" },
        { "input": "9.in", "output": "9.out" },
        { "input": "10.in", "output": "10.out" }
      ]
    }
  ]
}
```

其中 `spj.cpp` 可以使用 [testlib](https://github.com/MikeMirzayanov/testlib) 库。

```cpp
#include "testlib.h"

int main(int argc, char * argv[]) {
  setName("compares two signed integers");
  registerTestlibCmd(argc, argv);
  int ja = ans.readInt();
  int pa = ouf.readInt();
  if (ja != pa)
    quitf(_wa, "expected %d, found %d", ja, pa);
  quitf(_ok, "answer is %d", ja);
}
```

### 样例 2：

```json
{
  "type": "interactive",
  "interactive": "interactive.cpp"
}
```

TODO: 添加交互题示例代码

### 样例 3：

```json
{
  "type": "dynamic",
  "mkdata": "mkdata.cpp",
  "std": "std.cpp",
  "subtasks": [
    {
      "score": 60,
      "time": 200,
      "memory": 256000000,
      "tasks": [
        { "args": "10" },
        { "args": "10" },
        { "args": "10" },
        { "args": "10" }
      ]
    },
    {
      "score": 20,
      "tasks": [{ "args": "1000" }, { "args": "1000" }, { "args": "1000" }]
    },
    {
      "score": 20,
      "tasks": [
        { "args": "100000" },
        { "args": "100000" },
        { "input": "chain.in", "output": "chain.out" },
        {
          "input": "chrysanthemum_tree.in",
          "output": "chrysanthemum_tree.out"
        }
      ]
    }
  ]
}
```

其中 `mkdata.cpp` 中可以在 `main` 函数中读取到每个数据点的生成参数。

注意千万不能使用 `srand(time(NULL))` 来初始化随机数，否则可能生成出来的随机数据都是一模一样的。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main(int argc,  char *argv[]) {
  int n = atoi(argv[1]);
  srand(/* 使用一些魔法 */);
  cout << n << endl;
  for (int i = 0; i < n; i++) {
    cout << rand() % n + 1 << endl;
  }
  return 0;
}
```

`std.cpp` 则需要能正确地根据输入数据返回标准答案。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
  int n, sum = 0;
  cin >> n;
  for (int i = 0; i < n; i++) {
    int x;
    cin >> x;
    sum += x;
  }
  cout << sum << endl;
}
```

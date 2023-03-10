# Markdown 编辑器使用帮助

编辑器中可以直接输入 Markdown 代码。

如果需要插入自定义图片，可以先复制图片到剪切板，之后在输入框中直接粘贴。编辑器会自动上传图片到您的账户下，并插入对应的 Markdown 代码。

目前支持的语法一览如下。

## 加粗

```markdown
**bold**
```

**bold**

## 斜体

```markdown
_italic_
```

_italic_

## 超链接

```markdown
[Link Text](https://git.hit.edu.cn/hitwhoj/hitwhoj)
```

[Link Text](https://git.hit.edu.cn/hitwhoj/hitwhoj)

## 图片

```markdown
![image](https://git.hit.edu.cn/uploads/-/system/appearance/header_logo/1/logo-red.png)
```

![image](https://git.hit.edu.cn/uploads/-/system/appearance/header_logo/1/logo-red.png)

## 标题

```markdown
# H1

## H2

### H3

#### H4
```

> # H1
>
> ## H2
>
> ### H3
>
> #### H4

## 列表

```markdown
- item 1
- item 2
  - item 2.1
  - item 2.2
- item 3

1. item 1
2. item 2
```

- item 1
- item 2
  - item 2.1
  - item 2.2
- item 3

1. item 1
2. item 2

## 代码

````markdown
```cpp
#include <bits/stdc++.h>
```

Using `g++ main.cpp` to compile.
````

```cpp
#include <bits/stdc++.h>
```

Using `g++ main.cpp` to compile.

## 文本

```markdown
Before block

    hello world

After block
```

Before block

    hello world

After block

## 引用

```markdown
> Blockquote
```

> Blockquote

## 表格

```markdown
|  Name  | Age |            Gender |
| :----: | --- | ----------------: |
| Alice  | 16  |            Female |
|  Bob   | 15  |              Male |
| Cherry | 24  | Attack Helicopter |
```

|  Name  | Age |            Gender |
| :----: | --- | ----------------: |
| Alice  | 16  |            Female |
|  Bob   | 15  |              Male |
| Cherry | 24  | Attack Helicopter |

## GFM

```markdown
- [ ] todo
- [x] finished

Link: <https://baidu.com>
```

- [ ] todo
- [x] finished

Link: <https://baidu.com>

## KaTeX

```markdown
$E=mc^2$

$$
\int_{0}^{\frac{\pi}{2}}\frac{\tan{x}}{x}\text{d}x = \frac{\pi}{2} \ln{2}
$$
```

$E=mc^2$

$$
\int_{0}^{\frac{\pi}{2}}\frac{\tan{x}}{x}\text{d}x = \frac{\pi}{2} \ln{2}
$$

# 技术栈

本文简要介绍本项目所使用到的技术。

## 网站前端

### React

[React](https://reactjs.org/) 是最著名的前端框架之一，它的核心思想是将 UI 界面抽象成一个个组件，每个组件都是一个独立的模块，可以复用，也可以嵌套组合。

### Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) 是一个基于类名的 CSS 框架，它的主要特点是提供了一套完整的 CSS 类名，同时提供了一套完整的配置文件，可以让开发者自定义这些类名的样式。

简单来说以前可能需要写很多的 CSS 样式，现在只需要写很少的类名就可以了。

```jsx
// old
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <span style={{ width: '4rem', height: '4rem' }}>
    hello world
  </span>
</div>

// tailwindcss
<div className="flex justify-between items-center">
  <span className="w-16 h-16">
    hello world
  </span>
</div>
```

### DaisyUI

[DaisyUI](https://daisyui.com/) 是一个基于 Tailwind CSS 开发的一套前端样式库，它仅仅提供了一套完整的 UI 框架的样式，并且不包含任何 JavaScript 代码。因此我们可以基于 DaisyUI 完全发挥 Remix 与原生 Web 标准贴合的优势。

```jsx
// 要搞按钮样式直接加类名就可以了
<label className="btn btn-primary btn-square">
  <HiOutlinePlus />
</label>
```

## 后端

### Prisma

[Prisma](https://prisma.io/) 是面向 Node.js 的一个 ORM 框架，它的主要特点是提供了一个统一的数据模型，同时支持多种数据库，包括 MySQL、PostgreSQL、SQLite 等等。

但是我们主要使用 PostgreSQL 进行开发，因此没有在其他数据库下面做过多的测试。

### Server Sent Events

[Server Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) 标准比较小众，但是它是很早就存在的一套基于 HTTP 的事件流协议，它可以让浏览器与服务器之间建立一个长连接，然后服务器可以通过这个连接向浏览器推送事件。与 WebSocket 技术相比，它的优势在于不需要额外的协议，因此可以在任何支持 HTTP 的环境下直接使用。

## 其他

### Remix

[Remix](https://remix.run/) 是主要基于 Node.js 开发的一个全栈开发框架，主要简化了前后端之间数据的交互复杂性，同时提供了一套完整的全栈开发框架，包括了前端路由、全局状态管理、前后端数据同步等等。

Remix 设计理念为贴近 Web 标准，由于前后端都为 JavaScript 运行时，因此大多数的表单提交都是通过 HTML 默认的 `<form />` 标签来提交，并在后端直接使用 `request.formData()` 来获取表单数据，整个过程甚至可以完全不在前端运行任何脚本。

### RxJS

[RxJS](https://rxjs.dev/) 主要是一个基于事件编程的代码框架。它提供了一套完整的事件流编程模型，可以让开发者更加方便的处理以往必须要用 EventEmitter 才能处理的事件。

通过结合 RxJS 和 SSE 技术我们可以非常优雅地实现后端向前端推送消息的模型。

## 评测机

~~评测机使用 Rust 语言实现。~~

TODO @zhuodarui

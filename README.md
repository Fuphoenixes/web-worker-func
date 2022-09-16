## web-worker-func
---

1. 更简单的webWorker使用方法，无需添加额外的worker.js文件
2. [source code](https://github.com/Fuphoenixes/web-worker-func)

## Install

```
npm install web-worker-func
```
or
```
yarn add web-worker-func
```

## Usage

```javascript
import webWorkerBuilder from 'web-worker-func'

const numbers = [...Array(5000000)].map(e => ~~(Math.random() * 1000000));
const sortFunc = nums => nums.sort();

const webWorkerSortFunc = webWorkerFuncBuilder(sortFunc)

webWorkerSortFunc(numbers)
  .then((res) => {
    // 返回在webWoker中计算好的结果
    console.log(res)
  })
```
支持 umd(dist/index.umd.js)、 esm(dist/index.esm.js) 、 cjs(dist/index.js) 各种模式引入

eg: 可直接在html中引入 `<script src="../dist/index.umd.js" type="text/javascript"></script>` 然后使用`window.webWorkerFuncBuilder


## API
```ts
type Func = (...args: any) => any;

type WebWorkerBuilder = <T extends Func>(fn: T, options?: Options) => (...args: Parameters<T>) => Promise<ReturnType<T>>;

type Options = {
  timeout?: number; 
  importScripts?: string[]; 
  transferable?: boolean;
};
```
- options
    - timeout 过期时间设置
    - importScripts  worker文件引入的依赖
    - transferable (可转让对象)是否使用高性能的通过转让所有权的方式来传递数据, 具体可[参考MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers#%E9%80%9A%E8%BF%87%E8%BD%AC%E8%AE%A9%E6%89%80%E6%9C%89%E6%9D%83_%E5%8F%AF%E8%BD%AC%E8%AE%A9%E5%AF%B9%E8%B1%A1_%E6%9D%A5%E4%BC%A0%E9%80%92%E6%95%B0%E6%8D%AE)

## thanks
- [useWorker](https://github.com/alewin/useWorker/blob/1ceb211fc0cbd3cb4b72b6a7f4d36e16c339109c/packages/useWorker/package.json)

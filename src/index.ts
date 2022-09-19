
type Func = (...args: any) => any

type WebWorkerBuilder = <T extends Func>(fn: T, options?: Options) => (...args: Parameters<T>) => Promise<ReturnType<T>>

type CreateWorkerBlobUrl = (fn: Func, importScripts: string[], depsFunc: Func[], transferable: boolean) => string

type Options = {
  timeout?: number, // 过期时间
  importScripts?: string[], // worker依赖的js文件
  depsFunc?: Func[], // fn函数运算时依赖的函数
  // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#passing_data_by_transferring_ownership_transferable_objects
  transferable?: boolean // (可转让对象)是否使用高性能的通过转让所有权的方式来传递数据
}

const defaultOptions = {
  timeout: 0,
  importScripts: [],
  depsFunc: [],
  transferable: true
}

const jobRunner = ({ fn, transferable }: { fn: Func, transferable: boolean }) => (e: MessageEvent) =>  {
  const userFuncArgs = e.data as any[]
  try {
    const result = fn(...userFuncArgs)

    const isTransferable = (val: any) => (
      ('ArrayBuffer' in self && val instanceof ArrayBuffer)
      || ('MessagePort' in self && val instanceof MessagePort)
      || ('ImageBitmap' in self && val instanceof ImageBitmap)
      // @ts-ignore
      || ('OffscreenCanvas' in self && val instanceof self.OffscreenCanvas)
    )
    const transferList: any[] = transferable && isTransferable(result) ? [result] : []
    // @ts-ignore
    postMessage(['SUCCESS', result], transferList)
  } catch (e) {
    // @ts-ignore
    postMessage(['ERROR', e])
  }

}

const importScriptsParser = (importScripts: string[]) => {
  if (importScripts.length === 0) return ''
  const scriptsString = (importScripts.map(script => `'${script}'`)).toString()
  return `importScripts(${scriptsString});`
}

const depsFuncParser = (depsFunc: Func[]) => {
  if (depsFunc.length === 0) return ''
  const funcString = (depsFunc.map(func => {
    return `var ${func.name} = ${func}`
  })).join(';')
  return funcString
}

const createWorkerBlobUrl: CreateWorkerBlobUrl = (fn, importScripts,  depsFunc, transferable) => {
  const blobCode = `
    ${importScriptsParser(importScripts)}
    ${depsFuncParser(depsFunc)}
    onmessage=(${jobRunner})({ fn: (${fn}), transferable: ${transferable} })
  `
  // console.log(blobCode)
  const blob = new Blob([blobCode], { type: 'text/javascript' })
  return URL.createObjectURL(blob)
}

const webWorkerBuilder: WebWorkerBuilder = (fn, _options) => {

  const options = Object.assign(defaultOptions, _options)

  return (...args) => {
    return new Promise(((resolve, reject) => {

      let timeoutId: number
      const blobUrl = createWorkerBlobUrl(fn, options.importScripts, options.depsFunc, options.transferable)
      const worker = new Worker(blobUrl)

      const killWorker = (): void => {
        worker.terminate()
        URL.revokeObjectURL(blobUrl)
        if (options.timeout) window.clearTimeout(timeoutId)
      }

      // 发信息到worker
      const transferList: any[] = options.transferable ? (
        args.filter((val: any) => (
          ('ArrayBuffer' in window && val instanceof ArrayBuffer)
          || ('MessagePort' in window && val instanceof MessagePort)
          || ('ImageBitmap' in window && val instanceof ImageBitmap)
          // @ts-ignore
          || ('OffscreenCanvas' in window && val instanceof window.OffscreenCanvas)
        ))
      ) : []
      worker.postMessage([...args], transferList)

      worker.onmessage = (e) => {
        const [status, result] = e.data

        if (status === 'SUCCESS') {
          resolve(result)
          killWorker()
        } else {
          reject(result)
          killWorker()
        }
      }

      worker.onerror = (e) => {
        reject(e)
        killWorker()
      }

      if (options.timeout) {
        timeoutId = window.setTimeout(() => {
          reject('worker timeout')
          killWorker()
        }, options.timeout)
      }

    }))
  }
}


export default webWorkerBuilder

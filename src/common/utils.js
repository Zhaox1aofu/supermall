 // 防抖函数起作用的过程：
// 如果外面直接执行refresh，那么refresh函数会被执行30次
// 可以将refresh传入debounce函数中，生成一个新的函数

 export function debounce(func, delay) {
  let timer = null

  return function (...args) {
    if(timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

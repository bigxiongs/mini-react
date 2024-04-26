const queue = []
const threshold = 5
const transitions = []
let deadline = 0
let work

const now = () => performance.now()
export const shouldYield = () => now() >= deadline

const peek = (queue) => queue[0]

const task = (pending) => {
  const cb = () => transitions.splice(0, 1).forEach((c) => c())
  return pending ? () => setTimeout(cb) : () => queueMicrotask(cb)
}

let translate = task(false)

const startTransition = (cb) => {
  transitions.push(cb) && translate()
}

export const schedule = (callback) => {
  queue.push({ callback })
  startTransition(flush)
}

const flush = () => {
  deadline = now() + threshold
  while ((work = peek(queue)) && !shouldYield()) {
    work.callback = work.callback()
    if (!work.callback) queue.shift()
  }
  if (work && work.callback != null) {
    translate = task(shouldYield())
    startTransition(flush)
  }
}

export default {
  schedule,
  shouldYield
}

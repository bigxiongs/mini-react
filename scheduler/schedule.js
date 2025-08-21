import { Heap } from './minHeap'

const queue = Heap([], (a, b) => a.startTime !== b.startTime ? a.startTime - b.startTime : a.priority - b.priority)

const threshold = 5
const transitions = []
let deadline = 0
let work

const now = () => performance.now()
export const shouldYield = () => now() >= deadline

const task = (pending) => {
  const cb = () => transitions.splice(0, 1).forEach((c) => c())
  return pending ? () => setTimeout(cb) : () => queueMicrotask(cb)
}

let translate = task(false)

const startTransition = (cb) => {
  transitions.push(cb) && translate()
}

export const schedule = (task, option = {}) => {
  const { priority = 3, delay = 0 } = option;
  const startTime = now() + delay;
  queue.push({priority, startTime, ...task});
  startTransition(flush)
}

const flush = () => {
  deadline = now() + threshold
  while ((work = queue.peek()) && !shouldYield()) {
    if (work.startTime > now()) break
    if (work.canceled) {
      queue.pop()
      continue
    }
    work.callback = work.callback()
    if (!work.callback) queue.pop()
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

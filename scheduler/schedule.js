const queue = []
const threshold = 5
const transitions = []
let deadline = 0

export const shouldYield = () => now() >= deadline
const now = () => performance.now()

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
  let work = peek(queue)
  while (work && !shouldYield()) {
    const { callback } = work
    work.callback = null
    const next = callback()
    if (next) {
      work.callback = next
    } else {
      queue.shift()
    }
    work = peek(queue)
  }
  work && (translate = task(shouldYield())) && startTransition(flush)
}

export default {
  schedule,
  shouldYield
}

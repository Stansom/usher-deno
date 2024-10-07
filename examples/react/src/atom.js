// import { log } from "./logger.js";
/**
 * Creates an Atom object
 * You can subscribe to it to watch the changes
 * @param initValue of type T
 * @constructor
 *
 * @example
 * let counter = Atom(10);
 * counter.addWatcher(console.log);
 * counter.update((oldValue) => oldValue + 1);
 * =>> Logs to console "11"
 * counter.update((oldValue) => oldValue + 1);
 * =>> Logs to console "12"
 */
function Atom(initValue) {
  // log({ type: 'debug' }, "ATOM: initializing");
  let value = initValue;
  const watchers = [];
  return {
    val: () => value,
    update: (f) => {
      const oldValue = value;
      const newValue = f(value);
      if (oldValue !== newValue) {
        value = newValue;
        watchers.forEach((watcher) => watcher(newValue));
      }
    },
    set: (val) => {
      const oldValue = value;
      if (val !== oldValue) {
        value = val;
        watchers.forEach((watcher) => watcher(val));
      }
    },
    addWatcher: (watcher) => watchers.push(watcher),
    removeWatcher: (watcher) => {
      watchers.splice(watchers.indexOf(watcher), 1);
    },
  };
}
export { Atom };

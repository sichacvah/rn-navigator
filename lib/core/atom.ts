
type WatcherFn<T>   = (key: string, atom: Atom<T>, prev: T, next: T) => void
type SwapFn<T>      =  (state: T, ...args: any[]) => T
type ValidatorFn<T> = (next: T) => boolean
export interface Atom<T = any> {
  addWatch: (key: string, watcher: WatcherFn<T>) => void,
  removeWatch: (key: string) => void,
  swap: (fn: SwapFn<T>, ...args: any[]) => void,
  deref: () => T,
  reset: (v: T) => void,
  toString: () => string
}
interface Options<T> {
  validator?: ValidatorFn<T>
}

export function createAtom<T>(val: T, options: Options<T> = {}): Atom<T> {
  var watchers: { [key: string]: WatcherFn<T> } = {};
  var validator = options && options.validator || function () { return true; };

  function transition(next: T): void {
      if (!validator(next)) {
          var err = new Error(next + " failed validation");
          err.name = "AssertionError";
          throw err;
      }

      var prev = val;
      val = next;

      Object.keys(watchers).forEach(function (k) {
          watchers[k](k, atom, prev, next);
      });
  }

  let atom: Atom<T> = {
      addWatch: function (key: string, fn: WatcherFn<T>) {
          watchers[key] = fn;
      },

      removeWatch: function (key: string) {
          delete watchers[key];
      },

      swap: function (fn: SwapFn<T>, ...args: any[]) {
          transition(fn(val, ...args));
      },

      reset: function (v: T) {
          transition(v);
      },

      deref: function (): T {
          return val;
      },

      toString: function () {
          return "Atom(" + JSON.stringify(val) + ")";
      }
  };

  return atom;
};


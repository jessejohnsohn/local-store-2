import { noop, Subject, Observable, of, ReplaySubject, defer } from "rxjs";
import { scan, startWith, map, tap, mapTo } from "rxjs/operators";

export class LocalStore {
  private readonly _actions = new ReplaySubject<any>();

  readonly actions$ = this._actions.asObservable();
  config: any;
  constructor(config: any) {
    this._actions.next(config[0]);
    this.config = config;
  }

  state$ = this._actions.pipe(
    scan((a, c) => {
      return this.config[a()[c.name]] || a;
    }),
    map(s => s.name)
  );

  context$ = this._actions.pipe(
    scan((a, c) => {
      const nextState = this.config[a()[c.name]];
      return nextState ? ({ state: nextState, payload: c.payload }) : a;
    }),
    map(state => state.payload)
  );

  dispatch(action: any) {
    this._actions.next(action);
  }
}
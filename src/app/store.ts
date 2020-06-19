import { Component, VERSION, OnInit, Injectable, Inject, InjectionToken, Optional } from '@angular/core';
import { noop, Subject, Observable, Subscription, ReplaySubject } from 'rxjs';
import { scan, startWith, map, tap } from 'rxjs/operators'

export function createStore<T>(initialState: any, ...props: any) {
  return class T extends Store<T> {
    constructor() {
      super(createReducer(initialState, props))
    }
  }
}


export const INITIAL_STATE = new InjectionToken('initial-state');

type ActionMaker<T> = (payload?: T) => ({ name: string, payload?: T });

export function action<T>(name: string): { [key:string]: ActionMaker<any> } {
  return ({
    [name]: (payload: T) => ({ name, payload })
  });
}

// needs to take fuctions
export function createActions(...fns: { [key:string]: ActionMaker<any> }[]) {
  return fns.reduce((a, c) => ({ ...a, ...c }), {});
}
  

export const createReducer = (initialState: any, ...props: {[key: string]: (state, payload) => any}[]) => 
props.reduce((a, c) => ({ ...a, ...c}), initialState);

const nameof = obj => Object.keys(obj)[0];

export const on = (action, setState: (state, payload) => any) => ({ [action.name]: setState });


interface Action<T> {
  name?: string,
  payload?: any
}

// export function LocalStore<T>(config: any) { 
//   return ({
//     provide: Store,
//     useFactory: storeFactory<T>(config.reducer),
//     deps: []
//   });
// };

// function storeFactory<T>(reducer: any) {
//   return () => new Store<T>(reducer);
// };

export abstract class Store<T> {
  private readonly subscriptions: Subscription[] = [];
  private readonly actions = new ReplaySubject<Action<T>>();

  constructor(private readonly reducer: any) { }

  public actions$ = this.actions.asObservable();

  protected readonly state$ = this.actions.pipe(
    scan((a, c) => this.reducer[c.name] ? this.reducer[c.name](a, c.payload) : a, {} as T),
  )
  
  select(fn: (state: T) => any): Observable<any> {
    return this.state$.pipe(
      map(fn)
    )
  }

  connect(stream$: Observable<Action<T>>) {
    this.subscriptions.push(stream$.subscribe(action => this.actions.next(action)));
  }
  
  disconnect() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  dispatch(action: Action<T>) {
    this.actions.next(action);
  }
}
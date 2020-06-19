import { Component, VERSION, OnInit, Injectable, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { noop, Subject, Observable } from 'rxjs';
import { scan, startWith, map } from 'rxjs/operators'
import { INITIAL_STATE, Store, on, createReducer, action, createActions } from './store';
import { FormControl } from '@angular/forms';

// const state = {
//   resultState: {
//     fetching: {},
//     zeroResults: {},
//     greaterThanZeroResults: {},
//     error: {}
//   },
//   refetchingState: {
//     notRefetching: {},
//     refetching: {},
//     error: {}
//   },
// }

interface AppComponentState {
  isLoading?: boolean;
  name?: string;
  formValue?: any;
}

const actions = createActions(
  action<void>('button1Pressed'),
  action<number>('button2Pressed'),
  action<any>('formUpdated')
)

const appReducer = createReducer(
  on(actions.button1Pressed, state => ({ ...state, isLoading: !state.isLoading })),
  on(actions.button2Pressed, (state, payload) => ({ ...state, size: payload })),
  on(actions.formUpdated, (state, payload) => ({ ...state, formValue: payload }))
);

const appEffects = {};

export class AppStore extends Store<AppComponentState> {
  constructor() {
    super(appReducer)
  }
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  providers: [AppStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  form = new FormControl('');
  state$ = this.store.select(state => state);

  constructor(private readonly store: AppStore) { }

  ngOnInit() {
    this.store.connect(this.form.valueChanges.pipe(map(val => actions.formUpdated(val))));
  }

  onClick1() {
    this.store.dispatch(actions.button1Pressed());
  }

  onClick2() {
    this.store.dispatch(actions.button2Pressed(750));
  }

  ngOnDestroy() {
    this.store.disconnect();
  }
}

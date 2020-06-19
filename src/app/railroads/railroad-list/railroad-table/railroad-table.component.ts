import { Component, OnInit, ChangeDetectionStrategy, Input, Injectable } from '@angular/core';
import { action, createActions } from "../../../store";
import { LocalStore } from "../../../local-store";
import { RailroadListStore } from '../railroad-list.component'

const actions = createActions(
  action<void>("loadButtonClicked"),
  action<void>("noResultsReturned"),
  action<void>("moreThanOneResultLoaded"),
  action<void>("errorLoadingRailroads")
);

var config = {
  0: () => ({
    noResultsReturned: 1,
    moreThanOneResultLoaded: 2,
    errorLoadingRailroads: 3
  }),
  1: () => ({
    loadButtonClicked: 0
  }),
  2: () => ({
    loadButtonClicked: 0
  }),
  3: () => ({
    loadButtonClicked: 0
  })
};

@Injectable()
class RailroadTableStore extends LocalStore {
  constructor(store: RailroadListStore) {
    super(config);
    store.actions$.subscribe(a => this.dispatch(a))
  }
}

@Component({
  selector: 'app-railroad-table',
  templateUrl: './railroad-table.component.html',
  providers: [RailroadTableStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RailroadTableComponent {
  state$ = this.store.state$;
  context$ = this.store.context$;
  
  constructor(private readonly store: RailroadTableStore) { }
}
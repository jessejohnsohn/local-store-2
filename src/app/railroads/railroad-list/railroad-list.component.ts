import { Component, ChangeDetectionStrategy, Injectable } from "@angular/core";
import { ReplaySubject, of } from "rxjs";
import { scan, map, tap } from "rxjs/operators";
import { action, createActions } from "../../store";
import { LocalStore } from "../../local-store";
import { FormControl } from "@angular/forms";

enum state {
  initializing = 0,
  initialized = 1,
  error = 2
}

const actions = createActions(
  action<void>("loadButtonClicked"),
  action<void>("noResultsReturned"),
  action<Railroad>("moreThanOneResultLoaded"),
  action<void>("errorLoadingRailroads"),
  action<void>("initialized"),
  action<string>("error"),
  action<void>("retry")
);

var config = {
  0: () => ({
    initialized: 1,
    error: 2
  }),
  1: () => ({
    retry: 0
  }),
  2: () => ({
    retry: 0
  })
};

@Injectable()
export class RailroadListStore extends LocalStore {
  constructor() {
    super(config);
  }
}

interface Railroad {
  name?: string;
  code?: string;
  city?: string;
  state?: string;
}

const railroads: Railroad[] = [
  {
    name: "Amtrak",
    code: "AT"
  },
  {
    name: "Burlington Northern Sante Fe",
    code: "BNSF",
    city: "Fort Worth",
    state: "TX"
  }
];

@Component({
  selector: "app-railroad-list",
  templateUrl: "./railroad-list.component.html",
  providers: [RailroadListStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RailroadListComponent implements OnInit {
  readonly state$ = this.store.state$;
  readonly context$ = this.store.context$;
  readonly fc = new FormControl("");

  constructor(private readonly store: RailroadListStore) { }

  sync() {}

  load() {
    this.store.dispatch(actions.loadButtonClicked());
  }

  noResults() {
    this.store.dispatch(actions.noResultsReturned());
  }

  manyResults() {
    this.store.dispatch(actions.moreThanOneResultLoaded(railroads));
  }

  errors() {
    this.store.dispatch(actions.errorLoadingRailroads());
  }

  retry() {
    this.store.dispatch(actions.retry());
  }

  initialized() {
    this.store.dispatch(actions.initialized());
  }

  initializationError() {
    this.store.dispatch(actions.error("Error loading component"));
  }
}

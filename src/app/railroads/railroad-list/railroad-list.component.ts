import {
  Component,
  ChangeDetectionStrategy,
  Injectable,
  OnInit
} from "@angular/core";
import { ReplaySubject, of, Observable } from "rxjs";
import {
  scan,
  map,
  tap,
  distinctUntilChanged,
  delay,
  first,
  filter,
  takeUntil
} from "rxjs/operators";
import { action, createActions } from "../../store";
import { LocalStore } from "../../local-store";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RailroadListService } from "./railroad-list.service";
import { Railroad } from './railroad-list.service';

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
    resync: 0
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


@Injectable()
class RouteSyncer {
  connect(subject: {
    setValue: (value: any) => void;
    valueChanges: Observable<any>;
  }) {}
}

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

  constructor(
    private readonly store: RailroadListStore,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: RailroadListService
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(
        first(),
        delay(2000),
        takeUntil(this.store.state$.pipe(filter(state => state === '2'))),
      )
      .subscribe(p => {
        this.fc.setValue(p.search, { emitEvent: false });
        this.store.dispatch(actions.initialized());
      });
    this.fc.valueChanges.subscribe(search => {
      this.router.navigate([], { queryParams: { search } });
    });
    this.state$.subscribe(state => {
      if (state !== "1") {
        this.fc.disable({ emitEvent: false });
      } else {
        this.fc.enable({ emitEvent: false });
      }
    });

    this.service.railroads$.subscribe(results => { 
      if (results.length > 0) {
        this.store.dispatch(actions.moreThanOneResultLoaded(results));
      } else {
        this.store.dispatch(actions.noResultsReturned());
      }
    });
  }

  refresh() {
    location.reload();
  }

  load() {
    this.store.dispatch(actions.loadButtonClicked());
  }

  noResults() {
    this.store.dispatch(actions.noResultsReturned());
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

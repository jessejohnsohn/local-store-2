import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, tap, mapTo } from "rxjs/operators";

export interface Railroad {
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

@Injectable()
export class RailroadListService {
  constructor(private readonly route: ActivatedRoute) {}

  readonly railroads$ = this.route.queryParams.pipe(
    map(({ search }) => railroads.filter(r => r.name.toLowerCase().indexOf(search) > -1)),
  );
}

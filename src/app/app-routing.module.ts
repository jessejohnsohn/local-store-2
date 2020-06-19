import { Routes, RouterModule } from "@angular/router";
import { appPaths } from "./app.routes";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: appPaths.railroads,
    loadChildren: () =>
      import("./railroads/railroads.module").then(m => m.RailroadsModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload",
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

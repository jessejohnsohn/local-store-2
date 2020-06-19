import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RailroadListModule } from './railroad-list/railroad-list.module';
import { railroadPaths } from './railroads.routes';
import { RailroadListComponent } from './railroad-list/railroad-list.component';

const routes: Routes = [
  {
    path: railroadPaths.default,
    redirectTo: railroadPaths.list,
    pathMatch: 'full'
  },
  {
    path: railroadPaths.list,
    loadChildren: () =>
      import('./railroad-list/railroad-list.module').then(
          m => m.RailroadListModule
      ),
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
})
export class RailroadsModule { }
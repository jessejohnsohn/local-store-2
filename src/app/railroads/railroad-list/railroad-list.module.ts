import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RailroadListComponent } from './railroad-list.component';
import { RouterModule, Routes } from '@angular/router';
import { railroadListPaths } from './railroad-list.routes';
import { RailroadTableComponent } from './railroad-table/railroad-table.component';

const routes: Routes = [
  {
    path: railroadListPaths.default,
    component: RailroadListComponent
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RailroadListComponent, RailroadTableComponent],
  exports: [
    RailroadListComponent
  ]
})
export class RailroadListModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RailroadListComponent } from './railroad-list.component';
import { RouterModule, Routes } from '@angular/router';
import { railroadListPaths } from './railroad-list.routes';
import { RailroadTableComponent } from './railroad-table/railroad-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RailroadListService } from './railroad-list.service';

const routes: Routes = [
  {
    path: railroadListPaths.default,
    component: RailroadListComponent
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [RailroadListComponent, RailroadTableComponent],
  exports: [
    RailroadListComponent
  ],
  providers: [RailroadListService]
})
export class RailroadListModule { }
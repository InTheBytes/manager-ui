import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './app.component';
import { OrderComponent } from './order/order/order.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
      path: 'home',
      component: HomeComponent,
      pathMatch: 'full'
  },
  {
    path: 'orders',
    component: OrderComponent,
    pathMatch: 'full'
  },
  {
    path: 'order-history',
    component: OrderComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

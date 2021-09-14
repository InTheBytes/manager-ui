import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { OrderViewConciseComponent } from './order-view-concise/order-view-concise.component';
import { PaginationModule } from '../pagination/pagination.module';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs'
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    OrderComponent,
    OrderViewComponent,
    OrderViewConciseComponent
  ],
  imports: [
    CommonModule,
    PaginationModule,
    RouterModule,
    
    MatExpansionModule,
    MatListModule,
    CdkAccordionModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule
  ]
})
export class OrderModule { }

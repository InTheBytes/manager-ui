import { Component, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PaginationService } from '../pagination.service';

@Component({
  selector: 'app-page-controller',
  template: `
    <ng-template #pageControl>
      <mat-paginator 
        [length]="totalElements"
        [pageSize]="currentSize"
        [pageSizeOptions]="[1, 5, 10, 15, 25, 50]"
        (page)="onPageChange($event)"
        aria-label="page control">
      </mat-paginator>
    </ng-template>
    
    <ng-container *ngTemplateOutlet="pageControl"></ng-container>
    <ng-content></ng-content>
    <ng-container *ngTemplateOutlet="pageControl"></ng-container>
  `,
  styles: []
})
export class PageControllerComponent {
  
  @Input("totalElements") totalElements!: number
  @Input("currentSize") currentSize!: number
  @Input("paginator") paginator!: PaginationService<any>

  constructor() { }

  onPageChange(event: PageEvent): void {

    if (this.currentSize != event.pageSize) {
      this.currentSize = event.pageSize
      this.paginator.changeSize(event.pageSize)
    }

    let indexDiff = (typeof event.previousPageIndex != 'undefined') ? 
      event.pageIndex - event.previousPageIndex : 0

    if (indexDiff !== 0) {
      if (Math.abs(indexDiff) > 1) {
        this.paginator.changePage(event.pageIndex);
      } else {
        (indexDiff === 1) ? this.paginator.next() : this.paginator.previous()
      }
    }
  }

}

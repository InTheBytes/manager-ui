import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSpinner } from '@angular/material/progress-spinner';
import { RestaurantService } from '../restaurant.service';
import { Food, Restaurant } from '../restaurant.type';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styles: [
    `.restaurant-card {margin: 0 auto; width: 70%; height: 100%}`,
    `.restaurant-header {justify-content: center}`,
    `.button-dash {display: flex; justify-content: center}`,
    `.food-card {float: left; margin: 5%}`
  ]
})
export class RestaurantDetailsComponent implements OnInit {

  restaurant!: Restaurant

  dialogRef!: MatDialogRef<any>

  menuItemWidth!: string

  constructor(
    public breakpoints: BreakpointObserver,
    public service: RestaurantService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dialog.open(MatSpinner, {
      panelClass: 'transparent',
      disableClose: true
    })
    this.service.signUp().subscribe(
      response => {
        this.restaurant = response
        this.dialog.closeAll()
      }
    )
    
    this.breakpoints.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe((result) => {
      if (result.breakpoints["(min-width: 960px) and (max-width: 1279.98px)"] ||
        result.breakpoints["(min-width: 1280px) and (max-width: 1919.98px)"] ||
        result.breakpoints["(min-width: 1920px)"]) 
      {
        this.menuItemWidth = "35%"
      } else {
        this.menuItemWidth = "80%"
      }
    })
  }

  openEditor(itemTemplate: TemplateRef<any>): void {
    this.dialogRef = this.dialog.open(itemTemplate)
  }

  closeEditor(): void {
    this.dialogRef.close()
  }
}
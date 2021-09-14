import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { PageControllerComponent } from "./page-controller/page-controller.component";

@NgModule({
    declarations: [
        PageControllerComponent
    ],
    imports: [
        CommonModule,
        MatPaginatorModule
    ],
    exports: [
        PageControllerComponent
    ]
})
export class PaginationModule { }
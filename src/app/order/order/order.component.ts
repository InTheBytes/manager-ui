import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginationService } from 'src/app/pagination/pagination.service';
import { environment } from 'src/environments/environment';
import { Order } from '../order.type';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: [
    `mat-card { margin: 3% auto 0 auto; }`,
    `.big-screen-button, .small-screen-button { margin: 2% auto 0 auto; height: 5%; }`,
    `a { margin-left: auto; margin-right: 0; }`,
    `h2 { 
      display: flex;
      justify-content: center;
      color: #2699FB; 
      font-family: Georgia, Times, 'Times New Roman', serif; 
      font-size: 2.5em;
      line-height: 2em;
    }`
  ],
  providers: [PaginationService]
})
export class OrderComponent implements OnInit {

  buttonText: string = 'Complete Order'
  showDate: boolean = false

  startingSize: number = 5 

  statusParam: number = 1
  dayParam: string = "today"
  paramString: string = ""
  isHistory!: boolean

  orders!: Order[]
  totalElements!: number
  bigScreen: boolean = true
  contentWidth!: string

  tabIndex: number = 0

  constructor(
    public breakpointObserver: BreakpointObserver,
    public paginator: PaginationService<Order>,
    public route: ActivatedRoute,
    public http: HttpClient
  ) { }

  makeParams(): string {
    return `status=${this.statusParam}&day=${this.dayParam}`
  }

  ngOnInit(): void {
    this.isHistory = this.route.snapshot.url[0].path.includes('history')
    let params: string = ""

    if (this.isHistory) {
      this.showDate = true
      this.buttonText = ""
    } else {
      params = this.makeParams()
    }


    this.paginator.signUp("order", this.startingSize, params).subscribe(
      (resp) => {
        this.totalElements = resp.totalElements
        this.orders = resp.content
      }
    )

    this.breakpointObserver.observe([
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe((result) => {
      this.bigScreen = result.breakpoints["(min-width: 960px) and (max-width: 1279.98px)"] ||
        result.breakpoints["(min-width: 1280px) and (max-width: 1919.98px)"] ||
        result.breakpoints["(min-width: 1920px)"]
      this.contentWidth = (this.bigScreen) ? "50%" : "90%"
      this.contentWidth = (result.breakpoints["(min-width: 960px) and (max-width: 1279.98px)"]) ? "80%" : this.contentWidth
    })

    this.route.url.subscribe(
      (urls) => {
        this.isHistory = this.route.snapshot.url[0].path.includes('history')
        if (this.isHistory) {
          this.paginator.changeParams("")
        } else {
          this.paginator.changeParams(this.makeParams())
        }
      }
    )
  }

  onTabChange(): void {
    this.statusParam = 1
    this.dayParam = "today"
    let params: string
    switch (this.tabIndex) {
      case 0:
        params = this.makeParams()
        this.buttonText = 'Complete Order'
        this.showDate = false
        break
      case 1:
        this.dayParam = "future"
        params = this.makeParams()
        this.buttonText = ''
        this.showDate = true
        break
      case 2:
        this.statusParam = 2
        params = this.makeParams()
        this.buttonText = ''
        this.showDate = false
        break
      default:
        params = ""
        this.buttonText = ''
        this.showDate = true
    }
    this.paginator.changeParams(params)
  }

  makeOrderUpdate(order: Order): any {
    let newOrder: any = Object.assign({}, order)
    delete newOrder['restaurant']
    delete newOrder['customer']
    delete newOrder['id']
    delete newOrder['windowStart']
    delete newOrder['windowEnd']
    delete newOrder['specialInstructions']
    newOrder['restaurantId'] = order.restaurant.id
    newOrder['customerId'] = order.customer.id
    newOrder['status'] = 2
    newOrder['driverId'] = null
    return newOrder
  }

  onCompleteOrder(order: Order) {
    this.http.put(`${environment.apiUrl}/order/${order.id}`, this.makeOrderUpdate(order)).subscribe(
      resp => this.paginator.getPage()
    )
  }

}
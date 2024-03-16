import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  myOrders: any = [];
  deliveredOrders: any;
  Pending: any;

  constructor(private userService: UserService){}
  
  ngOnInit(): void {
    this.getMyOrders()
  }

  async getMyOrders(){
    this.myOrders =  await this.userService.getMyOrders()
    this.deliveredOrders =  this.myOrders.filter(order => order.status === 'Delivered').length;
    this.Pending =  this.myOrders.filter(order => order.status === 'Pending').length;
  }
}

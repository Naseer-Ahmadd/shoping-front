import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  myOrders:any;
  constructor(private router: Router, private userService: UserService, private toastr: ToastrService){

  }

  ngOnInit(): void {

    this.getMyOrders()

  }

  async getMyOrders(){
    this.myOrders =  await this.userService.getMyOrders()
    console.log('this.myOrders :', this.myOrders);
  }

}

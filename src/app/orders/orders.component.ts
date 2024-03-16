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
  dropdownOpen: boolean = false;
  sortedOrders: any[] = [];
  constructor(private router: Router, private userService: UserService, private toastr: ToastrService){

  }

  ngOnInit(): void {

    this.getMyOrders()

  }

  async getMyOrders(){
    this.myOrders =  await this.userService.getMyOrders()
    // console.log('this.myOrders :', this.myOrders);
    this.myOrders.sort((a, b) => {
      const dateA = new Date(a?.orderDate || 0);
      const dateB = new Date(b?.orderDate || 0);
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateB.getTime() - dateA.getTime();
      } else {
        // Handle cases where orderDate is not a valid date
        return 0; // No change in order
      }
    });
    
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  sortBy(type){
  this.sortedOrders = this.myOrders.filter(order => order.status === type);
  this.dropdownOpen = false
  }

}

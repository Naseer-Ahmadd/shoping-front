import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../services/authservice.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
declare var $: any;



@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isLoggedin: boolean =false;
  cartCount: number;

  constructor(
    private authService: AuthserviceService,
    private toastrService: ToastrService,
    private router: Router,
    private userService: UserService
  ) { 
    this.userService.getCartCount()
    this.userService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedin = true;
    }

  }

  checkClass(){
    $('.modal-backdrop').remove();
  }


  isUserLoggedin(){
    if(this.authService.isLoggedin()){
      this.router.navigate(['/cart'])
    }else{
      this.checkClass()
      $('#login-modal').modal('show')
      // this.toastrService.warning('Please login to view your cart');
    }
  }

  navigateToAccount(){
    if(this.authService.isLoggedin()){
      this.router.navigate(['/account'])
    }else{
      this.checkClass()
      $('#login-modal').modal('show')
      // this.toastrService.warning('Please login to view your cart');
    }
  }

}

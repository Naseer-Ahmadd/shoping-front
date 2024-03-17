import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../services/authservice.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
declare var $: any;



@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isLoggedin: boolean =false;
  cartCount: number;
  allCategories: any;

  constructor(
    private authService: AuthserviceService,
    private toastrService: ToastrService,
    private router: Router,
    private userService: UserService,
    private catService: CategoriesService
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
    this.getCategories()
  }

  getCategories(){
    this.catService.getCategories()
     .then((categories) => {
       this.allCategories = categories;
     })
     .catch((error: any) => {
     console.log('error :', error);
     });
   }
 
 
   browseCat(link){
    const l0CatMatch = link.match(/l0_cat=(\d+)/);
    if (l0CatMatch && l0CatMatch[1]) {
      const l0CatNumber = l0CatMatch[1];
      this.router.navigate([ '/products'], { queryParams: { catId: Number(l0CatNumber) } });
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

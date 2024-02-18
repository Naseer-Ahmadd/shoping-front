import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgFor, NgIf } from '@angular/common'; 
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
declare var $: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {

    
    constructor(private authService: AuthserviceService, private router: Router, private userService: UserService, private toastr: ToastrService,){

  }

ngOnInit(): void {
}

logout(){
  $('.modal-backdrop').remove();
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('phone')
  // this.isLoggedin = false;
  this.authService.signOut()
  this.router.navigate(['/'])
}

}

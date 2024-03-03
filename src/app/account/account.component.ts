import { Component, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgFor, NgIf } from '@angular/common'; 
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgForm } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  @ViewChild('updateEmailModal') updateEmailModal: NgbModalRef;
  ModelReference: NgbModalRef;
  user: any;
  userEmail: string = '';
  updateEmailForm: NgForm;
  userName: string = '';
    
  constructor(private ngbModalService: NgbModal,private authService: AuthserviceService, private router: Router, private userService: UserService, private toastr: ToastrService,){

  }

  ngOnInit(): void {
    this.getUser()
  }


  getUser(){
    
    this.userService.getUser().then((user) => {
      // console.log('user :', user);
      this.user = user
      if(!user.email){
        // console.log('no email');
        // this.ModelReference = this.ngbModalService.open(this.updateEmailModal);
        this.ModelReference = this.ngbModalService.open(this.updateEmailModal, {
          backdrop: 'static',
          keyboard: false
        });
      }
    })
    .catch((error: any) => {
      console.log('error :', error);
    });
  }


  updateEmail(){
    // console.log('this.userEmail :', this.userEmail);
    // console.log('this.userName :', this.userName);
    let userData = {
      userEmail: this.userEmail,
      userName: this.userName
    }
    this.userService.updateUserData(userData).then(res=>{
      this.toastr.success('Email added successfully')
      this.ModelReference.close()
    }).catch(err=>{
    console.log('err Email:', err);
    })
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

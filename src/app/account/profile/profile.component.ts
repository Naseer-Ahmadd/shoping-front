import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user:any;
  address:any;
  constructor(private userService: UserService){}
  
  ngOnInit(): void {
    this.getUser()
    let currentLocation = JSON.parse(localStorage.getItem('currentLocation') || '{}').formatted_address
    if(currentLocation){
      this.address = currentLocation   
    }else{
      this.address = this.user.userLocation?.city + this.user.userLocation?.state
    }
  }
  getUser(){
    this.userService.getUser().then(res=>{
      this.user = res
    })
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthserviceService } from '../services/authservice.service';
import firebase from 'firebase/compat/app';
// import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var $: any;
declare var google: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  // ModalReference: NgbModalRef;
  currentLocation: any = {};
  autocompleteInput: string = '';
  credentials: any = {};
  user:any={}
  isLoading: boolean = false
  @ViewChild('addresstext') addresstext: any;
  confirmationResult: any;
  isLoggedin: boolean =false;

  constructor(
    private authService: AuthserviceService,
    private toastrService: ToastrService,
    private router: Router,
    // private ngbModalService: NgbModal,

  ) {
    if (document.getElementsByClassName('modal-backdrop')) {
    console.log(' gegege:', );
    $('.modal-backdrop').remove();
      
    }
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log('storedUser :', token);
    if (token) {
      // If the user is found in localStorage, set isLoggedin to true
      // this.user = JSON.parse(storedUser); // Parse the JSON string to an object
      console.log('this.user :', this.user);
      this.isLoggedin = true;
    }
    this.authService.getCurrentLocation().subscribe((res) => {
      if (res) {
        this.currentLocation = res;
      }
    });
  }

  openHomePageGoogleAddressModal() {
    $('#homePageGoogleAddressModal').modal('show');
  }
  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }
  getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.addresstext.nativeElement,
      {
        componentRestrictions: { country: 'IN' },
        types: ['geocode'], // 'establishment' / 'address' / 'geocode'
      }
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      this.placeChanged(autocomplete.getPlace());
    });
  }
  placeChanged(place) {
    if (place && place.address_components) {
      let flag = 0,
        flag1 = 0,
        city = '',
        state = '',
        address1 = '',
        postcode = '',
        locality = '',
        administrative_area_level_1 = '';

      for (const component of place.address_components) {
        // @ts-ignore remove once typings fixed
        const componentType = component.types[0];
        switch (componentType) {
          case 'street_number': {
            address1 = `${component.long_name} ${address1}`;
            console.log('address1 :', address1);
            break;
          }

          case 'route': {
            address1 += component.short_name;
            console.log('address1 :', address1);
            break;
          }

          case 'postal_code': {
            postcode = `${component.long_name}${postcode}`;
            break;
          }

          case 'postal_code_suffix': {
            postcode = `${postcode}-${component.long_name}`;
            console.log('postcode :', postcode);
            break;
          }

          case 'locality':
            locality = component.long_name;
            console.log('locality :', locality);
            break;

          case 'administrative_area_level_1': {
            administrative_area_level_1 = component.short_name;
            break;
          }
        }
      }
      if (address1) {
        this.currentLocation.city = address1;
      }
      if (locality) this.currentLocation.state = locality;
      if (postcode) this.currentLocation.zip_code = postcode;
      $('#homePageGoogleAddressModal').modal('hide');
    }
  }

  checkClass(){

    console.log('mmfmfmfm :', );
    $('.modal-backdrop').remove();

  }

  login(isValid) {
    if (isValid) {
    this.isLoading = true
    const auth = getAuth();
    const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log('response :', response);
      },
      'expired-callback': () => {},
    });

    firebase
      .auth()
      .signInWithPhoneNumber(this.credentials.phone, appVerifier)
      .then((result) => {
        // console.log('resultttttt :', result);
        this.confirmationResult = result;
        this.isLoading = false
        $('#otp-modal').modal('show')
      })
      .catch((error) => {
        console.log('errorrrrrr', error)
        this.toastrService.error(error, 'Title Error!');
      });
      // this.ModalReference=this.ngbModalService.open(modal)
    }
  }

  verifyOtp() {
    // console.log(' ddd:', this.credentials.otp);
    this.confirmationResult
      .confirm(this.credentials.otp)
      .then((result) => {
        this.user = result.user.multiFactor.user;
        if(this.user){
          localStorage.setItem('user', this.user)
          localStorage.setItem('token', this.user.accessToken)
          console.log('this.user :', this.user.accessToken);
          this.isLoggedin = true
          this.toastrService.success('Logged in Successfully!');
          $('#login-modal').modal('hide')
          $('#otp-modal').modal('hide')
          $('.modal-backdrop').remove();
          this.router.navigate(['/account'])
        }
      })
      .catch((error) => {
        console.log('User couldnt sign in (bad verification code?) :', error);
        this.toastrService.error('bad verification code, please enter correct code');
      });
    // var credential = firebase.auth.PhoneAuthProvider.credential(
    //   this.confirmationResult.verificationId,
    //   this.credentials.otp
    // );
    // if (credential) {
    //   this.toastrService.success('Logged in Successfully!', 'Title Success!');
    //   $('#otp-modal').modal('hide')
    //   this.router.navigate(['/account'])
    // }
  }

  logout(){
    $('.modal-backdrop').remove();
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.isLoggedin = false;
    this.authService.signOut()
    this.router.navigate(['/'])
  }
}

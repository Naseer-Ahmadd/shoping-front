import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthserviceService } from '../services/authservice.service';
declare var $: any;
declare var google: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentLocation:any={};
  autocompleteInput: string = '';

  @ViewChild('addresstext') addresstext: any;

  constructor(private authService: AuthserviceService) { }

  ngOnInit(): void {
    this.authService.getCurrentLocation().subscribe(res=>{
    if(res){
      this.currentLocation = res
    }
    })
  }

  openHomePageGoogleAddressModal() {
    $("#homePageGoogleAddressModal").modal('show');
  }
  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }
  getPlaceAutocomplete() {
      const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement, {
        componentRestrictions: { country: 'IN' },
        types: ['geocode']  // 'establishment' / 'address' / 'geocode'
      });
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        this.placeChanged(autocomplete.getPlace())
      });
  }
  placeChanged(place) {
    if(place && place.address_components){
      let flag =0, flag1 =0, city ="", state="", address1='',postcode='', locality='',
      administrative_area_level_1=''

      for (const component of place.address_components){
        // @ts-ignore remove once typings fixed
        const componentType = component.types[0];
        switch (componentType) {
          case "street_number": {
            address1 = `${component.long_name} ${address1}`;
            console.log('address1 :', address1);
            break;
          }
    
          case "route": {
            address1 += component.short_name;
            console.log('address1 :', address1);
            break;
          }
    
          case "postal_code": {
            postcode = `${component.long_name}${postcode}`;
            break;
          }
    
          case "postal_code_suffix": {
            postcode = `${postcode}-${component.long_name}`;
            console.log('postcode :', postcode);
            break;
          }
    
          case "locality":
            locality = component.long_name;
            console.log('locality :', locality);
            break;
    
          case "administrative_area_level_1": {
            administrative_area_level_1 = component.short_name;
            break;
          }
    
        }
      }
      if(address1){
        this.currentLocation.city = address1;
      }
      if(locality) this.currentLocation.state = locality;
      if(postcode) this.currentLocation.zip_code = postcode
      $("#homePageGoogleAddressModal").modal('hide');
    }
  }
}

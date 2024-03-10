import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  constructor(private http: HttpClient, private auth: AngularFireAuth) {}

  getCurrentLocation(): Observable<any> {
    if (window.navigator && window.navigator.geolocation) {
      return new Observable((observer) => {
        if (window.navigator && window.navigator.geolocation) {
          window.navigator.geolocation.getCurrentPosition(
            (position) => {
              this.getReverseGeoCode(
                position.coords.latitude,
                position.coords.longitude
              )
                .subscribe(
                  (res: any) => {''
                  let formattedRes = res;
                      let returnData;
                      if (formattedRes.status == 'OK') {
                        // console.log(' innnn:', );
                        returnData = {
                          "country_code": "",
                          "city": "",
                          "zip_code": "",
                          "latitude": position.coords.latitude,
                          "longitude": position.coords.longitude,
                          "formatted_address":""
                        };
                        returnData['formatted_address'] = formattedRes.results[0].formatted_address
                        // formattedRes.results.forEach(function (element) {
                        //   element.address_components.forEach(function (element2) {
                        //     element2.types.forEach(function (element3) {
                        //       switch (element3) {
                        //         case 'postal_code':
                        //           returnData['zip_code'] = element2.long_name;
                        //           break;
                        //         case 'administrative_area_level_1':
                        //           returnData['state'] = element2.long_name;
                        //           break;
                        //         case 'locality':
                        //           returnData['city'] = element2.long_name;
                        //           break;
                        //         case 'country':
                        //           returnData['country_code'] = returnData['country_code'] || element2.short_name;
                        //           break;
                        //       }
                        //     })
                        //   });
                        // });
                        observer.next(returnData);
                        observer.complete();
                      } else {
                        return;
                      }
                  },
                  (error: any) => {
                    observer.next('');
                    observer.complete();
                  }
                );
            },
            (error: any) => {
              observer.next('');
              observer.complete();
            }
          );
        } else {
          observer.next('');
          observer.complete();
        }
      });
    }
    return new Observable(); // return an empty observable if geolocation is not available
  }

  getReverseGeoCode(lat: any, lon: any): Observable<any> {
    let url =
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
      lat +
      ',' +
      lon +
      '&' +
      'key=AIzaSyBNggbMh5eUxti9tlUOq087Rl45q3Lgeuo'; //MY KEY
    return this.http.get(url);
  }

  signOut() {
    return this.auth.signOut();
  }

  isLoggedin(){
    const token = localStorage.getItem('token');
    if (token) {
      return true
    }
  }
}

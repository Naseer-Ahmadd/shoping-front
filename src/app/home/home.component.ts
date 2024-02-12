import { Component, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { CategoriesService } from '../services/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allCategories:any =[]
  products:any =[]
  products2:any =[]
  products3:any =[]
  constructor( private router: Router,private catService: CategoriesService, private userService: UserService) { 

  }

  ngOnInit(): void {

    const mySwiper = new Swiper('.swiper-container', {
      slidesPerView: 1.5,
      spaceBetween: 10,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 4.5,
        },
      },
    });
    this.getCategories()
    this.getProducts()
  }

  getCategories(){
   this.catService.getCategories()
    .then((categories) => {
      this.allCategories = categories;
      this.allCategories.forEach(category => {
        const l0CatMatch = category.deeplink.match(/l0_cat=(\d+)/);
        if (l0CatMatch && l0CatMatch[1]) {
          const l0CatNumber = l0CatMatch[1];
          category.image = `https://raw.githubusercontent.com/ganeshabhog/ganesha-images/main/categoryimages/${l0CatNumber}.png`;
        }
      });
      // console.log('this.allCategories222 :', this.allCategories);
    })
    .catch((error: any) => {
      // Handle the error here
    });
  }

  getProducts(){
    let parentCategoryID = 14 //Dairy & Breakfast
    this.catService.getDocumentsByParentCategoryID(parentCategoryID)
      .then((Products) => {
      // console.log('Products :', Products);
      this.products = Products
      })

    let productCat = 1557 //Dry Fruits, Masala & Oil
    this.catService.getDocumentsByParentCategoryID(productCat)
       .then((Products) => {
      //  console.log('Products22 :', Products);
       this.products2 = Products
       })

    let prodcat = 1237//Snacks & Munchies
    this.catService.getDocumentsByParentCategoryID(prodcat)
    .then((Products) => {
    // console.log('Products33 :', Products);
    this.products3 = Products
    })

  }

  browseCat(link){
    const l0CatMatch = link.match(/l0_cat=(\d+)/);
    if (l0CatMatch && l0CatMatch[1]) {
      const l0CatNumber = l0CatMatch[1];
      this.router.navigate([ '/products'], { queryParams: { catId: Number(l0CatNumber) } });
    }
  }

}

import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { NgFor } from '@angular/common'; 
import Swiper from 'swiper';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  productId: Number;
  product: any = {};
  productInner: any = {};
  key_features: string
  email= 'ganeshabhog@gmail.com'
  products:any =[]
  products2:any =[]
  isAdded: boolean;
  constructor(private route: ActivatedRoute,private catService: CategoriesService,private userService: UserService,
    private toastrService: ToastrService) {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    });
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
    this.getProducts()
    this.getProduct(this.productId)
    
  }

  getProduct(p_id){
    this.catService.getDocumentByProductID(Number(p_id))
    .then((Products) => {
    this.product = Products[0]
    this.productInner = this.product.element.data.product
    this.key_features = this.productInner?.attributes?.key_features.replace(/\n/g, '<br>')
    // console.log('this.product :', this.product);
    })
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

  }

  scrollTop(){
    window.scrollTo(0, 0);
  }


  addToCart(product){
    // console.log('productttt :', product);
    let cartItem = {
      product_id: product.product_id,
      unit: product.unit,
      price: product.price,
      image_url: product.image_url,
      productName: product.productName,
      quantity: 1,
    };
  
    this.userService.updateUserCart(cartItem)
      .then((res) => {
      // console.log('res product added to cart :', res);
      if(res == 'SUCCESS'){
        this.isAdded = true
        this.toastrService.success('Product added to cart');
        this.userService.getCartCount()
      }
      })
      .catch((error) => {
        console.error('Failed to update user cart:', error);
        this.toastrService.warning('Please login to add product to cart');
      });
  
  }


}

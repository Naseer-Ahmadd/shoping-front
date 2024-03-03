import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css']
})
export class ProductListingComponent implements OnInit {
  allCategories:any=[]
  products:any = []
  activeCategory: any;
  CatId:any;
  subCategories:any=[]
  constructor(private activatedRoute: ActivatedRoute,private catService: CategoriesService) {
    this.CatId = this.activatedRoute.snapshot.queryParamMap.get('catId');
   }

  ngOnInit(): void {
    this.getCategories()
    if(this.CatId){
      this.getSubCategories(this.CatId)
    }else{
      this.CatId=12
      this.getSubCategories(this.CatId.toString())
    }

    this.getProductsbyChildCatId(957)
  }

  getSubCategories(parentCatId){
  // console.log('parentCatId :', parentCatId);
    this.catService.getSubCategoryById(parentCatId)
    .then((SubCategories) => {
    // console.log('SubCategories :', SubCategories);
    this.subCategories = SubCategories
    })
  }
  
  getAllproducts(parentCatId){
    this.catService.getDocumentsByParentCategoryID(parentCatId)
    .then((Products) => {
    // console.log('Products :', Products);
    this.products = Products
    })
  }

  getProductsbyChildCatId(id){
  this.catService.getDocumentsByChildCategoryID(Number(id))
  .then((Products) => {
  // console.log('Productsss :', Products);
  this.products = Products
  })
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
      //  console.log('this.allCategories :', this.allCategories);
     })
  }
  setActiveCategory(category: any): void {
    this.activeCategory = category;
  }
  getProducts(link){
    const l0CatMatch = link.match(/l0_cat=(\d+)/);
    if (l0CatMatch && l0CatMatch[1]) {
      const l0CatNumber = l0CatMatch[1];
      this.catService.getDocumentsByParentCategoryID(Number(l0CatNumber))
      .then((Products) => {
      // console.log('Products :', Products);
      this.products = Products
      })
    }
  }

}

import { BrowserModule, Title  } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MyAccountModule } from './pages/myaccount/myaccount.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';
import {  SharedModule } from './shared/shared.module';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { customerReducer  } from './state/customer/customer.reducer';
import { CustomerEffects } from './state/customer/customer.effects';
import { CustomerActions } from './state/customer/customer.action';
import { productStoreReducer  } from './state/product-store/product-store.reducer';
import { ProductStoreEffects } from './state/product-store/product-store.effects';
import { ProductStoreActions } from './state/product-store/product-store.action';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HeaderComponent } from './pages/home/header/header.component';
import { FooterComponent } from './pages/home/footer/footer.component';
import { HomepageComponent } from './pages/home/homepage/homepage.component';
import { AboutusComponent } from './pages/aboutus/aboutuscomponent';
import { LoginComponent } from './pages/login/login.component';
import { SigninComponent } from './pages/login/signin/signin.component';
import { SignupComponent } from './pages/login/signup/signup.component';
import { FeatureProductsComponent } from './pages/products/feature-products/feature-products.component';
import { MenubarComponent } from './pages/home/menubar/menubar.component';
import { HomecauroselComponent } from './pages/home/homecaurosel/homecaurosel.component';
import { DownloadappComponent } from './pages/home/downloadapp/downloadapp.component';
import { AgelimitComponent } from './pages/agelimit/agelimit.component';
import { RecipesComponent } from './pages/recipe/recipes/recipes.component';
import { RecipeDetailsComponent } from './pages/recipe/recipe-details/recipe-details.component';
import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';
import { FilterMenuComponent } from './pages/home/menubar/filter-menu/filter-menu.component';
import { SearchBarComponent } from './pages/home/menubar/search-bar/search-bar.component';
import { ProductComponent } from './pages/products/product/product.component';
import { EventDetailsComponent } from './pages/products/event-details/event-details.component';
// import { MyAccountComponent } from './pages/myaccount/myaccount.component';
import { MyOrdersComponent } from './pages/myaccount/myorders/myorders.component';
import { CartComponent } from './pages/cart/cart.component';
import { AdvanceFilterComponent } from './pages/products/advance-filter/advance-filter.component';
import { PopupComponent } from './pages/home/popup/popup.component';

import { CustomerService } from './services/customer.service';
import { ProductStoreService } from './services/product-store.service';
import { DataService } from './services/data.service';
import { DataFilterAllService } from './services/data-filter-all.service';
import { DecimalPipe } from '@angular/common';

import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CheckoutDeliveryComponent } from './pages/checkout/checkout-delivery/checkout-delivery.component';
import { CheckoutPaymentMethodComponent } from './pages/checkout/checkout-payment-method/checkout-payment-method.component';
import { CheckoutProductsComponent } from './pages/checkout/checkout-products/checkout-products.component';
import { ProductReviewComponent } from './pages/products/product-details/product-review/product-review.component';
import { ProductAddReviewComponent } from './pages/products/product-details/product-add-review/product-add-review.component';
import { ProductEditReviewComponent } from './pages/products/product-details/product-edit-review/product-edit-review.component';
import { OrderComponent } from './pages/myaccount/myorders/order/order.component';
import { CartReviewComponent } from './pages/cart-review/cart-review.component';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { AuthService } from './auth.service';
import { CheckoutPickupComponent } from './pages/checkout/checkout-pickup/checkout-pickup.component';
import { EventsComponent } from './pages/products/events/events.component';
import { PrivacyPolicyComponent } from './pages/home/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './pages/home/terms-and-conditions/terms-and-conditions.component';
import { PlaceOrderResultComponent } from './pages/checkout/place-order-result/place-order-result.component';
import { MultiStoreComponent } from './pages/home/multi-store/multi-store.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
// import { HomePageResolver } from './pages/home/homepage/homepage.resolver';
import { facebookProviderID } from './app-config.service';
import { OffersComponent } from './pages/home/offers/offers.component';
import { OfferComponent } from './pages/offer/offer.component';
import { AdvancedFilterAllComponent } from './pages/products/advanced-filter-all/advanced-filter-all.component';
import { PhoneMaskDirective } from './shared/directives/phone-mask.directive';
import { PreloaderComponent } from './pages/checkout/preloader/preloader.component';

// Configs
export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider(facebookProviderID) // 2187506571532619')
        }
      ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    AboutusComponent,
    LoginComponent,
    SigninComponent,
    SignupComponent,
    FeatureProductsComponent,
    MenubarComponent,
    HomecauroselComponent,
    DownloadappComponent,
    AgelimitComponent,
    FilterMenuComponent,
    SearchBarComponent,
    ProductComponent,
    RecipesComponent,
    RecipeDetailsComponent,
    ProductDetailsComponent,
    EventDetailsComponent,
    // MyAccountComponent,
    MyOrdersComponent,
    CartComponent,
    AdvanceFilterComponent,
    CheckoutComponent,
    CheckoutDeliveryComponent,
    CheckoutPaymentMethodComponent,
    CheckoutProductsComponent,
    ProductReviewComponent,
    ProductAddReviewComponent,
    ProductEditReviewComponent,
    OrderComponent,
    CartReviewComponent,
    CouponsComponent,
    CheckoutPickupComponent,
    EventsComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    PlaceOrderResultComponent,
    MultiStoreComponent,
    ContactUsComponent,
    OfferComponent,
    OffersComponent,
    AdvancedFilterAllComponent,
    PhoneMaskDirective,
    PopupComponent,
    PreloaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    MyAccountModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    StoreModule.forRoot({customer: customerReducer, productStore: productStoreReducer }),
    EffectsModule.forRoot([CustomerEffects, ProductStoreEffects]),
    Ng4LoadingSpinnerModule.forRoot(),
    SocialLoginModule,
    DeviceDetectorModule.forRoot(),
    NgbPaginationModule
  ],
  exports: [PhoneMaskDirective],
  providers: [CustomerService, ProductStoreService, DataService, DataFilterAllService, DecimalPipe, AuthService, Title, // HomePageResolver,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }],
    // HttpCacheService, { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

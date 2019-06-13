import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

import { HomepageComponent } from './pages/home/homepage/homepage.component';
import { AboutusComponent } from './pages/aboutus/aboutuscomponent';
import { OfferComponent } from './pages/offer/offer.component';
import { RecipesComponent } from './pages/recipe/recipes/recipes.component';
import { RecipeDetailsComponent } from './pages/recipe/recipe-details/recipe-details.component';
import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';
import { EventDetailsComponent } from './pages/products/event-details/event-details.component';
import { MyAccountComponent } from './pages/myaccount/myaccount.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';

import { CartComponent } from './pages/cart/cart.component';
import { AdvanceFilterComponent } from './pages/products/advance-filter/advance-filter.component';
import { LoginComponent } from './pages/login/login.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { FeatureProductsComponent } from './pages/products/feature-products/feature-products.component';
import { EventsComponent } from './pages/products/events/events.component';
import { PrivacyPolicyComponent } from './pages/home/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './pages/home/terms-and-conditions/terms-and-conditions.component';
import { AdvancedFilterAllComponent } from './pages/products/advanced-filter-all/advanced-filter-all.component';
// import { HomePageResolver } from './pages/home/homepage/homepage.resolver';

import { AuthGuard } from './auth.guard';
import { GeneralGuard } from './general.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomepageComponent,
    // resolve: { token: HomePageResolver },
    runGuardsAndResolvers: 'always'
  },
  { path: 'aboutus', component: AboutusComponent, canActivate: [GeneralGuard] },
  { path: 'offer', component: OfferComponent, canActivate: [GeneralGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'feature-products', component: FeatureProductsComponent, canActivate: [GeneralGuard]},
  { path: 'recipes', component: RecipesComponent, canActivate: [GeneralGuard]},
  { path: 'recipe-details/:id', component: RecipeDetailsComponent, canActivate: [GeneralGuard] },
  { path: 'product-details/:id', component: ProductDetailsComponent, canActivate: [GeneralGuard] },
  { path: 'event-details/:id', component: EventDetailsComponent, runGuardsAndResolvers: 'always', canActivate: [GeneralGuard] },
  { path: 'myaccount', loadChildren: './pages/myaccount/myaccount.module#MyAccountModule', canActivate: [AuthGuard] },
  { path: 'advance-filter', component: AdvancedFilterAllComponent, runGuardsAndResolvers: 'always' , canActivate: [GeneralGuard] },
  { path: 'beer', component: AdvanceFilterComponent, runGuardsAndResolvers: 'always', canActivate: [GeneralGuard] },
  { path: 'liquor', component: AdvanceFilterComponent, runGuardsAndResolvers: 'always' , canActivate: [GeneralGuard]},
  { path: 'wine', component: AdvanceFilterComponent, runGuardsAndResolvers: 'always', canActivate: [GeneralGuard] },
  { path: 'mixers-more', component: AdvanceFilterComponent, runGuardsAndResolvers: 'always', canActivate: [GeneralGuard] },
  { path: 'cart', component: CartComponent, canActivate: [GeneralGuard]  },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'coupons', component: CouponsComponent, canActivate: [GeneralGuard] },
  { path: 'events', component: EventsComponent, runGuardsAndResolvers: 'always', canActivate: [GeneralGuard] },
  { path: 'privacy-policy', component: PrivacyPolicyComponent, runGuardsAndResolvers: 'always', canActivate: [GeneralGuard] },
  { path: 'terms-conditions', component: TermsAndConditionsComponent, runGuardsAndResolvers: 'always', canActivate: [GeneralGuard] },
  { path: 'contactus', component: ContactUsComponent, runGuardsAndResolvers: 'always', canActivate: [GeneralGuard] },
  { path: '**', component: HomepageComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true,
    scrollPositionRestoration: 'enabled', onSameUrlNavigation: 'reload'}), HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }

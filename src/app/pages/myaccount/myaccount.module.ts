import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MyAccountRoutingModule  } from './myaccount-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { MyAccountComponent } from './myaccount.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ManageAddressesComponent } from './manage-addresses/manage-addresses.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AddNewAddressComponent } from './manage-addresses/add-new-address/add-new-address.component';
import { AddNewPaymentComponent } from './payment-methods/add-new-payment/add-new-payment.component';
import { EditAddressComponent } from './manage-addresses/edit-address/edit-address.component';
import { AddNewCardComponent } from './vantiv-payment-methods/add-new-card/add-new-card.component';
import { VantivPaymentMethodsComponent } from './vantiv-payment-methods/vantiv-payment-methods.component';

@NgModule({
  exports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [
      MyAccountComponent,
      ProfileComponent,
      ProfileEditComponent,
      ManageAddressesComponent,
      PaymentMethodsComponent,
      FavoritesComponent,
      AddNewAddressComponent,
      AddNewPaymentComponent,
      EditAddressComponent,
      AddNewCardComponent,
      VantivPaymentMethodsComponent
    ]
})
export class MyAccountModule { }

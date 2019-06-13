import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyAccountComponent } from './myaccount.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ManageAddressesComponent } from './manage-addresses/manage-addresses.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AddNewAddressComponent } from './manage-addresses/add-new-address/add-new-address.component';
import { AddNewPaymentComponent } from './payment-methods/add-new-payment/add-new-payment.component';
import { EditAddressComponent } from './manage-addresses/edit-address/edit-address.component';
import { MyOrdersComponent } from './myorders/myorders.component';
import { AuthGuard } from '../../auth.guard';
import { VantivPaymentMethodsComponent } from './vantiv-payment-methods/vantiv-payment-methods.component';
import { AddNewCardComponent } from './vantiv-payment-methods/add-new-card/add-new-card.component';

const routes: Routes = [
    {
        path: '',
        component: MyAccountComponent,
        children: [
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            { path: 'profile', component: ProfileComponent },
            { path: 'profile-edit', component: ProfileEditComponent },
            { path: 'manage-addresses', component: ManageAddressesComponent },
            { path: 'edit-address/:id', component: EditAddressComponent },
            { path: 'payment-methods', component: PaymentMethodsComponent },
            { path: 'favorites', component: FavoritesComponent },
            { path: 'add-new-address', component: AddNewAddressComponent },
            { path: 'add-new-payment-method', component: AddNewPaymentComponent },
            { path: 'vantiv-payment-methods', component: VantivPaymentMethodsComponent },
            { path: 'add-new-card', component: AddNewCardComponent },
            { path: 'myorders', component: MyOrdersComponent, canActivate: [AuthGuard]},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyAccountRoutingModule { }

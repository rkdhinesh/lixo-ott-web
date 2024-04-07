import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './_features/login/forgot-password/forgot-password.component';
import { ServerErrorComponent } from './_shared/server-error/server-error.component';
import { PrivacyPolicyComponent } from './_shared/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './_shared/terms-and-conditions/terms-and-conditions.component';
import { FaqComponent } from './_shared/faq/faq.component';
import { ContactUsComponent } from "./_shared/contact-us/contact-us.component";
import { TestComponent } from './_features/dashboard/test/test.component';

const routes: Routes = [
    {
        path: '',
        loadChildren:
            './_features/dashboard/dashboard.module#DashboardModule',
    },
    {
        path: 'login',
        loadChildren: './_features/login/login.module#LoginModule',
    },
    {
        path: 'shows',
        loadChildren: './_features/shows/shows.module#ShowsModule',
    },
    {
        path: 'profile',
        loadChildren:
            './_features/profile/profile.module#ProfileModule',
    },
    {
        path: 'booking',
        loadChildren:
            './_features/booking/booking.module#BookingModule',
    },
    {
        path: 'location',
        loadChildren:
            './_features/location/location.module#LocationModule',
    },
    {
        path: 'wallet',
        loadChildren: './_features/wallet/wallet.module#WalletModule',
    },
    {
        path: 'forgotpassword',
        component: ForgotPasswordComponent,
    },
    {
        path: 'test',
        component: TestComponent,
    },
    {
        path: 'error',
        component: ServerErrorComponent,
    },
    {
        path: "privacypolicy",
        component: PrivacyPolicyComponent,
    },
    {
        path: "termsandconditions",
        component: TermsAndConditionsComponent,
    },
    {
        path: "faq",
        component: FaqComponent,
    },
    {
        path: "contactus",
        component: ContactUsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
    constructor() {
        console.log('AppRoutingModule');
    }
}

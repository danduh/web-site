import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule, Routes } from '@angular/router';
import { CanvasComponent } from "./components/canvas/canvas.component";
import { CanvasService } from "./components/canvas/canvas.service";

const appRoutes: Routes = [
    {path: 'home', component: HomePageComponent},
    {path: '', component: HomePageComponent},
    {path: '**', component: HomePageComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomePageComponent,
        CanvasComponent,

    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [CanvasService],
    bootstrap: [AppComponent]
})
export class AppModule {
}

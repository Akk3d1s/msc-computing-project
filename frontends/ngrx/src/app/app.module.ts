import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from 'src/app/state';
import { HttpClientModule } from '@angular/common/http';
import { UsersEffects } from 'src/app/state/effects';
import { UsersEndpoint } from 'src/app/endpoints/users.endpoint';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([UsersEffects]),
  ],
  providers: [UsersEndpoint],
  bootstrap: [AppComponent]
})
export class AppModule { }

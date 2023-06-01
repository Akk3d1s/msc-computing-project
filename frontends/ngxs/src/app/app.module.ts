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
import { NgxsModule } from '@ngxs/store';
import { UsersState } from 'src/app/state/state';
import { UsersEndpoint } from 'src/app/endpoints/users.endpoint';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { NgForOf } from '@angular/common';

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
        NgxsModule.forRoot([UsersState]),
        MatButtonModule,
        MatFormFieldModule,
        MatOptionModule,
        MatPaginatorModule,
        MatSelectModule,
        MatTableModule,
        NgForOf,
    ],
  providers: [UsersEndpoint],
  bootstrap: [AppComponent]
})
export class AppModule { }

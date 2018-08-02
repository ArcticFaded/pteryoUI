import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JurassicNavComponent } from './jurassic-nav/jurassic-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatSelectModule, MatInputModule, MatFormFieldModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router'
import { JurassicHeroComponent } from './jurassic-hero/jurassic-hero.component';
import { JurassicTableComponent } from './jurassic-table/jurassic-table.component';
import { HttpClientModule } from '@angular/common/http';
import { D3Service, D3_DIRECTIVES } from './d3';
import { SearchService } from './search.service'
import { ModalService } from './modal.service';
import { ModalComponent } from './modal-support/modal.component';
import { GraphComponent } from './visuals/graph-tree/graph.component';
import { GraphListComponent } from './visuals/graph-list/graph-list.component';
import { DynamicFormComponent, DynamicFormQuestionComponent } from './form-support'
import { SHARED_VISUALS } from './visuals/shared';
import { QuestionViewComponent } from './question-view/question-view.component';
import { UiScrollModule } from 'ngx-ui-scroll'

const appRoutes: Routes = [
    { path: 'jurassic-hero', component: JurassicHeroComponent},
    { path: 'question-view', component: QuestionViewComponent}
    // { path: '', component: AppComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    GraphListComponent,
    JurassicNavComponent,
    JurassicHeroComponent,
    JurassicTableComponent,
    ...SHARED_VISUALS,
    ...D3_DIRECTIVES,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    ModalComponent,
    QuestionViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    UiScrollModule,
    MatInputModule,
    LayoutModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    MatFormFieldModule
  ],
  providers: [D3Service, SearchService, ModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }

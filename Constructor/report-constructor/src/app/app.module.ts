import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContstructorComponent } from './contstructor/contstructor.component';
import { TemplatesComponent } from './templates/templates.component';
import { EditorsComponent } from './editors/editors.component';
import { LeftPaneComponent } from './left-pane/left-pane.component';
import { RightPaneComponent } from './right-pane/right-pane.component';
import { LoadFileComponent } from './load-file/load-file.component';
import { BlocksComponent } from './blocks/blocks.component';
import { CreateBlockComponent } from './create-block/create-block.component';
import { TableComponent } from './table/table.component';
import { DiagramsComponent } from './diagrams/diagrams.component';
import {HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [
    AppComponent,
    ContstructorComponent,
    TemplatesComponent,
    EditorsComponent,
    LeftPaneComponent,
    RightPaneComponent,
    LoadFileComponent,
    BlocksComponent,
    CreateBlockComponent,
    TableComponent,
    DiagramsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

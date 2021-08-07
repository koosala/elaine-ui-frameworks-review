import { Component, OnInit, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { categories } from "./data.categories";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, process } from "@progress/kendo-data-query";
import { ExperimentService } from "./experiment.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import {
  AddEvent,
  EditEvent,
  GridComponent,
} from "@progress/kendo-angular-grid";

const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);

const createFormGroup = (dataItem) =>
  new FormGroup({
    RowId: new FormControl(dataItem.RowId),
    RowType: new FormControl(dataItem.RowType),
    LabeledpH: new FormControl(dataItem.LabeledpH),
    CoATemp1: new FormControl(dataItem.CoATemp1),
    CoApH1: new FormControl(dataItem.CoApH1),
    CoATemp2: new FormControl(dataItem.CoATemp2),
    CoApH2: new FormControl(dataItem.CoApH2),
    CoATemp3: new FormControl(dataItem.CoATemp3),
    CoApH3: new FormControl(dataItem.CoApH3),
    IncludedInCalibration: new FormControl(dataItem.IncludedInCalibration),
    BufferTemperature: new FormControl(dataItem.BufferTemperature),
    TheoriticalpH: new FormControl(dataItem.TheoriticalpH),
    ActualInputpH: new FormControl(dataItem.ActualInputpH),
    VerificationpH: new FormControl(dataItem.VerificationpH),
    VerificationSpec: new FormControl(dataItem.VerificationSpec),
    VerificationResult: new FormControl(dataItem.VerificationResult),
    Comment: new FormControl(dataItem.Comment)
    // RowId: 
    // ProductID: new FormControl(dataItem.ProductID),
    // ProductName: new FormControl(dataItem.ProductName, Validators.required),
    // UnitPrice: new FormControl(dataItem.UnitPrice),
    // UnitsInStock: new FormControl(
    //   dataItem.UnitsInStock,
    //   Validators.compose([
    //     Validators.required,
    //     Validators.pattern("^[0-9]{1,3}"),
    //   ])
    // ),
  });

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [ExperimentService]
})

export class AppComponent {
  @ViewChild(GridComponent) 
  private grid: GridComponent;  
  title = 'kendo-angular-app';
  public dropDownItems = categories;
  public defaultItem = { text: "Filter by Category", value: null };

  public gridItems: Observable<GridDataResult>;
  public pageSize: number = 20;
  public skip: number = 0;
  public sortDescriptor: SortDescriptor[] = [];
  public filterTerm: string = null;

  public view: any[];
  public formGroup: FormGroup;
  private editedRowIndex: number;
  private isNew: boolean;  
  
  constructor(private service: ExperimentService) {
    this.loadGridItems();
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadGridItems();
  }

  private loadGridItems(): void {
    this.gridItems = this.service.getSteps(
      this.skip,
      this.pageSize,
      this.sortDescriptor,
      this.filterTerm
    );
  }

  public handleSortChange(descriptor: SortDescriptor[]): void {
    this.sortDescriptor = descriptor;
    this.loadGridItems();
  }

  public handleFilterChange(item: {
    text: string;
    value: string;
  }): void {
    this.filterTerm = item.value;
    this.skip = 0;
    this.loadGridItems();
  }

  
  public cellClickHandler({ isEdited, dataItem, rowIndex }): void {
    if (isEdited) {
      return;
    }
    this.saveCurrent();
    this.formGroup = createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;

    this.grid.editRow(rowIndex, this.formGroup);
    this.loadGridItems();
  }

  private saveCurrent(): void {
    if (this.formGroup) {
      this.service.save(this.formGroup.value, this.isNew);
      this.closeEditor();
    }
  }

  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);

    this.isNew = false;
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  public cancelHandler({sender, rowIndex}) {
    // close the editor for the given row
    sender.closeRow(rowIndex)
  }  
}


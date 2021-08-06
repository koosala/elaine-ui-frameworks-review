import { Component } from '@angular/core';
import { categories } from "./data.categories";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor } from "@progress/kendo-data-query";
import { ExperimentService } from "./experiment.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [ExperimentService]
})

export class AppComponent {
  title = 'kendo-angular-app';
  public dropDownItems = categories;
  public defaultItem = { text: "Filter by Category", value: null };

  public gridItems: Observable<GridDataResult>;
  public pageSize: number = 20;
  public skip: number = 0;
  public sortDescriptor: SortDescriptor[] = [];
  public filterTerm: string = null;

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
}


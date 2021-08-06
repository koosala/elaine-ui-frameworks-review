import { Injectable } from "@angular/core";
import {
  DataResult,
  orderBy,
  process,
  SortDescriptor
} from "@progress/kendo-data-query";
import { Observable, of } from "rxjs";
import { pHSteps } from "./data.experiment";

@Injectable()
export class ExperimentService {
  public getSteps(
    skip: number,
    pageSize: number,
    sortDescriptor: SortDescriptor[],
    filterTerm: string
  ): Observable<DataResult> {
    let data;
    if (filterTerm) {
      data = process(orderBy(pHSteps, sortDescriptor), {
        filter: {
          logic: "and",
          filters: [
            {
              field: "RowType",
              operator: "eq",
              value: filterTerm
            }
          ]
        }
      }).data;
    } else {
      data = orderBy(pHSteps, sortDescriptor);
    }
    return of({
      data: data.slice(skip, skip + pageSize),
      total: data.length
    });
  }
}

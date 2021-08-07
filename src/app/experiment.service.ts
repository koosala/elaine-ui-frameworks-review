import { Injectable } from "@angular/core";
import {
  DataResult,
  orderBy,
  process,
  SortDescriptor
} from "@progress/kendo-data-query";
import { from, Observable, of } from "rxjs";
import { pHSteps } from "./data.experiment";

let steps = pHSteps;

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
      data = process(orderBy(steps, sortDescriptor), {
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
      data = orderBy(steps, sortDescriptor);
    }
    return of({
      data: data.slice(skip, skip + pageSize),
      total: data.length
    });
  }

  public save(phStep, isNew: boolean) {
    if (isNew) steps.concat(phStep);
    var index = steps.findIndex(p => p.RowId == phStep.RowId);
    steps[index] = phStep;
  }
}

import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { GlobalService } from '../_service/global.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {

  receiptList=[];
  // for datatable
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized:boolean = false;

  constructor(private globalService: GlobalService,) { }

  ngOnInit(): void {
    this.getReceipthistory();
  }

  getReceipthistory(){
    this.globalService.getRequest('/receipt/receiptList')
      .subscribe(data => {
        this.receiptList = data;
        this.dtTrigger.next();
      });
  }

}

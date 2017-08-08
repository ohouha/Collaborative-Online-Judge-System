import { Component, OnInit,Inject } from '@angular/core';
import { Problem } from '../../models/prblem.model';
import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  
  problems: Problem[];
  subscriptionProblems:Subscription;
  
  constructor(@Inject('data') private dataService) { }

  ngOnInit() {
    this.getProblems();

  }

  getProblems():void
  {
    //this.problems=this.dataService.getProblems();
    this.subscriptionProblems=this.dataService.getProblems()
    .subscribe(problems=>this.problems=problems);
  }

}

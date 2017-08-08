import { Component, OnInit,Inject } from '@angular/core';
import { Problem } from '../../models/prblem.model';
import{ ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit {
  problem:Problem;
  constructor(@Inject('data') private dataService,
  private route:ActivatedRoute ) { 

  }

  ngOnInit() {
    //this.getProblem(1);
    this.route.params.subscribe(params=>{
      //this.problem=this.dataService.getProblem(+params['id']);
      this.dataService.getProblem(+params['id'])
      .then(problem=>this.problem=problem);
    });
  }

}

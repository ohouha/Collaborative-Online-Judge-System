import { Injectable } from '@angular/core';
import { Problem } from '../models/prblem.model';
//import{ PROBLEMS } from '../mock.problems';
import{ BehaviorSubject, Observable } from 'rxjs/Rx';
import{ Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataService {
//Problems:Problem[]=PROBLEMS;
private _problemSource=new BehaviorSubject<Problem[]>([]);
  constructor(private http:Http) { }

  getProblems():Observable<Problem[]>   //subscribe
  {
    //return this.Problems;
    this.http.get('api/v1/problems')
    .toPromise()
    .then((res:Response)=>{
      this._problemSource.next(res.json())
    })
    .catch(this.handlerError)
    return this._problemSource.asObservable();

  }

  getProblem(id:number):Promise<Problem>
  {
    //return this.Problems.find((problem)=>problem.id===id);
    return this.http.get(`api/v1/problems/${id}`)
    .toPromise()
    .then((res:Response)=>res.json())    //???why don't need to return
    .catch(this.handlerError);
  }

  addProblem(newProblem:Problem)
  {
    //newProblem.id=this.Problems.length+1;
    //this.Problems.push(newProblem);
    const headers=new Headers({
      'content-type':'application/json'
    });
    return this.http.post('api/v1/problems',newProblem,headers)
    .toPromise()
    .then((res:Response)=>{
      this.getProblems();
      res.json();})
    .catch(this.handlerError);
  }

  buildAndRun(data:any):Promise<object>
  {
    
    const headers = new Headers( {
      'content-type': 'application/json'
    });
    return this.http.post('api/v1/build_and_run',data,headers)
    .toPromise()
    .then((res:Response)=>res.json())     //{}??????
    .catch(this.handlerError);

  }


  private handlerError(error:any): Promise<any>{
    console.error('an error happened',error);
    return Promise.reject(error.bod||error);
  }

}

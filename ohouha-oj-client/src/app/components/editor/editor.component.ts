import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';


declare var ace: any;  //mention this is not typeScript type

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editor: any;
  defaultCotent = {
    'Java': `public class Example {
public static void main(String[] args) { 
    // Type your Java code here 
    } 
}`,
    'C++': `#include <iostream> 
using namespace std; 
int main() { 
  // Type your C++ code here 
  return 0; 
}`,
    'Python': `class Solution: 
   def example(): 
       # Write your Python code here`

  }

  language: string = 'Java';
  languages: string[] = ['Java', 'C++', 'Python'];
  languageMap = {
    'Java': 'java',
    'C++': 'c_cpp',
    'Python': 'python'
  }

  sessionId: string;
  output:string;

  constructor( @Inject('collaboration') private collaboration,@Inject ('data') private dataService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    // var editor = ace.edit("editor");
    // editor.setTheme("ace/theme/monokai");
    // editor.getSession().setMode("ace/mode/javascript");

    this.route.params.subscribe(params => {

      this.sessionId = params['id'];

      this.initEditor();

    });


  }

  initEditor(): void {

    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/eclipse');
    this.editor.setFontSize(18);
    this.editor.$blockScrolling = Infinity;
    this.resetEditor();
    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;

    this.editor.on('change', (e) => {

      if (this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e));
      }

    });

    //mouse position
    this.editor.getSession().getSelection().on('changeCursor', () => {
      
      let cursor = this.editor.getSession().getSelection().getCursor();
      console.log("client!" + JSON.stringify(cursor));
      this.collaboration.cursorMove(JSON.stringify(cursor));

    });

    this.collaboration.restoreBuffer();

  }

  submit(): void {

    this.output='';
    console.log('sumbit');
    let codes = this.editor.getValue();
    console.log('your code:' + codes);
    const data={
       usercode:codes,
       lang:this.language.toLocaleLowerCase()
    }
    this.dataService.buildAndRun(data)
    .then(res=>this.output=res.text);

  }

  setLanguage(language: string): void {

    this.language = language;
    this.resetEditor();

  }

  resetEditor(): void {

    console.log('reseting editor');
    //add map for language and js file name
    this.editor.getSession().setMode(`ace/mode/${this.languageMap[this.language]}`);
    this.editor.setValue(this.defaultCotent[this.language]);
    this.output='';

  }

}

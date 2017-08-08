import { Injectable } from '@angular/core';
import{ COLORS } from '../../assets/colors';


declare var io:any;
declare var ace:any;

@Injectable()
export class CollaborationService {

 collaborationSocket:any;
 // can add some interesting name for cursor here
 clientsInfo:object={};
 clientNumber:number=0;
  constructor() { }

  init(editor:any, sessionId:string){


    this.collaborationSocket=io(window.location.origin,{query:'sessionID='+ sessionId });  //send to window.location.origin a message, for first hand shake.
    
    // this.collaboration_socket.on('message',(message)=>{     //when get event message from server...and then concole.log
    //   console.log('message from server',message);
    // })

    //listen for change event from other people
    this.collaborationSocket.on('change',(delta:string)=>{
      
      console.log('colleration service: editor change:' + delta);
      delta=JSON.parse(delta);
      editor.lastAppliedChange=delta;
      editor.getSession().getDocument().applyDeltas([delta]);  //delta = dynamic change 

    });

    //listen for cursor move
    this.collaborationSocket.on('cursorMove',(cursor:string)=>{
      
      console.log('received from server cursor:'+cursor);
      cursor=JSON.parse(cursor);
      const x=cursor['row'];
      const y=cursor['column'];
      let changeClientId= cursor['socketId'];

      let session=editor.getSession();

      if( this.clientsInfo[changeClientId]!=null)
      {
        session.removeMarker(this.clientsInfo[changeClientId]['marker']);
      }
      else
      {
        this.clientsInfo[changeClientId]={};
        let css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = '.editor_cursor_' + changeClientId
          + '{ position: absolute; background: ' + COLORS[this.clientNumber] + ';'
          + 'z-index: 100; width: 3px !important; }';
        document.body.appendChild(css);
        this.clientNumber++;
        console.log('already add');
      }

      //draw new cursor
      let Range=ace.require('ace/range').Range;
      let newMarker=session.addMarker(new Range(x,y,x,y+1),'editor_cursor_'+changeClientId,true);
      this.clientsInfo[changeClientId]['marker']=newMarker;

    });



  }





  //send to server
  change(delta:string):void{
    this.collaborationSocket.emit('change',delta);
  }

  cursorMove(cursor:string):void{
    console.log('fromt client to server emit cursor')
    this.collaborationSocket.emit('cursorMove',cursor);
  }

  restoreBuffer():void{
    this.collaborationSocket.emit('restoreBuffer');
  }



}

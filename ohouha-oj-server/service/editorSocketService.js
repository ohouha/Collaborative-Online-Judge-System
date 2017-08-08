
var redisClient=require('../modules/redisClient');
const TIMEOUT_IN_SECONDS=3600;

module.exports = function (io) {



    //collaboration sessions
    var collaborations = [];
    var socketIdSessionId = [];

    var sessionPath='/oj_server/'; //??? where is this folder
    io.on('connection', (socket) => {
        //console.log(socket);
        var sessionID = socket.handshake.query['sessionID']; //get message from client, handshake means first time.

        // io.to(socket.id).emit('message','hahahahaha from server');   //emit a event called message to client.

         socketIdSessionId[socket.id] = sessionID;   //everyframe???
         console.log("everyFrame");

        // if (!(sessionID in collaborations)) {

        //     collaborations[sessionID] =
        //         {
        //             'participants': [],
        //         }
        // }

        // collaborations[sessionID]['participants'].push(socket.id);

        if(sessionID in collaborations)
        {
            collaborations[sessionID]['participants'].push(socket.id);
        }
        else
        {

            redisClient.get(sessionPath+sessionID,function(data){

                console.log('from redis change string to Json:'+JSON.parse(data));
                
                if(data)
                {
                    collaborations[sessionID]={
                        'cacheInstruction':JSON.parse(data),   // redis store stirng 
                        'participants':[],
                    }
                }
                else
                {
                    collaborations[sessionID]={
                        'cacheInstruction':[],
                        'participants':[],
                    }
                }

                collaborations[sessionID]['participants'].push(socket.id);

            });

            

        }


        socket.on('change', (delta) => {

            var sessionId=socketIdSessionId[socket.id];
            if(sessionId in collaborations)
            {
                collaborations[sessionId][ 'cacheInstruction'].push(
                ['change',delta,Date.now]
                );
            }
            
            
            forwardEvent('change',socket.id,delta);


        });

        socket.on('cursorMove', (cursor) => {

            cursor=JSON.parse(cursor);
            cursor['socketId']=socket.id;
            forwardEvent('cursorMove',socket.id,JSON.stringify(cursor));
            
        });

        socket.on('restoreBuffer',()=>{
             var sessionId=socketIdSessionId[socket.id];
             if(sessionId in collaborations)
            {
                let cacheInstructions=collaborations[sessionId][ 'cacheInstruction'];
                for(let i=0;i<cacheInstructions.length;i++)
                {
                     socket.emit(cacheInstructions[i][0],cacheInstructions[i][1]);
                }
            }
        });

        socket.on('disconnect',()=>{
         var sessionId=socketIdSessionId[socket.id];
         var foundAndRemoved=false;
        if(sessionId in collaborations)
        {
            var participants=collaborations[sessionId]['participants'];
            var index=participants.indexOf(socket.id);
            if(index>=0)
            {
                participants.slice(index,1);
                foundAndRemoved=true;

                if(participants.length===0)
                {
                    let key=sessionPath+sessionId;
                    let value=JSON.stringify(collaborations[sessionId]['cacheInstruction']);

                    redisClient.set(key,value,redisClient.print);
                    redisClient.expire(key,TIMEOUT_IN_SECONDS);
                    delete collaborations[sessionId];
                }
            }
        
        }

        if(!foundAndRemoved)
        {
            console.log("warning!!!!!!");
        }


    });

    });




    var forwardEvent=function(eventName,socketId,dataString)
    {
        let sessionId = socketIdSessionId[socketId];
            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                for (let i = 0; i < participants.length; i++) {
                    if (socketId != participants[i]) {
                        io.to(participants[i]).emit(eventName, dataString);
                    }
                }
            } else {
                console.log('WARNING!!!!!');
            }
    }





}
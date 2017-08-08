var express = require('express');
var router=express.Router();
var problemService=require('../service/problemService');
var bodyParser=require('body-parser');
var jsonParser=bodyParser.json();

var nodeRestClient = require('node-rest-client').Client;
var restClient = new nodeRestClient();
//node server 

EXECUTOR_SERVER_URL = "http://localhost:5000/build_and_run";

restClient.registerMethod('build_and_run', EXECUTOR_SERVER_URL, 'POST');

router.get('/problems',function(req,res){
    problemService.getProblems()          //go to problemService to use get problem function and then if success, send problem
    .then(problem=>res.json(problem));
});

router.get('/problems/:id',function(req,res){
    var id=req.params.id;
    problemService.getProblem(+id)          
    .then(problem=>res.json(problem));  
});

router.post('/problems', jsonParser, function(req, res) {
    problemService.addProblem(req.body)
        .then(problem => {
            res.json(problem);   //???why??? 
        },
        error => {
            res.status(400).send('problem name already exists');
        });
});


router.post('/build_and_run', jsonParser, function(req, res) {
   const usercode=req.body.usercode;
   console.log('usercode:'+usercode);
   const lang=req.body.lang;

//    res.json({'text':'hello form nodejs'});

    restClient.methods.build_and_run(
        {
            data: {
                code: usercode,
                lang: lang
            },
            headers: { 'Content-Type': 'application/json'}
        }, (data, response) => {
            console.log('Received from execution server: ' + data);
            const text = `Build Ouput: ${data['build']}
            Execute ouput: ${data['run']}`;
            data['text'] = text;
            res.json(data);
        }
    );

});



module.exports=router;

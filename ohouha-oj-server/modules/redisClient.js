var redis=require('redis');
var client=redis.createClient();  //can change port number here


function set(key, value, callback )
{
    client.set(key,value,function(err,res){
        if(err)
        {
            console.log(err);
            return;
        }
        else
        {
            callback(res);
        }
    })
}

function get(key, callback)
{

    client.get(key,function(err,res){
        if(err){
            console.log(err);
            return;
        }
        else{
            callback(res);
        }
    })

}

function expire(key,timeInSeconds)
{
    client.expire(key,timeInSeconds);
}

function quit()
{
    client.quit();
}

module.exports=
{
    get:get,
    set:set,
    expire:expire,
    quit:quit,
    print:redis.print
}








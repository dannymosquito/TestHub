var postedMessages = new Array();

const http = require('http');
const url = require('url');
const hostname = '192.168.0.53';
const port = 3000;

const server = http.createServer((req, res) => 
{
    

    var ach = null;
    var result, query;
    result = new Object();
    query = url.parse(req.url, true).query;
    if(!query.sessionid)
    {
        result.value = "Error - Session ID not defined."
    }
    else
    {
        if(query.postmessage)
        {
            var postedMessage = new Object();
            postedMessage.SessionID = query.sessionid;
            postedMessage.Message = query.message;
            postedMessages.push(postedMessage);
            result.operation = "post";
            result.id = "1";
            result.sessionid = query.sessionid;
            result.value = "OK";
        }  
        if(query.getmessage)
        {
            var sessionID = query.sessionid;
            result.id = '0';
            result.sessionid = sessionID;
            result.value = "No message received.";
            for(var i = 0; i < postedMessages.length; i ++)
            {
                var posted = postedMessages[i];
                if(posted.SessionID === sessionID)
                {
                     result.value = "Message Received: " + posted.Message;
                     result.id = '1';                     
                     postedMessages.splice(i , 1);
                     break;
                }                
            }
        }    
    }
 
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  var responseStr = 'The message that was found was "' + result + '"';
  res.end(JSON.stringify(result));
});

server.listen(port, hostname, () => 
{
  console.log(`Server running at http://${hostname}:${port}/`);
});

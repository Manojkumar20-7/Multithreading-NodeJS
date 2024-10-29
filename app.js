const http=require('http');
const path=require('path');
const fs=require('fs');
const WebSocket=require('ws');
const {Worker}=require('worker_threads');

const server=http.createServer((req,res)=>{
    let filePath=path.join(__dirname,'./public',req.url=='/'?'index.html':req.url);
    const extName=path.extname(filePath);
    let contentType='text/html';
    switch(extName){
        case ".js":
            contentType='text/javascript';
            break;
        case ".css":
            contentType='text/css';
            break;
    }
    
    fs.readFile(filePath,(err,content)=>{
        if(err){
            res.writeHead(500);
            res.end('Server Error...');
        }
        else{
            res.writeHead(200,{"Content-Type":contentType});
            res.end(content,'utf-8');
        }
    });
});

const wss=new WebSocket.Server({server});

const clients=[];

wss.on('connection',(ws)=>{
    console.log('User connected...');
    ws.on('message',(message)=>{
        const num=parseInt(message,10);
        if(!isNaN(num)){
            console.log("Received number for computatiuon: ",num);
            
            const worker=new Worker(path.join(__dirname,'worker.js'),{workerData:num});

            worker.on('message',(result)=>{
                ws.send(result);
            });
            worker.on('error',err=>{
                console.log('Worker error: ',err);
                ws.send('Error in processing the task');
            });
            worker.on('exit',code=>{
                console.log(`Worker stoped with the exit code ${code}`);
            });
        }
        else{
            ws.send(`Please send a valid number`);
        }
    });
    ws.on('close',()=>{
        console.log('User disconnected...');
        let index=clients.indexOf(ws);
        clients.splice(index,1);
    })
});

server.listen(3000,()=>{
    console.log('Server is listening on http://localhost:3000');
});
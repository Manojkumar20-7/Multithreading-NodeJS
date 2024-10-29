const ws=new WebSocket('ws://localhost:3000');

const messageList=document.getElementById('messages');
const messageInput=document.getElementById('message-input');
const sendBtn=document.getElementById('send-btn');

ws.onopen=()=>{
    console.log('Connected to WebSocket Server...');
};

ws.onmessage=(e)=>{
    const li=document.createElement('li');
    li.textContent=e.data;
    messageList.appendChild(li);
};

ws.onclose=()=>{
    console.log("Disconnected from WebSocket Server...");
};

sendBtn.addEventListener('click',()=>{
    const message=messageInput.value;
    ws.send(message);
    messageInput.value='';
});
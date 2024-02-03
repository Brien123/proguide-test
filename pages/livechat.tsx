import React, { useContext, useEffect, useState, useRef }  from 'react';
import { userData } from "./_app";
import type { ReactElement } from "react";
import { SocketContext } from './_app';
import NavBar from 'react-bootstrap/Navbar';
import { AxiosGetData, CentralisedBody } from '../components/utilityComponents';
import { baseURL } from '../types';
import ScrollIntoView from 'react-scroll-into-view'
import { ToastContainer, toast } from 'react-toastify';
import { Router, useRouter } from 'next/router';
import MyImage from '../components/images/imageDiv';
import GIF from '../components/images/hiGif.jpg'


type chatsType={
    sender: string,
    roomID: string,
    content: string,
    date: Date,
}


type dataFromSocket={
    senderID: string,
    receiverID: string,
    roomID: string,
    messages: null | string

} | string

const LiveChat=()=>{
    const socket = useContext(SocketContext);
    const chatsToSave = useRef('');
    const chatRoom = useRef('');
const [room,setRoom] =useState('');
const [txtMsg,setTxtMsg] =useState('');
const [receiver, setReciever] = useState('');
const [sender, setSender] = useState('');
const [chats, setChats] = useState<chatsType[]>([])
var userCred = useContext(userData);

useEffect(()=>{
chatsToSave.current = JSON.stringify(chats);

localStorage.setItem('chats', JSON.stringify( {
    roomID: room,
    chat: JSON.stringify(chats),
    type:'saveChat'

}));

},[chats]);
const textareaRef = useRef<HTMLTextAreaElement>(null);

var router = useRouter();
var queryString = router.query;
useEffect(() => {
if(queryString.tutorID === undefined  || queryString.tutorID === null ){
    toast.warning('Searching for Tutors....');
}else{
    toast.success('Click AnyWhere to Scroll to Bottom');
    //console.log(queryString.tutorID)
    setReciever(queryString.tutorID as string);

}
  }, []);
const checkUser =(recepient: string)=>{
    //console.log(userCred)
    setReciever(recepient);
    if(userCred.userID !== null && recepient !== '' && userCred.userID !== undefined){
        var formValues = {
            userid: userCred.userID,
            clickeduserid: recepient
        }
        //console.log(formValues);
    
        socket.emit('checkUser', formValues);
    }else{
        alert('One key variable is undefined');
    }
    
    socket.on('previous chat',(data: dataFromSocket)=>{
        //console.log(typeof(data))
        if(typeof data == 'number'){
            //console.log('string var')
            setRoom(data);
            chatRoom.current = JSON.stringify(data);
            setReciever(recepient)
        }else if(typeof data == 'object'){
            //console.log('objetc var')
            setRoom(data.roomID);
            chatRoom.current = JSON.stringify(data.roomID);

             data.messages !== null && setChats(JSON.parse(data.messages));
            setReciever(data.receiverID)
        } 
    })

    socket.on('re join', (data)=>{
        //console.log('I have rejoined');
        socket.emit('checkUser', data);
    })
}


const SendMessage= (e:React.MouseEvent<HTMLButtonElement> |  React.KeyboardEvent<HTMLTextAreaElement>)=>{
    e.preventDefault();
    //to send message, you need sendid, receiverid, roomid, content, date

    if(txtMsg !== ''){
        var Message = {
            sender: userCred.userID,
            roomID: room,
            content: txtMsg,
            date: Date.now()
        } as unknown as chatsType
    
        //console.log('i sent a message')
        //console.log(Message)

       socket.emit('send_message', Message);
        setChats((chats)=>[...chats, Message]);


        //axios.post('/api/test',{headers: { "Content-Type": "application/json" }}).then(res=>console.log(res.data)).catch(err=>console.log(err));
       // fetchwithAPI();
    }

    
    
    setTxtMsg('')
}


useEffect(()=>{
    socket.off('received_message').on('received_message',(data: chatsType)=>{
       // console.log('i received a msg')
        //console.log(data)
                setChats((chats)=>[...chats, data]);
        
        
    })

    socket.on('saveMessages',()=>{
       // console.log(chatsToSave.current);
        
        var str = chatRoom.current.substring(1, chatRoom.current.length - 1);

    //asynchronously save chats in db after 
    var formvalues = {
        chat: chatsToSave.current,
        roomID: str,
        type: 'saveChat'
            }
   AxiosGetData(baseURL+'livechat.php','POST', formvalues).then(res=>{
    //console.log('I saved messages before dying')
                console.log(res.data);
    }).catch(err=>{
        console.log(err);
    })
    })
return ()=>{
    //socket.disconnect();
    
}
   

},[])



//use an overlay screen to ask the user to select the person he wishes to talk to or use a query string
   
    return(
        <ScrollIntoView selector="#footer">
            <ToastContainer/>
    <>  
        <div className=' container-fluid p-2 ' >
            <div className="w-100 nunito text-center p-2  border-bottom">
    <strong>Live Chat</strong>  </div>
        {
            receiver == ''?<>
            <div className="container-fluid m-2 text-center p-2">
            <CentralisedBody>
                <div className="container  p-2">
                    <MyImage classes='img-fluid' url={GIF} />
                </div>
            </CentralisedBody>
            <div className="p-3 container-fluid">
            <button className='btn btn-info text-white w-100' id={queryString.tutorID as string} onClick={(e)=>{checkUser(e.currentTarget.id)}}>Initiate Chat </button>

            </div>

            </div>
            </>:
            <div className='d-flex flex-column'>
          
            {chats.map(msg=>{
                return(
                    <div className={`d-flex p-2 ${msg.sender === userCred.userID?'justify-content-end ':'justify-content-start'}`} key={Math.floor(Math.random() * 100000) + 1}>
                      
<div className="d-block" style={{maxWidth:'70%'}}>
<div className={` p-2 rounded text-wrap text-break arima text-white  ${msg.sender === userCred.userID?'bg-primary ':'bg-warning'}`}  >{msg.content}</div>
<div >{new Date((msg.date)).getHours()}:{new Date((msg.date)).getMinutes()}</div>  
</div>

                    </div>
                )
            })}
            </div>
       
         }
         
     



<div id="footer"></div>

         
      
        </div>
        {
            receiver !== '' &&
        
        <NavBar expand="lg" fixed="bottom" bg='light' variant="white" className="d-block bdr" style={{maxHeight:'100px'}}>
         <div className="row  p-2  w-100  border-top">
            <div className="col-10 ">
                <textarea  placeholder='Enter Message...'
                 onKeyDown={(e)=>{e.key === 'Enter' && SendMessage(e)}} 
                 ref={textareaRef}
                 value={txtMsg} onChange={(e)=>{setTxtMsg(e.currentTarget.value)}} 
                 className='form-control w-100 p-2' style={{
                    height: '50px', // Set a fixed or maximum height for the textarea
                    overflowY: 'auto', // Enable vertical scrolling
                  }} />
            </div>
            <div className='col-2'>
                <button className="btn btn-warning text-white arima w-100 " onClick={SendMessage}><i className='fa fa-paper-plane'></i></button>
            </div>
            </div>
        </NavBar>}
        </>
        </ScrollIntoView>
    )
}

export default LiveChat;
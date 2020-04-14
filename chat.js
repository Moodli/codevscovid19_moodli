document.addEventListener('DOMContentLoaded', () => {
  //Connect to the socket.io server
  // const socket = io.connect('https://knct.me/');
  const socket = io.connect('http://localhost:3003');

  //Get username
  const userName = document.getElementById('userName').innerHTML;
  //Get the profImage URL
  const profImage = document.getElementById('profImage').innerHTML;


  //Day time
  const today = new Date();
  const time = 'on' + ' ' + today.getDate() + '/' +
      today.getMonth() + '/' +
      today.getFullYear() + ' ' + 'at' + ' ' +
      today.getHours() + ':' + today.getMinutes();

  socket.on('channelId', channelId => {
    console.log(channelId);
  });

  //Sending messages
  //When pressing 'send' button => deprecated
  // $("#sendbutton" ).click(function() {
  //     //Prevent the page from reload
  //     event.preventDefault();

  //       //Get messages from the chat input
  //       let messages = document.getElementById('inputmsg').value;

  //       //If the send box is not empty
  //       if (messages !== ' ') {

  //           //Message content & Create new message block
  //           const content =

  //           `<li class="right clearfix">
  //           <span class="chat-img pull-right">
  //           <img src="${profImage}" alt="User Avatar">
  //           </span>
  //           <div class="chat-body clearfix"><div class="header">
  //           <strong class="primary-font">${userName}</strong>
  //           <small class="pull-right text-muted">
  //           ${time}</small></div><p> 
  //           ${messages}</p></div></li>`;

  //           //Append the message to the chatscreen
  //           document.getElementById('chat').innerHTML += content;

  //           //Send the message to the server | custom array separator
  //           socket.compress(true).emit('globalChat', profImage + '**xxaasad' + time + '**xxaasad' + messages + '**xxaasad' + userName);

  //       }

  //       //Auto-scroll
  //       $('.chat-base').scrollTop($('.chat-base')[0].scrollHeight);

  //       //Clear the textbox
  //       document.getElementById('inputmsg').value = ' ';
  // });

  //When Keydown -> enter
  document.getElementById('inputmsg').addEventListener('keydown', (event) => {
      if (event.which == 13 && event.shiftKey == false) {
        //Prevent the page from reload
        event.preventDefault();

          //Get messages from the chat input
          let messages = document.getElementById('inputmsg').value;

          //If the send box is not empty
          if (messages !== ' ') {

              //Message content & Create new message block
              const content =

              `<li class="pr-3 right clearfix">
                <span class="chat-img pull-right"><img src="${profImage}" alt="User Avatar"></span>
                <div class="chat-body clearfix">
                  <div class="header">
                    <strong class="pull-right primary-font">${userName}</strong>
                    <small class="pr-3 pull-right text-muted">${time}</small>
                  </div>
                  <p class="pull-right chat-msg-right">${messages}</p>
                </div>
              </li>`;

              //Append the message to the chatscreen
              document.getElementById('chat').innerHTML += content;

              //Send the message to the server | custom array separator
              socket.compress(true).emit('globalChat', profImage + '**xxaasad' + time + '**xxaasad' + messages + '**xxaasad' + userName);

          }

          //Auto-scroll
          $('#chat-base').scrollTop($('#chat-base')[0].scrollHeight);

          //Clear the textbox
          document.getElementById('inputmsg').value = ' ';

      }


  });



  //Received Message
  socket.on('globalChat' + 'received', (data) => {

      //Received Message content & create new message block 
      const rcontent =
      `<li class="left clearfix">
        <span class="chat-img pull-left"><img src="${data[0]}" alt="User Avatar"></span>
        <div class="chat-body clearfix">
          <div class="header">
            <strong class="pull-left primary-font">${data[3]}</strong>
            <small class="pl-3 pull-left text-muted">${data[1]}</small>
          </div>
          <p class="pull-left chat-msg-left">${data[2]}</p>
        </div>
      </li>`;

      //Append the message to the chatscreen
      document.getElementById('chat').innerHTML += rcontent;

      //Auto-scroll
      $('#chat-base').scrollTop($('#chat-base')[0].scrollHeight);


  });

    //Render Chat History
    socket.on('chatHistory', (data) => {


      //Loop through the chat history object
      for (let i = 0; i < data[0].chatHistory.length; i++) {
  
          //If the message is from you
          if (data[0].chatHistory[i].sender == userName) {
              //Chat History content & create message block
              const rcontent =

              
              `<li class="pr-3 right clearfix">
                <span class="chat-img pull-right"><img src="${data[0].chatHistory[i].profImg}" alt="User Avatar"></span>
                <div class="chat-body clearfix">
                  <div class="header">
                    <strong class="pull-right primary-font">${data[0].chatHistory[i].sender}</strong>
                    <small class="pr-3 pull-right text-muted">${data[0].chatHistory[i].time}</small>
                  </div>
                  <p class="pull-right chat-msg-right">${data[0].chatHistory[i].msg}</p>
                </div>
              </li>`;
  
              //Append the message to the chatscreen
              document.getElementById('chat').innerHTML += rcontent;
  
  
              //If the message is not from you
          } else {
  
              //Chat History content & create new message block
              const rcontent =

              `<li class="left clearfix">
                <span class="chat-img pull-left"><img src="${data[0].chatHistory[i].profImg}" alt="User Avatar"></span>
                <div class="chat-body clearfix">
                  <div class="header">
                    <strong class="pull-left primary-font">${data[0].chatHistory[i].sender}</strong>
                    <small class="pl-3 pull-left text-muted">${data[0].chatHistory[i].time}</small>
                  </div>
                  <p class="pull-left chat-msg-left">${data[0].chatHistory[i].msg}</p>
                </div>
              </li>`
  
              `<li class="left clearfix">
                <span class="chat-img pull-left">
                <img src="${data[0].chatHistory[i].profImg}" alt="User Avatar">
                </span>
                <div class="chat-body clearfix">
                  <div class="header">
                    <strong class="primary-font">${data[0].chatHistory[i].sender}</strong>
                    <small class="pull-right text-muted">
                    ${data[0].chatHistory[i].time}</small>
                  </div>
                  <p>
                  ${data[0].chatHistory[i].msg}
                  </p>
                </div>
                </li>`;
  
              //Append the message to the chatscreen
              document.getElementById('chat').innerHTML += rcontent;
  
  
  
          }
      }
  
      //Auto-scroll
      $('.chat-base').scrollTop($('.chat-base')[0].scrollHeight);
    });


});
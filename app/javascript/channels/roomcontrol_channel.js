import consumer from "./consumer"





document.addEventListener('turbolinks:load', () => {


    window.messageContainer = document.getElementById('chatbox')

    if (messageContainer === null) {
        return
    }

    //hide hand until cards are dealt
    $('#hand').hide();
    $('#turnup').hide();
    $('#pickup-yesno').hide();
    $('#trump-selection').hide();
    $('#loner-selection').hide();

    //universal functions for when data received
    function clearBar() {
      $('#trump-selection').hide()
      $('#p1-dealer').empty()
      $('#p2-dealer').empty()
      $('#p3-dealer').empty()
      $('#p4-dealer').empty()
      $('#p1-order').empty()
      $('#p2-order').empty()
      $('#p3-order').empty()
      $('#p4-order').empty()
      $('#p1-tricks').empty()
      $('#p2-tricks').empty()
      $('#p3-tricks').empty()
      $('#p4-tricks').empty()
    }
    
    function clearBoard() {
      $('#p1-played-card').attr('src', '/assets/blank_white_card.png')
      $('#p2-played-card').attr('src', '/assets/blank_white_card.png')
      $('#p3-played-card').attr('src', '/assets/blank_white_card.png')
      $('#p4-played-card').attr('src', '/assets/blank_white_card.png')
    }
    
    function showImage(data) {
      console.log("img received")
      var img_element = document.getElementById(data.element);
      var img_base64_content = data.img;
      img_element.src = "data:image/png;base64," + img_base64_content;
      $('#' + data.element).show('normal');
      $(data.show).show('normal');
      $(data.hide).hide('normal');
    }

    function sendMessage() {
      let text = $('#chatinput').val();
      let userid = "#" + $("#user-id").data('user-id') + "-status";
      let username = $("#username").data('username');
      $('#chatinput').val('');
      roomChannel.send({ type: "chat", message: username + " : " + text, online: userid, username: username });
    }
    
    function chatBoxUpdate(data) {
      console.log("message received")
      $('#chatbox').val($('#chatbox').val() + data.message + '\n');
      $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
      if (typeof data.online !== 'undefined') {
        $(data.online).empty();
        $(data.online).append("Online");
        $(data.online).attr('class', 'text-success');
      } else if (typeof data.disconnected !== 'undefined') {
        $(data.disconnected).empty("Offline");
        $(data.disconnected).append("Offline");
        $(data.disconnected).attr('class', 'text-danger');
      }
      //change color of button for a second to show let user know new message
      var username = $("#username").data('username');
      if (username !== data.username) {
        var chatToggle = $('#toggle-chat')
        chatToggle.text("Toggle Chat (New Message from " + data.username + "!)");
        chatToggle.attr('class', 'btn btn-primary btn-sm');
        setTimeout(function(){
          chatToggle.text("Toggle Chat");
          chatToggle.attr('class', 'btn btn-dark btn-sm');
        },4000);
      }
      
    }
    //timer variable to avoid double timers on toggle bar
    var timer;

    function chatBoxTyping() {
      var username = $("#username").data('username');
      roomChannel.send({ type: "chat", typing: username });
    }

    function typingButtonChange(data) {
      var username = $("#username").data("username");
      //make sure that the user typing isnt receiving a typing notification
      if (username !== data.typing) {
        var chatToggle = $('#toggle-chat');
        chatToggle.text("Toggle Chat (" + data.typing + " is typing)");
        clearTimeout(timer);
        timer = setTimeout(function(){
          chatToggle.text("Toggle Chat");
        },5000);
      }
    }

    //universal functions used for sending commands
    function sendCommand(input) {
      let userid = $("#user-id").data('user-id');
      roomChannel.send({ type: "gamecontrol", command: input, id: userid });
      var btn = $(this);
      btn.prop('disabled', true);
      setTimeout(function() {
        btn.prop('disabled', false) }, 1000);
    }

    function sendCardClick(card) {
      let userid = $("#user-id").data('user-id');
      roomChannel.send({ type: "gamecontrol", command: card, id: userid });
    }


    //setup activecable connection
    const roomChannel = consumer.subscriptions.create({ channel: "RoomcontrolChannel", room_id: $("#room-id").data('room-id'), username: $("#username").data('username'), user_id: $("#user-id").data('user-id') }, {
      connected() {
        let userid = "#" + $("#user-id").data('user-id') + "-status";
        $(userid).empty();
        $(userid).append("Online");
        $(userid).attr('class', 'text-success')
        console.log('connected');
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        // Called when there's incoming data on the websocket for this channel
        if (typeof data.img !== 'undefined') {
          showImage(data);


        } 
        
        if (typeof data.message !== 'undefined') {
          chatBoxUpdate(data);
        } 

        if (typeof data.typing !== 'undefined') {
          typingButtonChange(data);
        }

        if (typeof data.gameupdate !== 'undefined') {
          $(data.element).empty()
          $(data.element).append(data.gameupdate)
          $(data.hide).hide('normal')
          $(data.show).show('normal')
        }
        if (typeof data.hide !== 'undefined') {
          $(data.hide).hide('normal')
          $(data.show).show('normal')
        }
        if (typeof data.clearbar !== 'undefined') {
          clearBar();
        }
        if (typeof data.clearboard !== 'undefined') {
          clearBoard();
      }

      }

    });


    //universal operations
    $('#submitchat').on('click', function() {
      sendMessage();
    });

    //index counter for keypress input so it doesnt send a keypress update on everykey
    var keypressCount = 1;

    $('#chatinput').keypress(function(e) {
      var code = e.keyCode || e.which;
      if (code == 13) {
        sendMessage();
        } else {
          //send update that someone is typing
          if (keypressCount === 1) {
            chatBoxTyping();
          } else if (keypressCount === 8) {
            keypressCount = 0;
          }
          keypressCount++;
        }
    });

    $('#leave-room').on('click', function() {
      roomChannel.unsubscribe();
    });

    $('#start-game').on('click', function() {
      roomChannel.send({ type: "gamecontrol", command: "start-game" });
    });

    $('#toggle-chat').on('click', function() {
      $('#chat-group').toggle();
    });
    $('#toggle-onlinebar').on('click', function() {
      $('#onlinebar').toggle();
    });

    //special function for twos_threes_and_fours gag
    $('#toggle-chat').on('dblclick', function(){
      console.log("twos_threes_and_fours");
      roomChannel.send({ type: "twos_threes_and_fours" });
    });

    $('#start-game').on('click', function() {
      $('#start-game').hide();
    });

    
    $('#pickup-yes').on('click', function() {
      sendCommand(true);
    });
    $('#pickup-no').on('click', function() {
      sendCommand(false);
    });
    $('#trump-selection0').on('click', function() {
      sendCommand(0);
    });
    $('#trump-selection1').on('click', function() {
      sendCommand(1);
    });
    $('#trump-selection2').on('click', function() {
      sendCommand(2);
    });
    $('#trump-selection3').on('click', function() {
      sendCommand(3);
    });
    $('#trump-selection4').on('click', function() {
      sendCommand(false);
    });
    $('#loner-selection0').on('click', function() {
      sendCommand(true);
    });
    $('#loner-selection1').on('click', function() {
      sendCommand(false);
    });
    $('#reload-gui').on('click', function() {
      let player_no = $("#player-no").data('player-no');
      console.log(player_no);
      roomChannel.send({ type: "gamecontrol", command: "reload_gui", player_no: player_no });
      var btn = $(this);
      btn.prop('disabled', true);
      setTimeout(function() {
        btn.prop('disabled', false) }, 3000);
    });

    //card operations
    $('.card0').on('click', function() {
      sendCardClick(0);
    });
    $('.card1').on('click', function() {
      sendCardClick(1);
    });
    $('.card2').on('click', function() {
      sendCardClick(2);
    });
    $('.card3').on('click', function() {
      sendCardClick(3);
    });
    $('.card4').on('click', function() {
      sendCardClick(4);
    });
    $('.pickupcard').on('click', function() {
      sendCardClick(5);
    });

})

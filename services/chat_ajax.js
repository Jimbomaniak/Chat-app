(function() {
    let saveBtn = document.querySelector(".btn-save");
    let modal = document.querySelector(".modal");
    let nickInput = document.querySelector("input.nick");
    let nameInput = document.querySelector("input.name");
    let sendBtn = document.querySelector(".btn-submit");
    const message = document.querySelector(".msg");
    const messages = document.querySelector(".messages");
    const usersList = document.querySelector("ul.users-list");

    saveBtn.addEventListener("click", () => {
      let nick = nickInput.value;
      let name = nameInput.value;
      if (!nick.length | !name.length) {
        alert("You should fill all fields")
      } else {
          if (validateName(nickInput.value)) {
            login();
          }
      }
    })

    sendBtn.onclick = () => {
      if (!message.value) {return}
      fetchMessage();
    };

    let ajaxRequest = (options) => {
      let url = options.url || '/';
      let method = options.method || 'GET';
      let callback = options.callback || function() {};
      let data = options.data || {};
      let xmlHttp = new XMLHttpRequest();

      xmlHttp.open(method, url, true);
      xmlHttp.setRequestHeader('Content-Type', 'application/json');
      xmlHttp.send(JSON.stringify(data));

      xmlHttp.onreadystatechange = () => {
        if(xmlHttp.status == 200 && xmlHttp.readyState == 4) {
          callback(xmlHttp.responseText);
        }
      };
    };

    function getData() {
      ajaxRequest({
          url: '/chat-data',
          method: 'GET',
          callback: (data) => {
              while (messages.hasChildNodes()) {
                  messages.removeChild(messages.firstChild);
              }
              while (usersList.hasChildNodes()) {
                  usersList.removeChild(usersList.firstChild);
              }
              let parsed = JSON.parse(data);
              for (let msg of parsed['messages']) {
                  let el = document.createElement('li');
                  el.classList.add('message');
                  if (msg.text.split(' ').includes(`@${nickInput.value}`)){
                      el.classList.add('message-direct');
                  }
                  el.innerHTML = `<b>${msg.nick}</b>: ${msg.text}`;
                  messages.appendChild(el);
              }
              for (let user of parsed['users']) {
                  let listUser = document.createElement('li');
                  listUser.innerHTML = `${user.name} @${user.nick}`;
                  usersList.appendChild(listUser);
              }
          },
      });
  }
    getData();

    function fetchMessage() {
      let data = {
          nick: nickInput.value,
          text: message.value,
      };

      message.value = '';

      ajaxRequest({
          method: 'POST',
          url: '/messages',
          data: data,
      });
  }

    function login() {
      let data = {
        nick: nickInput.value,
        name: nameInput.value,
    };

    ajaxRequest({
        method: 'POST',
        url: '/users',
        data: data,
    });
    modal.style.display = 'none';
  }

    setInterval(() => {
      getData();
    }, 1000);

    function validateName(name) {
        for (let user of usersList.childNodes){
            let nick = user.textContent.split(' @')[1];
            if (nick === name) {
                alert(`Nickname '${name}' already taken`);
                return false
            }
        }
        return true
    }

  })();

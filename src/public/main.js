console.log("Running...")

moment.locale('pt-br')

const socket = io()

const clientsTotal = document.querySelector("#clients-total")
const messageContainer = document.querySelector("#message-container")
const nameInput = document.querySelector("#name-input")
const messageForm = document.querySelector("#message-form")
const messageInput = document.querySelector("#message-input")

const messageTone = new Audio('/message-tone.mp3')

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  sendMessage()
})

socket.on('clients-total', (data) => {
  clientsTotal.innerText = `Total clients: ${data}`
})


function sendMessage () {
  if(messageInput.value === "") return 
  
  const data = {
    id: window.crypto.randomUUID(),
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date()
  }

  socket.emit('message', data)
  addMessageToUI(true, data)
  messageInput.value = ""
}

socket.on('chat-message', (data) => {
  messageTone.play()
  addMessageToUI(false, data)
})

function addMessageToUI (isOwnMessage, data) {
    const element =
    `
    <li class="${isOwnMessage ? 'message-right' : 'message-left' }">
      <p class="message">
        ${data.message}
        <span>${data.name} ◽ ${moment(new Date(data.dateTime)).fromNow()}</span>
      </p>
    </li>
  `

  messageContainer.innerHTML += element

  if((messageContainer.scrollTop + messageContainer.clientHeight) + 100 < messageContainer.scrollHeight) {
    return 
  }
  scrollToBottom()
}

function scrollToBottom () {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
  socket.emit('feedback', {
    feedback: `🦼${nameInput.value} Está digitando uma mensagem.`
  })
})

messageInput.addEventListener('keypress', (e) => {
  socket.emit('feedback', {
    feedback: `🦼${nameInput.value} Está digitando uma mensagem.`
  })
})

messageInput.addEventListener('blur', (e) => {
  socket.emit('feedback', {
    feedback: ''
  })
})

socket.on('feedback', (data) => {
  clearFeedback()
  const element = 
  `
    <li class="message-feedback">
      <p class="feedback" id="feedback">
        ${data.feedback}
      </p>
    </li>
  `
  messageContainer.innerHTML += element
})

function clearFeedback () {
  document.querySelectorAll('li.message-feedback').forEach(element => {
    element.parentNode.removeChild(element)
  })
}

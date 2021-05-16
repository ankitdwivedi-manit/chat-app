const socket = io()

const messageForm = document.getElementById('message-form')
let messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('button')
const sendLocation = document.getElementById('send-location')
const messages = document.getElementById('messages')


//Templates
const messageTemplate = document.getElementById('message-template').innerHTML 
const locationTemplate = document.getElementById('location-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML


//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})



const autoscroll = () => {
    // New message content
    const newMessage = messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = messages.offsetHeight

    // Height of message container
    const containerHeight = messages.scrollHeight

    // How far I have scrolled
    const scrollOffset = messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight
    }

    
}

socket.on('message', (message)=>{
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:m a') 
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message)=>{
    const html = Mustache.render(locationTemplate, {
        username : message.username,
        url : message.url,
        createdAt:  moment(message.createdAt).format('h:m a')  
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room, 
        users
    })
    document.getElementById('sidebar').innerHTML = html
})

messageForm.addEventListener("submit", (e)=>{
    e.preventDefault()

    //dasabled button
    messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error)=>{
        //enable button
        messageFormButton.removeAttribute('disabled')
        messageFormInput.value = ""
        messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('message delivered!')
    })
    
})

sendLocation.addEventListener('click', ()=> {

    if(!navigator.geolocation)
        return alert('Geolocation is not supported by your browser')

    //disable sendLocation button
    sendLocation.setAttribute('disabled', 'disabled')
    
    navigator.geolocation.getCurrentPosition((position)=>{
        //enable sendLocation
        sendLocation.removeAttribute('disabled')
        const {coords} = position
        const {latitude, longitude} = coords
        socket.emit('sendLocation', {latitude: latitude,longitude: longitude}, ()=>{
            console.log('Location Shared')
        })
    })
   
})

socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})
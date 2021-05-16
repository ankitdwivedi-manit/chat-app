const generateMessage = function(username, message){ 
    return {
        username : username,
        text : message,
        createdAt : new Date().getTime()
    }
}

const generateLocationMessage = function(username, url){
    return {
        username : username,
        url : url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}
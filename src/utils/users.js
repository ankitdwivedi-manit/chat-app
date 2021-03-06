const users = []

const addUser = ({id, username, room}) => {
    //clean the data:
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    //validate the data:
    if(!username || !room){
        return {
            error : "username and room are required!"
        }
    }
    //check for existing user:
    const existingUser = users.find((user) => {
        return  user.room === room && user.username === username
    })
    //validate username
    if(existingUser){
        return {
            error : "username alrady taken"
        }
    }
    //store user
    const user = {
        id: id,
        room : room,
        username : username
    }
    users.push(user)
    return {user}
}


const removeUser = (id) => {
    const index = users.findIndex((user => {
        return user.id === id
    }))
    if(index != -1){
        return users.splice(index, 1)[0]
    }
}


const getUser = (id) => {
    return users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter(user => user.room === room)
}


module.exports = {
    addUser, 
    getUser, 
    removeUser,
    getUsersInRoom
}


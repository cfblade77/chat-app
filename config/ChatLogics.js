export const getSender = (loggedUser,users)=>{
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name
}


export const getSenderFull = (loggedUser,users)=>{
    return users[0]._id === loggedUser._id ? users[1] : users[0]
}

export const isSameSender = (messages,m,i,userId) =>{
    return(
        i<messages.length -1 &&
        (messages[i+1].sender._id !== m.sender._id ||
        messages[i+1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    )
}


export const isLastMessage = (messages,i,userId) =>{
    return(
        i===messages.length-1 &&
        messages[messages.length-1].sender._id !== userId &&
        messages[messages.length-1].sender._id
    )
}


export const isSameSenderMargin = (messages, m, i, userId) => {
    // Check if the next message is from the same sender and the current message is not from the logged-in user
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      m.sender._id !== userId
    ) {
      return 33; // Margin for the same sender (non-logged-in user)
    } 
    
    // Check if the next message is from a different sender or it's the last message
    if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        m.sender._id !== userId) ||
      (i === messages.length - 1 && m.sender._id !== userId)
    ) {
      return 0; // No margin for different sender
    }
  
    return "auto"; // Default margin
  };




export const isSameUser = (messages,m,i)=>{
    return i>0 && messages[i-1].sender._id === m.sender._id
}

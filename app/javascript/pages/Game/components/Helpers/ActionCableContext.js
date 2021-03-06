import React from "react";

const ActionCableContext = React.createContext({
    roomId: 0,
    userId: 0,
    playerNo: 0,
    username: 'default',
    playeNames: {},
    roomChannel: {},
    messages: [],
    gameState: {},
    setGameState: () => {}
})

export default ActionCableContext;
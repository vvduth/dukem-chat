

export const createChatService = async (userId: string ,
    body: {
        participantId?: string, 
        isGroup?: boolean,
        participants?: string[],
        groupName?: string
    }
    
) =>  {
    
    const {
        participantId,
        isGroup,
        participants,
        groupName
    } = body
    let chat;
    let allParticipants: string[] = [];

    if (isGroup && participants?.length && groupName) {
        allParticipants = [userId,...participants];
    }
}
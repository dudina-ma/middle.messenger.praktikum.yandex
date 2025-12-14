import ChatsAPI from '../api/chats/chats-api';

class ChatsController {
    public getChats() {
        return ChatsAPI.getChats();
    }
}

export default new ChatsController();

import ChatsAPI from '../api/chats/chats-api';
import store from '../store/store';

class ChatsController {
    
    public getChats() {
        return ChatsAPI.getChats()
            .then((chats) => {
                store.set('chats', chats);
            });
    }

    public createChat(data: { title: string }) {
        return ChatsAPI.createChat(data)
            .then(() => {
                this.getChats();
            })
            .catch((error) => {
                console.error('Create chat error:', error);
                throw error;
            });
    }
}

export default new ChatsController();

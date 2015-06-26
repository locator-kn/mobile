module Controller {
    export class MessagesCtrl {

        messages = [];
        messagesIdCache;

        opponentId:string;

        constructor(private MessengerService, private UserService, private $state, private SocketService, private $ionicScrollDelegate) {
            this.opponentId = this.$state.params.opponentId;
            this.getConversation(this.opponentId);

            this.registerSocketEvent();
        }


        // one single conversation
        getConversation(conversationId) {
            return this.MessengerService.getConversation(conversationId)
                .then(result => {
                    this.messages = result.data;
                    this.$ionicScrollDelegate.scrollBottom(true);
                });
        }


        registerSocketEvent() {
            this.SocketService.offEvent('new_message');
            this.SocketService.onEvent('new_message', (newMessage) => {
                console.log('newMessage');
                if (this.opponentId === newMessage.conversation_id) {
                    this.messages.push(newMessage);
                    this.$ionicScrollDelegate.scrollBottom(true);
                } else {
                }
                //this.messagesIdCache.remove(this.basePathRealtime + '/messages/' + newMessage.conversation_id);
            });
        }

        since(date) {
            return moment(new Date(date)).startOf('hour').fromNow();
        }

        static controllerId:string = "MessagesCtrl";
    }
}

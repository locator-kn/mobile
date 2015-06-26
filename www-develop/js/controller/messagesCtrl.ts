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

                    //this.emitAck(newMessage.from, newMessage.conversation_id);
                } else {
                    //this.conversationsHash[newMessage.conversation_id][this.$rootScope.userID + '_read'] = false;
                }
                //this.messagesIdCache.remove(this.basePathRealtime + '/messages/' + newMessage.conversation_id);
            });
        }


        static controllerId:string = "MessagesCtrl";
    }
}

module Controller {
    export class MessagesCtrl {

        messages = [];
        messagesIdCache;
        conversation:any = {};

        conversationId:string;
        opponentId:string;

        constructor(private MessengerService, private $rootScope, private $state, private SocketService, private $ionicScrollDelegate) {
            this.conversationId = this.$state.params.conversationId;
            this.opponentId = this.$state.params.opponentId;

            this.getConversation(this.conversationId);
            this.getMessages(this.conversationId);
            this.registerSocketEvent();
        }


        // get messages of a single conversation
        getMessages(conversationId) {
            return this.MessengerService.getMessages(conversationId)
                .then(result => {
                    debugger;
                    this.messages = result.data;
                    this.$ionicScrollDelegate.scrollBottom(true);
                });
        }

        getConversation(conversationId) {
            return this.MessengerService.getConversationById(conversationId)
                .then(result => {
                    this.conversation = result.data;
                    debugger;
                    if (!this.conversation[this.$rootScope.userID + '_read']) {
                        this.emitAck(this.conversation.opponent._id, conversationId)
                    }
                    this.$ionicScrollDelegate.scrollBottom(true);
                });
        }

        emitAck(from, conversation_id) {
            console.log('send ack for received message', {from: this.$rootScope.userID, opponent: from, conversation_id: conversation_id});
            setTimeout(() => {
                this.SocketService.emit('message_ack', {from: this.$rootScope.userID, opponent: from, conversation_id: conversation_id});
            }, 10);
            this.conversation[this.$rootScope.userID + '_read'] = true;
        }



        registerSocketEvent =() =>  {
            this.SocketService.offEvent('new_message');
            this.SocketService.onEvent('new_message', (newMessage) => {
                console.log('newMessage');
                if (this.conversationId === newMessage.conversation_id) {
                    this.messages.push(newMessage);
                    this.$ionicScrollDelegate.scrollBottom(true);
                } else {
                }
                this.MessengerService.clearMessageCacheById(this.conversationId);
            });
        };

        static since(date) {
            return moment(new Date(date)).startOf('minutes').fromNow();
        }

        sendMessage = (message) => {
            message = message.replace(/<\/?[^>]+(>|$)/g, "");

            debugger;

            this.MessengerService.sendMessage(message, this.conversationId, this.opponentId, this.$rootScope.userID)

                .then(result => {
                    var date = new Date();
                    this.$ionicScrollDelegate.scrollBottom(true);
                    this.MessengerService.clearMessageCacheById(this.conversationId);
                })
                .catch(result => {
                    console.info("Error");
                });
        };

        static controllerId:string = "MessagesCtrl";
    }
}

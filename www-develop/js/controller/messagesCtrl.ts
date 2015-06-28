module Controller {
    export class MessagesCtrl {

        messages = [];
        messagesIdCache;

        conversationId:string;
        opponentId:string;

        constructor(private MessengerService, private $rootScope, private $state, private SocketService, private $ionicScrollDelegate) {
            this.conversationId = this.$state.params.conversationId;
            this.opponentId = this.$state.params.opponentId;

            this.getConversation(this.conversationId);
            this.registerSocketEvent();
        }


        // one single conversation
        getConversation(conversationId) {
            return this.MessengerService.getConversation(conversationId)
                .then(result => {
                    debugger;
                    this.messages = result.data;
                    this.$ionicScrollDelegate.scrollBottom(true);
                });
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
                    this.messages.push({message: message, from: this.$rootScope.userID, create_date: date.toISOString()});
                    console.info("Msg Success");
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

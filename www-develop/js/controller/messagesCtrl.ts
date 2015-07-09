module Controller {
    export class MessagesCtrl {

        messages = [];
        messagesIdCache;
        conversation:any = {};

        conversationId:string;
        opponentId:string;

        constructor(private MessengerService, private $rootScope, private $state, private SocketService, private $ionicScrollDelegate, private $ionicLoading) {
            this.conversationId = this.$state.params.conversationId;
            this.opponentId = this.$state.params.opponentId;

            this.getConversation(this.conversationId);
            this.getMessages(this.conversationId);
            this.registerSocketEvent();
        }


        // get messages of a single conversation
        getMessages(conversationId) {
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            return this.MessengerService.getMessages(conversationId)
                .then(result => {
                    this.$ionicLoading.hide();
                    this.messages = result.data;
                    this.$ionicScrollDelegate.scrollBottom(true);
                });
        }

        getConversation(conversationId) {
            return this.MessengerService.getConversationById(conversationId)
                .then(result => {
                    this.conversation = result.data;
                    if (!this.conversation[this.$rootScope.userID + '_read']
                        || (this.MessengerService.badgeStatusOf(conversationId) == false)) {
                        this.emitAck(this.$rootScope.userID, conversationId);
                        this.MessengerService.updateBadge(conversationId, true);
                    }


                    this.$ionicScrollDelegate.scrollBottom(true);
                });
        }

        emitAck(from, conversation_id) {
            console.log('send ack for received message', {
                from: this.$rootScope.userID,
                opponent: from,
                conversation_id: conversation_id
            });
            setTimeout(() => {
                this.SocketService.emit('message_ack', {
                    from: this.$rootScope.userID,
                    opponent: from,
                    conversation_id: conversation_id
                });
            }, 10);
            this.conversation[this.$rootScope.userID + '_read'] = true;
        }


        registerSocketEvent = () => {
            this.SocketService.offEvent('new_message');
            this.SocketService.onEvent('new_message', (newMessage) => {
                console.log('newMessage');
                if (this.conversationId === newMessage.conversation_id) {
                    this.messages.push(newMessage);
                    this.$rootScope.$emit('updateConversation', newMessage.conversation_id, newMessage.create_date, true);
                    this.$ionicScrollDelegate.scrollBottom(true);
                } else {
                    // if message not from current conversation
                    if (this.$state.current.name !== 'tab.messenger-messages'
                        || this.$state.params.userId !== newMessage.opponent) {
                        var read = this.MessengerService.badgeStatusOf(newMessage.conversation_id);
                        if (read) {
                            this.MessengerService.updateBadge(newMessage.conversation_id, false);
                            this.$rootScope.$emit('updateConversation', newMessage.conversation_id, newMessage.create_date, false);
                        }
                    }
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

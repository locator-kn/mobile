module Controller {
    export class MessengerCtrl {

        conversations;
        conversationsHash = {};

        constructor(private MessengerService, private UserService, private webPath, private $ionicLoading, private SocketService, private $state, private $rootScope) {
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            this.getConversations();
            this.registerSocketEvent();
        }

        // conversationlist
        getConversations() {
            this.MessengerService.getConversations()
                .then(result => {
                    this.conversations = result.data;
                    this.conversations.forEach(element => {
                        element.lastMessage = moment(new Date(element.modified_date)).startOf('minutes').fromNow();
                        this.conversationsHash[element._id] = element;
                        this.UserService.getUser(element['opponent'])
                            .then(result => {
                                element['opponent'] = result.data;
                            });
                    });
                    this.$ionicLoading.hide();
                });
        }

        registerSocketEvent = () => {
            this.SocketService.offEvent('new_message');
            this.SocketService.onEvent('new_message', (newMessage) => {
                if (this.$state.current.name !== 'tab.messenger-messages'
                    || this.$state.params.userId !== newMessage.opponent) {
                    if (!this.conversationsHash[newMessage.conversation_id].badge) {
                        this.$rootScope.badge += 1;
                        this.conversationsHash[newMessage.conversation_id].badge = true;
                    }
                }
            });
        };

        static controllerId:string = "MessengerCtrl";
    }
}

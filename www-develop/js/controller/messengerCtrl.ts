module Controller {
    export class MessengerCtrl {

        conversations;
        conversationsHash = {};

        constructor(private MessengerService, private UserService, private webPath, private $ionicLoading,
                    private SocketService, private $state, private $rootScope, maxSpinningDuration) {
            this.$ionicLoading.show({templateUrl: 'templates/static/loading.html', duration: maxSpinningDuration});
            this.getConversations();
            this.registerSocketEvent();

            $rootScope.$on("updateConversation", (event, conversationId, timestamp, messageStatus) => {
                if (timestamp) {
                    //this.conversationsHash[conversationId].lastMessage = this.getFormattedTimestamp(timestamp)
                    this.conversationsHash[conversationId].lastMessage = moment(new Date(timestamp)).startOf('minutes').fromNow();
                }
                this.conversationsHash[conversationId][this.$rootScope.userID + '_read'] = messageStatus;
            });

        }

        getFormattedTimestamp(timestamp) {
            var yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
            yesterday.setHours(0, 0, 0, 0);

            var formattedDate;
            if (timestamp) {
                var localdate = new Date(timestamp);
                if (moment(localdate).isBefore(yesterday)) {
                    var a = moment(localdate).day();
                    formattedDate = moment.weekdays(a);
                } else {
                    formattedDate = moment(localdate).format('HH:mm');
                }
            }
            return formattedDate;
        }

        updateConversationInfo = (conversationId)=> {
            return this.MessengerService.getConversationById(conversationId)
                .then(result => {
                    var element = result.data;
                    this.conversationsHash[conversationId] = element;

                });
        };

        // conversationlist
        getConversations() {
            this.MessengerService.getConversations()
                .then(result => {
                    this.conversations = result.data;
                    var badgeHash = {};
                    this.conversations.forEach(element => {
                        if (element.modified_date) {
                            //element.lastMessage = this.getFormattedTimestamp(element.modified_date);
                            element.lastMessage = moment(new Date(element.modified_date)).startOf('minutes').fromNow();

                        } else if (element.create_date) {
                            //element.lastMessage = this.getFormattedTimestamp(element.create_date);
                            element.lastMessage = moment(new Date(element.create_date)).startOf('minutes').fromNow();
                        }
                        this.conversationsHash[element._id] = element;
                        badgeHash[element._id] = this.conversationsHash[element._id][this.$rootScope.userID + '_read'];
                        this.UserService.getUser(element['opponent'])
                            .then(result => {
                                element['opponent'] = result.data;
                            });
                    });
                    this.MessengerService.setBadgeHash(badgeHash);
                    this.$ionicLoading.hide();
                });
        }

        registerSocketEvent = () => {
            this.SocketService.offEvent('new_message');
            this.SocketService.onEvent('new_message', (newMessage) => {
                // if message not from current conversation
                if (this.$state.current.name !== 'tab.messenger-messages'
                    || (this.$state.params.opponentId !== newMessage.from && this.$state.params.opponentId !== newMessage.to)) {
                    var read = this.MessengerService.badgeStatusOf(newMessage.conversation_id);
                    if (read) {
                        //this.conversationsHash[newMessage.conversation_id][this.$rootScope.userID + '_read'] = false;
                        this.MessengerService.updateBadge(newMessage.conversation_id, false);
                        this.$rootScope.$emit('updateConversation', newMessage.conversation_id, newMessage.create_date, false);
                    }
                }
            });
        };

        static controllerId:string = "MessengerCtrl";
    }
}

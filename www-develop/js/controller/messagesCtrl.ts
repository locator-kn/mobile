module Controller {
    export class MessagesCtrl {

        messages = [];
        messagesIdCache;
        conversation:any = {};

        conversationId:string;
        opponentId:string;

        page:number = -1;
        itemsProPage:number = 10;
        noMoreItemsAvailable:boolean;

        showEmojis:boolean;
        emojis = [":smile:", ":blush:", ":kissing_heart:", ":hear_no_evil:", ":speak_no_evil:", ":see_no_evil:"];
        textbox:any  = '';

        constructor(private MessengerService, private $rootScope, private $state, private SocketService,
                    private $ionicScrollDelegate, private $ionicLoading, private $scope, private $sce,
                    private $filter, private maxSpinningDuration) {
            this.conversationId = this.$state.params.conversationId;
            this.opponentId = this.$state.params.opponentId;

            this.getConversation(this.conversationId);
            this.loadMore();
            this.registerSocketEvent();
        }

        toTrusted(html_code) {
            return this.$sce.trustAsHtml(this.$filter('emoji')(html_code));
        }

        selectEmoji(item) {
            this.textbox = this.textbox + ' ' + item + ' ';
            this.showEmojis = false;
            angular.element('#my-message').focus();
        }


        // get messages of a single conversation
        getMessages(conversationId) {
            this.$ionicLoading.show({templateUrl: 'templates/static/loading.html', duration: this.maxSpinningDuration});
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
                        || (!this.MessengerService.badgeStatusOf(conversationId))) {
                        this.emitAck(this.$rootScope.userID, conversationId);
                        this.MessengerService.updateBadge(conversationId, true);
                        this.$rootScope.$emit('updateConversation', conversationId, null, true);
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

                    if (this.$state.current.name === 'tab.messenger-messages'
                        && this.$state.params.userId === newMessage.opponent) {
                        this.$rootScope.$emit('updateConversation', newMessage.conversation_id, newMessage.create_date, true);

                    } else {
                        this.$rootScope.$emit('updateConversation', newMessage.conversation_id, newMessage.create_date, false);
                    }
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

            this.MessengerService.sendMessage(message, this.conversationId, this.opponentId, this.$rootScope.userID)

                .then(result => {
                    var date = new Date();
                    this.$ionicScrollDelegate.scrollBottom(true);
                    this.MessengerService.clearMessageCacheById(this.conversationId);
                    this.textbox = '';
                    angular.element('#my-message').focus();
                })
                .catch(result => {
                    console.info("Error");
                });
            this.showEmojis = false;
        };

        loadMore = () => {
            this.page++;

            this.MessengerService.getNextMessagesFromConversation(this.conversationId, this.page, this.itemsProPage).then((result) => {
                // push to array
                debugger;
                var arrayLength = result.data.length;
                for (var i = 0; i < arrayLength; i++) {
                    this.messages.unshift(result.data[i]);
                    //Do something
                }
                if (arrayLength < this.itemsProPage) {
                    this.noMoreItemsAvailable = true;
                }
                this.$scope.$broadcast('scroll.refreshComplete');
                if (this.page === 0) {
                    this.$ionicScrollDelegate.scrollBottom(true);
                }
                this.$ionicLoading.hide();
            }).catch((err)=> {
                this.$ionicLoading.hide();
            });
        };

        static controllerId:string = "MessagesCtrl";
    }
}

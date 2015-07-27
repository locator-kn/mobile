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
        emojis = [":smile:", ":grin:", ":heart_eyes:", ":hushed:", ":weary:", ":sunglasses:", ":joy:", ":persevere:", ":cry:", ":innocent:", ":sob:", ":satisfied:", ":stuck_out_tongue_closed_eyes:", ":blush:", ":flushed:", ":expressionless:", ":rage:", ":kissing_heart:", ":hear_no_evil:", ":speak_no_evil:", ":see_no_evil:", ":clap:", ":wave:", ":hand:", ":ok_hand:", ":no_good:", ":information_desk_person:", ":person_with_pouting_face:", ":boom:", ":runner:", ":couple:", ":couplekiss:"];


        textbox:any = '';
        emptyConversation:boolean;

        constructor(private MessengerService, private $rootScope, private $state, private SocketService,
                    private $ionicScrollDelegate, private $ionicLoading, private $scope, private $sce,
                    private $filter, private maxSpinningDuration) {
            this.conversationId = this.$state.params.conversationId;
            this.opponentId = this.$state.params.opponentId;

            if (this.conversationId === '') {
                this.emptyConversation = true;
            } else {
                this.getConversation(this.conversationId);
                this.loadMore();
            }
            this.registerSocketEvent();
            this.$ionicScrollDelegate.scrollBottom(true);
        }

        toTrusted(html_code) {
            return this.$sce.trustAsHtml(this.$filter('emoji')(html_code));
        }

        selectEmoji(item) {
            this.textbox = this.textbox + ' ' + item + ' ';
            this.showEmojis = false;
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
                if (this.conversationId === newMessage.conversation_id) {
                    this.messages.push(newMessage);
                    if (this.$state.current.name === 'tab.messenger-messages'
                        && (this.$state.params.opponentId === newMessage.opponent || this.$rootScope.userID === newMessage.opponent)) {
                        this.$rootScope.$emit('updateConversation', newMessage.conversation_id, newMessage.create_date, true);
                        this.MessengerService.clearMessageCacheById(this.conversationId);
                    } else {
                        this.$rootScope.$emit('updateConversation', newMessage.conversation_id, newMessage.create_date, false);
                        this.MessengerService.updateBadge(newMessage.conversation_id, false);
                    }
                    this.$ionicScrollDelegate.scrollBottom(true);
                } else {
                    // if message not from current conversation
                    if (this.$state.current.name !== 'tab.messenger-messages'
                        || this.$state.params.opponentId !== newMessage.opponent) {
                        var read = this.MessengerService.badgeStatusOf(newMessage.conversation_id);
                        if (read) {
                            this.MessengerService.updateBadge(newMessage.conversation_id, false);
                            this.$rootScope.$emit('updateConversation', newMessage.conversation_id, newMessage.create_date, false);
                        }
                    }
                }
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
                    //angular.element('#my-message').focus();
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

        startConversation = (message) => {
            this.MessengerService.startConversation(this.opponentId, message).then((result) => {
                this.$state.go('tab.messenger-messages', {
                    conversationId: result.data.id,
                    opponentId: this.opponentId
                });
            }).catch((result) => {
                if (result.status === 409) {
                    var fromUser = this.$rootScope.userID;
                    var toUser;
                    if (result.data.data.user_1 === this.$rootScope.userID) {
                        toUser = result.data.data.user_2;
                    } else {
                        toUser = result.data.data.user_1;
                    }
                    this.MessengerService.sendMessage(message, result.data.data._id, toUser, fromUser).then(data => {
                        this.$state.go('tab.messenger-messages', {
                            conversationId: result.data.data._id,
                            opponentId: toUser
                        })
                    });
                } else {
                    // TODO: show error
                }
            });
        };

        static controllerId:string = "MessagesCtrl";
    }
}

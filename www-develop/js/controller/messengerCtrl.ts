module Controller {
    export class MessengerCtrl {

        conversations;
        conversationsHash = {};

        constructor(private MessengerService, private UserService, private webPath, private $ionicLoading) {
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            this.getConversations();
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

        static controllerId:string = "MessengerCtrl";
    }
}

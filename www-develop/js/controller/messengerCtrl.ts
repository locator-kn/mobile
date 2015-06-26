module Controller {
    export class MessengerCtrl {

        conversations;
        conversationsHash = {};


        constructor(private MessengerService, private UserService, private $state, private basePath, private SocketService) {
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
                });
        }

        static controllerId:string = "MessengerCtrl";
    }
}

module Controller {
    export class MessengerCtrl {

        conversations;
        conversationsHash = {};


        constructor(private MessengerService, private UserService, private $state, private basePath) {
            this.getConversations();

        }

        // conversationlist
        getConversations() {
            this.MessengerService.getConversations()
                .then(result => {
                    this.conversations = result.data;
                    this.conversations.forEach(element => {
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

module Controller {
    export class MessagesCtrl {

        messages = [];
        messagesIdCache;


        constructor(private MessengerService, private UserService, private $state, private $rootScope) {
            this.getConversation(this.$state.params.opponentId);
        }


        // one single conversation
        getConversation(conversationId) {
            return this.MessengerService.getConversation(conversationId)
                .then(result => {
                    this.messages = result.data;
                });
        }

        static controllerId:string = "MessagesCtrl";
    }
}

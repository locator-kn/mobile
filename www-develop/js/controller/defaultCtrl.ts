module Controller {
    export class DefaultCtrl {

        textMessage:string;

        constructor(private MessengerService) {}

        startConversation() {
            this.textMessage = '';
            this.MessengerService.startConversation(this.textMessage)

                .then(result => {
                    console.info("Started Conversation");
                    // TODO: state change?
                    //this.$state.go("messenger.opponent", {opponentId: result.data.id});
                })
                .error(result => {
                    console.info(result);
                    if (result.statusCode === 409) {
                        // TODO: state change?
                        //this.$state.go("messenger.opponent", {opponentId: result.data.id});
                    }
                });

        }

        static controllerId:string = "LoginCtrl";
    }
}

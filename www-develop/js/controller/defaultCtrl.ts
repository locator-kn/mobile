module Controller {
    export class DefaultCtrl {

        textMessage:string;

        constructor(private MessengerService) {
        }

        startConversation() {
            this.textMessage = '';
            this.MessengerService.startConversation(this.textMessage)

                .then(result => {
                    console.info("Started Conversation");
                    //this.$state.go("messenger.opponent", {opponentId: result.data.id});
                })
                .error(result => {
                    console.info("Oops");
                    console.info(result);

                    if (result.statusCode === 409) {
                        //this.$state.go("messenger.opponent", {opponentId: result.data.id});

                    }
                });

        }

        submitConversation() {

        }



        static controllerId:string = "LoginCtrl";
    }
}

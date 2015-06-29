module Controller {
    export class DefaultCtrl {

        message:string;
        errormsg:string;
        successmsg:string;

        constructor(private $rootScope, private MessengerService, private $ionicLoading) {
        }

        startConversation(form) {
            if (form.$invalid) {
                this.errormsg = "Bitte Nachricht eingeben";
                return;
            }


            this.MessengerService.startConversation(this.message).then((result) => {
                this.successmsg = 'Nachricht erfolgreich versendet';
                this.message = '';
            }).catch((result) => {
                if (result.status === 409) {
                    var fromUser = this.$rootScope.userID;
                    var toUser;
                    if (result.data.data.user_1 === this.$rootScope.userID) {
                        toUser = result.data.data.user_2;
                    } else {
                        toUser = result.data.data.user_1;
                    }
                    this.MessengerService.sendMessage(this.message, result.data.data._id, toUser, fromUser).then(result => {
                        this.successmsg = 'Nachricht erfolgreich versendet';
                        this.message = '';
                    });
                } else {
                    this.errormsg = 'Nachricht konnte nicht versendet werden';
                }
            });
        }

        closeModal() {
            this.$ionicLoading.hide();
        }

        static controllerId:string = "DefaultCtrl";
    }
}

module Service {
    export class UtilityService {


        constructor(private $ionicPopup) {

        }

        showPopup(content:string) {
            this.$ionicPopup.alert({
                title: content,
            });

        }

        showErrorPopup(content:string) {
            this.$ionicPopup.alert({
                title: content,
                cssClass: 'error'
            });
        }

        getConfirmPopup(title, textMsg, textNo, textYes) {
            return this.$ionicPopup.confirm({
                title: title,
                template: textMsg,
                buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                    text: textNo,
                    type: 'button-default',
                    onTap: function (e) {
                    }
                }, {
                    text: textYes,
                    type: 'button-positive',
                    onTap: function (e) {
                        // Returning a value will cause the promise to resolve with the given value.
                        return true;
                    }
                }]
            });
        }



        static serviceId:string = "UtilityService";
    }
}

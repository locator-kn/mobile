module Service {
    export class Utilityservice {


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


        static serviceId:string = "Utilityservice";
    }
}

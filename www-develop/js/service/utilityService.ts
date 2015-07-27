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


        static serviceId:string = "UtilityService";
    }
}

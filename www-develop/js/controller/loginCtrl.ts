module Controller {
    export class LoginCtrl {

        mail:string;
        password:string;

        constructor(private $ionicLoading) {
        }


        closeModal() {
            this.$ionicLoading.hide();
        }

        static
            controllerId:string = "LoginCtrl";
    }
}

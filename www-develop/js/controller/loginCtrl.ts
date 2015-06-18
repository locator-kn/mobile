module Controller {
    export class LoginCtrl {

        mail:string;
        password:string;

        constructor(private $ionicLoading) {
        }


        openLoginModal = () => {
            this.$ionicLoading.show({templateUrl: 'templates/login-modal.html'}, {
                animation: 'slide-in-up'
            })
        };

        closeLoginModal = ()=> {
            this.$ionicLoading.hide();
        };

        static
            controllerId:string = "LoginCtrl";
    }
}

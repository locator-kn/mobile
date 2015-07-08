module Controller {
    export class TabCtrl {

        constructor(private $rootScope, private $state, private UserService) {
            this.$rootScope.badge = 0;
        }


        openLoginModal() {
            this.UserService.openLoginModal();
        }

        openRegistrationModal() {
            this.UserService.openRegistrationModal();
        }

        showMyProfile = () => {
            this.$state.go('tab.profile', {
                userId: this.$rootScope.userID
            });
        };

        static
            controllerId:string = "TabCtrl";
    }
}

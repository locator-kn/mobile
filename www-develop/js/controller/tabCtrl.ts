module Controller {
    export class TabCtrl {

        constructor(private $rootScope, private $state, private UserService) {
        }


        openLoginModal() {
            this.UserService.openLoginModal();
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

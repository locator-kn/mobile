module Controller {
    export class ProfileCtrl {

        user:any = {};

        constructor(private $rootScope, private $state, private UserService, private $stateParams) {

            this.UserService.getMe($stateParams.profileId)
                .then(result => {
                    this.user = result.data;
                });

        }


        logout() {
            this.UserService.logout()
                .then(() => {
                    console.info("Logout Success");
                    this.$rootScope.authenticated = false;
                    this.$rootScope.userID = '';
                    this.$state.go('tab.welcome');
                }).catch(() => {
                    console.info("Logout Error");
                });
        }

        static
            controllerId:string = "ProfileCtrl";
    }
}

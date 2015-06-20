module Controller {
    export class UserCtrl {

        // user object
        user:any = {};

        // age of user
        birthdate:any;
        birthAvailable:boolean;

        constructor(private $rootScope, private $state, private UserService, private $stateParams, private $ionicPopup) {

            this.getUser($stateParams.userId);

        }


        getUser = (_id)  => {
            this.UserService.getUser(_id)
                .then(result => {
                    this.user = result.data;

                    // TODO: save local date string
                    this.user.birthdate = new Date(result.data.birthdate);

                    var ageDifMs = Date.now() - new Date(result.data.birthdate).getTime() + 86400000;
                    var ageDate = new Date(ageDifMs); // miliseconds from epoch
                    this.birthdate = Math.abs(ageDate.getUTCFullYear() - 1970);

                    if (isNaN(this.birthdate)) {
                        this.birthAvailable = false;
                    }
                });
        };

        logout = () => {
            this.UserService.logout()
                .then(() => {
                    console.info("Logout Success");
                    this.$rootScope.authenticated = false;
                    this.$rootScope.userID = '';
                    this.$state.go('tab.welcome');
                }).catch(() => {
                    console.info("Logout Error");
                });
        };

        updateSettings = () => {
            var alertPopup = this.$ionicPopup.alert({
                title: 'Noch nicht impelemntiert'
            });
            alertPopup.then(function (res) {
                // do nothing
            });
        };



        static
            controllerId:string = "UserCtrl";
    }
}

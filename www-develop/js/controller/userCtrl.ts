module Controller {
    export class UserCtrl {

        // user object
        user:any = {};
        me:boolean;
        edit:boolean;

        // age of user
        birthdate:any;
        birthAvailable:boolean;
        modifyBirthday;

        constructor(private $rootScope, private $state, private UserService, private $stateParams, private $ionicPopup, private $ionicLoading) {

            this.getUser($stateParams.userId);

            if (this.$rootScope.authenticated) {
                this.me = this.isItMe();
            }
        }

        isItMe() {
            return this.$rootScope.userID === this.$stateParams.userId;
        }

        getUser = (_id)  => {
            this.UserService.getUser(_id)
                .then(result => {
                    this.user = result.data;
                    // for edit user birthday input field value
                    this.modifyBirthday = result.data.birthdate.substr(0, 10);

                    this.user.birthdate = new Date(result.data.birthdate);
                    var ageDifMs = Date.now() - new Date(result.data.birthdate).getTime() + 86400000;
                    var ageDate = new Date(ageDifMs); // miliseconds from epoch
                    this.birthdate = Math.abs(ageDate.getUTCFullYear() - 1970);

                    if (isNaN(this.birthdate)) {
                        this.birthAvailable = false;
                    }

                    this.$ionicLoading.hide();

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

        editTrigger() {
            // if was in edit mode -> now to save
            if (this.edit) {
                // TODO
                this.$ionicPopup.alert({title: 'Noch nicht implementiert'});
            }
            this.edit = !this.edit;
        }

        updateSettings = () => {
            // TODO
            this.$ionicPopup.alert({title: 'Noch nicht implementiert'});
        };

        startConversation = () => {
            // TODO
            this.$ionicPopup.alert({title: 'Noch nicht implementiert'});
        };


        static controllerId:string = "UserCtrl";
    }
}

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

        // textarea
        descriptionRows:number = 3;
        //for description
        lettersPerLine = 35;

        newImagePath:string;
        // picture dimension
        width:number = 200;
        height:number = 200;

        path:string = 'http://locator-app.com/';

        constructor(private $rootScope, private $state, private UserService, private CameraService, private PictureUploadService,
                    private basePath, private $stateParams, private $ionicPopup, private $ionicLoading) {

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

                    this.user.birthdate = moment(new Date(this.user.birthdate)).format('L');

                    if (isNaN(this.birthdate)) {
                        this.birthAvailable = false;
                    }

                    // check if default not okay to display description
                    if (result.data.description.length > (this.descriptionRows * this.lettersPerLine)) {
                        this.descriptionRows = Math.round(result.data.description.length / 25);
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

        updateProfile() {

            if (!this.user.birthdate) {
                this.user.birthdate = '';
            }

            if (this.user.birthdate > new Date()) {
                this.$ionicPopup.alert({title: 'Datum muss in der Vergangenheit liegen!'});
                return;
            }

            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});

            this.UserService.updateProfile(this.user)
                .then(result => {
                    this.$ionicLoading.hide();
                    var alertPopup = this.$ionicPopup.alert({
                        title: 'Änderungen gespeichert!'
                    });
                    alertPopup.then((res) => {
                        this.editTrigger();
                    });
                })
                .catch(result => {
                    this.$ionicLoading.hide();
                    console.info(this.user);
                    this.$ionicPopup.alert({title: 'Fehler beim speichern!'});
                });
        }

        editTrigger() {
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

        updatePicture = ()=> {
            var opts = {
                height: this.height,
                width: this.width
            };
            this.CameraService.selectPicture(opts).then((result) => {
                this.newImagePath = result.src;
                this.uploadImage(result);
            })
        };

        uploadImage = (result) => {
            this.PictureUploadService.uploadImage(this.newImagePath, this.basePath + '/users/my/picture', result).then((data) => {
                // update profile picture
                this.UserService.getMe().then((user) => {
                    this.user = user;
                });
            }).catch((err) => {
                // TODO: show Error
            }).progress((process) => {
                // TODO implement processing
            });
        };



        static controllerId:string = "UserCtrl";
    }
}

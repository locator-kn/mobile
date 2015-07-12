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

        // password
        newPassword:string;
        newPasswordCheck:string;
        error:boolean;

        // textarea
        descriptionRows:number = 3;
        //for description
        lettersPerLine = 35;

        newImagePath:string;
        // picture dimension
        width:number = 200;
        height:number = 200;

        isUploading:boolean;
        uploadIsDone:boolean;

        errormsg:string;
        successmsg:string;

        constructor(private $rootScope, private $state, private UserService, private CameraService,
                    private PictureUploadService, private basePath, private $stateParams, private $ionicPopup,
                    private $ionicLoading, private webPath, private ngProgressLite, private maxSpinningDuration) {

            this.getUser($stateParams.userId);

            $rootScope.$on('userUpdate', () => {
                // clear profile cache
                this.UserService.clearMyProfileCache();
                // update profile picture
                this.UserService.getMe().then((user) => {
                    this.user = user.data;
                    if (user.data.birthdate) {
                        this.formatBirthdate(user);
                    }
                });
            });

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
                    if (result.data.birthdate) {
                        this.formatBirthdate(result);
                    }

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

        formatBirthdate = (result)=> {
            // for edit user birthday input field value
            this.modifyBirthday = result.data.birthdate.substr(0, 10);
            this.user.birthdate = new Date(result.data.birthdate);

            var ageDifMs = Date.now() - new Date(result.data.birthdate).getTime() + 86400000;
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            this.birthdate = Math.abs(ageDate.getUTCFullYear() - 1970);

            this.user.birthdate = moment(new Date(this.user.birthdate)).format('L');
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

        updateProfile = ()=> {

            if (this.user.birthdate) {
                if (this.user.birthdate > new Date()) {
                    this.$ionicPopup.alert({title: 'Datum muss in der Vergangenheit liegen!'});
                    return;
                }
                var date = new Date(this.user.birthdate);
                this.user.birthdate = date.toISOString();
            }
            this.$ionicLoading.show({templateUrl: 'templates/static/loading.html', duration: this.maxSpinningDuration});

            this.UserService.updateProfile(this.user)
                .then(result => {
                    this.$rootScope.$emit('userUpdate');
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
        };

        editTrigger() {
            this.edit = !this.edit;
        }

        updateSettings = () => {
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
            var formData = {
                width: Math.round(result.width),
                height: Math.round(result.height),
                xCoord: Math.round(result.x),
                yCoord: Math.round(result.y)
            };

            this.PictureUploadService.uploadImage(this.newImagePath, this.basePath + '/users/my/picture', formData).then((data) => {
                this.uploadIsDone = true;
                this.isUploading = false;
                this.ngProgressLite.done();

                var dataObject = JSON.parse(data.response);
                this.user.picture = dataObject.imageLocation;
                console.log('update user: ' + dataObject);
                // update user
                this.$rootScope.$emit('userUpdate');
            }, (err) => {
                console.log(err);
                this.$ionicLoading.hide();
                this.isUploading = false;
                this.ngProgressLite.done();
            }, (process) => {
                var perc:number = process.loaded / process.total;
                this.ngProgressLite.set(perc);
                console.log('progress:', perc, '% ');
            });

        };

        openConversationModal = () => {
            this.UserService.openConversationModal(this.user._id);
        };

        getFormattedDateof(date) {
            return moment(new Date(date)).format('L');
        }

        updatePassword() {
            if (!this.newPassword || !this.newPasswordCheck) {
                console.log('error - missing parameter');
                this.error = true;
                return;
            }

            if (this.newPassword != this.newPasswordCheck) {
                this.errormsg = 'Passwörter stimmen nicht überein.';
                return;
            } else if (this.newPassword.length == 0 || this.newPasswordCheck.length == 0) {
                this.editTrigger();
                this.errormsg = '';
                return;

            } else if (this.newPassword.length < 5) {
                this.errormsg = 'Passwort muss länger als 4 Zeichen sein.';
                return;
            }


            this.UserService.setNewPassword(this.newPassword)
                .then(result => {
                    console.info('updated password');
                    this.errormsg = '';
                    this.successmsg = 'Passwort erfolgreich geändert.';
                    this.newPassword = '';
                    this.newPasswordCheck = '';
                })
                .catch(result => {
                    this.errormsg = 'Fehler';
                    console.info('error');
                });
        }


        static controllerId:string = "UserCtrl";
    }
}

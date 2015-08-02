module Controller {
    declare var gapi:any;
    export class LoginCtrl {

        mail:string;
        password:string;
        name:string;

        forgotPassword:boolean = false;

        // no error if empty string
        errormsg:string = '';
        successmsg:string = '';

        constructor(private MessengerService, private $rootScope, private UserService, private $scope,
                    private $timeout, private $cordovaOauth, private facebookApiKey, private googleApiKey) {

        }

        closeLoginModal() {
            this.UserService.closeLoginModal();
        }

        login = (form) => {
            if (form.$invalid) {
                this.errormsg = "Bitte E-Mail und Benutzernamen angeben";
                return;
            }

            this.UserService.login(this.mail, this.password)

                .then(result => {
                    console.info("Login Success");
                    this.errormsg = '';

                    this.getMe();
                    this.$rootScope.authenticated = true;
                    this.closeLoginModal();

                }).catch(resp => {
                    if (resp.status === 401) {
                        this.errormsg = "Falsche E-Mail oder falsches Passwort angegeben";
                        return;
                    }
                    this.errormsg = "Oops, da lief etwas falsch";
                });
        };

        getMe() {
            this.UserService.getMe()

                .then(result => {
                    this.$rootScope.authenticated = true;
                    this.$rootScope.userID = result.data._id;
                    console.info(result.data._id);
                    this.$rootScope.$emit('login_success');
                    this.initBadge()
                }).catch(() => {
                    this.$rootScope.authenticated = false;
                });
        }

        // conversationlist
        initBadge() {
            this.MessengerService.getConversations()
                .then(result => {
                    var badgeHash = {};
                    result.data.forEach(element => {
                        badgeHash[element._id] = element[this.$rootScope.userID + '_read'];
                    });
                    this.MessengerService.setBadgeHash(badgeHash);
                });
        }

        sendNewPassword(mail, form) {
            this.errormsg = '';
            if (form.$invalid) {
                this.errormsg = "Bitte E-Mail angeben.";
                return;
            }

            this.UserService.sendNewPassword(mail)
                .then(() => {
                    console.info("Success");
                    this.successmsg = 'Email wurde an dich verschickt';


                    this.$timeout(() => {

                        this.successmsg = '';
                        this.forgotPassword = false;
                        // this.openLoginDialog();
                    }, 2000)

                }).catch(() => {
                    console.info("Error");
                    this.errormsg = "E-Mail wurde nicht gefunden";
                })
        }

        triggerforgotPassword() {
            this.errormsg = '';
            this.forgotPassword = true;
        }

        register(form) {
            if (form.$invalid) {
                this.errormsg = "Bitte fülle alle Felder aus";
                return;
            }

            this.UserService.register(this.name, this.mail, this.password)
                .then(result => {
                    console.info("Register Success");
                    this.getMe();

                    //close the dialog after success
                    this.closeLoginModal();

                })
                .catch(resp => {
                    if (resp.status === 409) {
                        this.errormsg = 'Diese Mail gibt es schon';
                        return;
                    }
                    console.info("Register Error");
                    console.info(resp);
                    this.errormsg = "Oops, da lief etwas falsch";
                });
        }


        loginFacebook() {
            this.$cordovaOauth.facebook(this.facebookApiKey, ['email']).then(
                (response:any) => {
                    this.closeLoginModal();
                    this.UserService.loginOAuth('facebook', response.access_token).then((userResponse) => {
                        console.log(userResponse.data);
                        this.getMe();
                    });
                }).catch((err)=> {
                    console.log(err);
                });
        }

        loginGoogle() {
            this.$cordovaOauth.google(this.googleApiKey, ['email']).then(
                (response:any) => {
                    this.closeLoginModal();
                    this.UserService.loginOAuth('google', response.access_token).then((userResponse) => {
                        console.log(userResponse.data);
                        this.getMe();
                    });
                }).catch((err)=> {
                    console.log(err);
                });
        }

        static controllerId:string = "LoginCtrl";
    }
}

module Controller {
    export class LoginCtrl {

        mail:string;
        password:string;
        name:string;

        forgotPassword:boolean = false;

        // no error if empty string
        errormsg:string = '';
        successmsg:string = '';

        constructor(private $rootScope, private UserService, private $timeout, private Facebook) {
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
                }).catch(() => {
                    this.$rootScope.authenticated = false;
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

        registerFacebook() {
            this.Facebook.login(function(response) {
                console.log(response);
            });
        }

        registerGoogle() {
            console.log('google');
        }



        static controllerId:string = "LoginCtrl";
    }
}

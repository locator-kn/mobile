module Controller {
    export class LoginCtrl {

        mail:string;
        password:string;


        forgotPassword:boolean = false;

        // no error if empty string
        errormsg:string = '';
        // success message
        successmsg:string = '';

        constructor(private $rootScope, private UserService, private $timeout) {
        }


        closeLoginModal() {
            this.UserService.closeLoginModal();
        }

        login = (form) => {
            if (form.$invalid) {
                this.errormsg = "Bitte E-Mail und Benutzernamen angeben.";
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
                        this.errormsg = "Falsche Mail oder falsches Passwort angegeben.";
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
                    this.errormsg = "Mail nicht gefunden";
                })
        }

        triggerforgotPassword() {
            debugger;
            this.errormsg = '';
            this.forgotPassword = true;
        }

        static controllerId:string = "LoginCtrl";
    }
}

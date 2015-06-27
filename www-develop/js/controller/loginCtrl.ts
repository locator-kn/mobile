module Controller {
    export class LoginCtrl {

        mail:string;
        password:string;

        // no error if empty string
        errormsg:string = '';
        // success message
        successmsg:string = '';

        constructor(private $rootScope, private UserService) {
        }


        closeLoginModal() {
            this.UserService.closeLoginModal();
        }

        login = (form) => {
            if (form.$invalid) {
                this.errormsg = "Bitte E-Mail und Benutzernamen eingeben.";
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

        static controllerId:string = "LoginCtrl";
    }
}

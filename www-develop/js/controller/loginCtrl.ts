module Controller {
    export class LoginCtrl {

        mail:string;
        password:string;
        errormsg:string;

        constructor(private $rootScope, private UserService) {

        }


        closeLoginModal() {
            this.UserService.closeLoginModal();
        }

        login(form) {
            if (form.$invalid) {
                return;
            }


            console.info('Login ' + this.mail);

            this.UserService.login(this.mail, this.password)

                .then(result => {
                    console.info("Login Success");
                    this.errormsg = '';

                    //this.getMe();
                    this.$rootScope.authenticated = true;
                    this.closeLoginModal();

                }).catch(resp => {
                    if (resp.status === 401) {
                        this.errormsg = "Falsche Mail oder falsches Passwort angegeben.";
                        return;
                    }
                    this.errormsg = "Oops, da lief etwas falsch";
                });
        }

        static
            controllerId:string = "LoginCtrl";
    }
}

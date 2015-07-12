module Controller {
    export class LoginCtrl {

        mail:string;
        password:string;
        name:string;

        forgotPassword:boolean = false;

        // no error if empty string
        errormsg:string = '';
        successmsg:string = '';

        constructor(private $rootScope, private UserService, private $scope, private $timeout) {
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


        //loginFacebook() {
        //    this.ngFB.login({scope: 'email,read_stream,publish_actions'}).then(
        //         response => {
        //            if (response.status === 'connected') {
        //                console.log('Facebook login succeeded');
        //                this.$scope.closeLogin();
                    //} else {
                    //    alert('Facebook login failed');
                    //}
                //});
        //}

        //loginGoogle() {
        //    var myParams = {
        //         Replace client id with yours
                //'clientid': '795291637713-qllq8c3nevves29ovicpu246be03m2t6.apps.googleusercontent.com',
                //'cookiepolicy': 'single_host_origin',
                //'callback': loginCallback,
                //'approvalprompt': 'force',
                //'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
            //};
            //gapi.auth.signIn(myParams);

            //function loginCallback(result) {
            //    if (result['status']['signed_in']) {
            //        console.log('Google login success!');
            //    }
            //}
        //}



        static controllerId:string = "LoginCtrl";
    }
}

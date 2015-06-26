module Controller {
    export class MainCtrl {


        user:any = {};

        constructor(private UserService, private $rootScope) {
            this.getMe();

        }


        getMe() {
            this.UserService.getMe()
                .then(result => {
                    this.user = result.data;
                    this.$rootScope.authenticated = true;
                    this.$rootScope.userID = result.data._id;
                    console.info(result.data._id);
                    this.$rootScope.$emit('login_success');
                    //this.getConversations()
                }).catch(() => {
                    this.$rootScope.authenticated = false;
                });
        }
        static controllerId:string = "MainCtrl";
    }
}

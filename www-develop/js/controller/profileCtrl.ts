module Controller {
    export class ProfileCtrl {

        user:any = {};

        constructor(private UserService, private $stateParams) {

            this.UserService.getMe($stateParams.profileId)
                .then(result => {
                    this.user = result.data;
                });

        }



        static
            controllerId:string = "ProfileCtrl";
    }
}

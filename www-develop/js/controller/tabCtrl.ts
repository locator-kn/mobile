module Controller {
    export class TabCtrl {

        constructor(private UserService) {
        }


        openLoginModal() {
            this.UserService.openLoginModal();
        }

        static
            controllerId:string = "TabCtrl";
    }
}

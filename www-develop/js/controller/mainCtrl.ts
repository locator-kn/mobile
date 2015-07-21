module Controller {
    export class MainCtrl {

        user:any = {};

        showBadge:boolean;
        socket:any;
        unreadMessages:number;

        constructor(private $rootScope, private UserService, private SocketService, private MessengerService) {

            this.$rootScope.$on('login_success', () => {
                this.registerWebsockets();
            });

            this.getMe();

        }

        registerWebsockets = () => {
            this.SocketService.onEvent('new_message', (newMessage) => {
                this.showBadge = true;
                this.unreadMessages += 1;
                console.log(newMessage);
            });
        };

        getMe = () => {
            this.UserService.getMe()
                .then(result => {
                    this.user = result.data;
                    this.$rootScope.authenticated = true;
                    this.$rootScope.userID = result.data._id;
                    console.info(result.data._id);
                    this.$rootScope.$emit('login_success');
                    this.initBadge()
                }).catch(() => {
                    this.$rootScope.authenticated = false;
                });
        };

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
        static controllerId:string = "MainCtrl";
    }
}

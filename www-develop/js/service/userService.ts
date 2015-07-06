module Service {
    export class UserService {

        usersIdCache;
        usersMeCache;

        conversationUserId;

        constructor(private $http, private $q, private basePath, private CacheFactory, private $ionicLoading, private $rootScope, private webPath) {
            this.usersIdCache = CacheFactory.createCache('usersId');
            this.usersMeCache = CacheFactory.createCache('usersMe');

        }

        getUser(_Id) {

            return this.$q((resolve, reject) => {

                this.$http.get(this.basePath + '/users/' + _Id, {cache: this.usersIdCache})
                    .then(data => {
                        if (data.data.birthdate === '') {
                            delete data.data.birthdate;
                        }
                        return this.decorateUserImage(data);
                    })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(err => {
                        reject(err);
                    });
            });

        }

        decorateUserImage = (data) => {
            return this.$q((resolve, reject) => {
                if (!data.data.picture) {
                    data.data.picture = './images/profile.png';
                } else {
                    data.data.picture = this.webPath + data.data.picture;
                }
                resolve(data);
            });
        };

        login(mail, password) {
            return this.$http.post(this.basePath + '/login',
                {
                    "mail": mail,
                    "password": password
                })
        }

        logout = () => {
            this.CacheFactory.clearAll();
            return this.$http.get(this.basePath + '/logout');
        };

        getMe() {
            return this.$q((resolve, reject) => {

                if (!this.usersIdCache) {
                    this.usersMeCache = this.CacheFactory.createCache('usersMe');
                }

                this.$http.get(this.basePath + '/users/me', {cache: this.usersIdCache})
                    .then(data => {
                        return this.decorateUserImage(data);
                    })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }

        updateProfile(newUserData) {
            return this.$http.put(this.basePath + '/users/my/profile',
                {
                    "name": newUserData.name,
                    "surname": newUserData.surname,
                    "description": newUserData.description,
                    "residence": newUserData.residence,
                    "birthdate": newUserData.birthdate
                })
        }

        register(name, mail, password) {
            this.usersIdCache.remove();
            this.usersMeCache.remove();

            return this.$http.post(this.basePath + '/users',
                {
                    "name": name,
                    "mail": mail,
                    "password": password
                }
            )
        }

        openLoginModal = () => {
            this.$ionicLoading.show({templateUrl: 'templates/modals/login-modal.html'}, {
                animation: 'slide-in-up'
            })
        };

        openConversationModal = (userId) => {
            if (this.$rootScope.authenticated) {
                this.conversationUserId = userId;
                this.$ionicLoading.show({templateUrl: 'templates/modals/start-conversation-modal.html'}, {
                    animation: 'slide-in-up'
                })
            } else {
                this.openLoginModal();
            }

        };

        openRegistrationModal = () => {
            this.$ionicLoading.hide();
            this.$ionicLoading.show({templateUrl: 'templates/modals/registration-modal.html'}, {
                animation: 'slide-in-up'
            })
        };

        closeLoginModal = ()=> {
            this.$ionicLoading.hide();
        };

        clearMyProfileCache() {
            this.usersMeCache.remove(this.basePath + '/users/my/profile');
        }

        sendNewPassword(mail) {
            return this.$http.get(this.basePath + '/forgot/' + mail);
        }

        getConversationUserId = () => {
            return this.conversationUserId;
        };

        static serviceId:string = "UserService";
    }
}

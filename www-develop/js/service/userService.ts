module Service {
    export class UserService {

        usersIdCache;
        usersMeCache;

        constructor(private $http, private $q, private basePath, private CacheFactory, private $ionicLoading) {
            this.usersIdCache = CacheFactory.createCache('usersId');
            this.usersMeCache = CacheFactory.createCache('usersMe');

        }

        getUser(_Id) {
            return this.$q((resolve, reject) => {

                this.$http.get(this.basePath + '/users/' + _Id, {cache: this.usersIdCache})
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

        decorateUserImage = (data) => {
            return this.$q((resolve, reject) => {
                if (!data.data.picture) {
                    data.data.picture = {
                        picture: '/images/profile.jpg',
                        thumbnail: '/images/profile.jpg'
                    }
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

        logout() {
            this.CacheFactory.clearAll();
            return this.$http.get(this.basePath + '/logout');
        }

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

        openLoginModal = () => {
            this.$ionicLoading.show({templateUrl: 'templates/login-modal.html'}, {
                animation: 'slide-in-up'
            })
        };

        closeLoginModal = ()=> {
            this.$ionicLoading.hide();
        };

        static serviceId:string = "UserService";
    }
}

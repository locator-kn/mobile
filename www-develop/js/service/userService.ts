module Service {
    export class UserService {

        usersIdCache;
        usersMeCache;

        constructor(private $http, private $q, private basePath, private CacheFactory, private $cordovaFileTransfer, private $ionicLoading) {
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

        uploadImage = (path)=> {
            // TODO: check if png or jpeg
            // TODO: grep picture
            // TODO: implement processing

            var options = {
                // IMPORTANT!!
                fileKey: "file",
                fileName: "image.png",
                chunkedMode: false,
                mimeType: "image/png",
                params: {
                    width: 500,
                    height: 500,
                    xCoord: 0,
                    yCoord: 0
                }
            };
            this.$cordovaFileTransfer.upload(this.basePath + '/users/my/picture', path, options).then(function (result) {
                console.log("SUCCESS: " + result.response);
            }, function (err) {
                console.log("ERROR: " + err);
            }, function (progress) {
                // constant progress updates
            });
        };

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

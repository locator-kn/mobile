module Service {
    export class UserService {

        usersIdCache;


        constructor( private $http, private $q, private basePath, private CacheFactory) {
            this.usersIdCache = CacheFactory.createCache('usersId');
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


        static serviceId:string = "UserService";
    }
}

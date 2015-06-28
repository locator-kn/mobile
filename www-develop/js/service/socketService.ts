module Service {
    declare
    var io;
    export class SocketService {

        socket = null;

        constructor(private $http, private $q, private $ionicPlatform, private basePathRealtime, private $rootScope, private socketFactory, private webPath) {
            this.socketInit();
        }

        getSocket = () => {
            return this.$q((resolve, reject) => {
                if (this.socket) {
                    resolve(this.socket);
                } else {
                    this.$http.get(this.basePathRealtime + '/connect/me')
                        .error(err => {
                            reject(err);
                        })
                        .then(response => {
                            this.$ionicPlatform.ready(()=> {
                                var myIoSocket = io.connect(this.webPath + response.data.namespace);
                                this.socket = this.socketFactory({ioSocket: myIoSocket});
                                resolve(this.socket);
                            });

                        });
                }
            });
        };

        emit = (event, data)=> {
            this.getSocket().then(socket => {
                socket.emit(event, data);
            });
        };

        onEvent = (event, fn) => {
            this.getSocket().then(socket => {
                socket.on(event, fn);
            })
        };

        offEvent = (event) => {
            this.getSocket().then(socket => {
                socket.removeListener(event);
            })
        };

        socketInit = ()  => {
            if (!this.$rootScope.authenticated) {
                return;
            }

            return this.$http.get(this.basePathRealtime + '/connect/me').then(response => {
                var myIoSocket = io(response.data.namespace);
                this.socket = this.socketFactory({ioSocket: myIoSocket});
            });

        };

        static serviceId:string = "SocketService";
    }
}

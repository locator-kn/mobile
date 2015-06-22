module Service {
    export class CameraService {


        constructor(private $q, private $ionicPopup, private $timeout, private $ionicActionSheet) {
        }


        getPicture(options) {
            var q = this.$q.defer();
            navigator.camera.getPicture((result) => {
                // Do any magic we need
                q.resolve(result);
            }, (err) => {
                q.reject(err)
            }, options);

            return q.promise;
        }

        static
            serviceId:string = "CameraService";
    }
}

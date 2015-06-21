module Service {
    export class CameraService {


        constructor(private $q) {
        }


        getPicture() {
            var q = this.$q.defer();
            navigator.camera.getPicture((result) => {
                // Do any magic we need
                q.resolve(result);
            }, (err) => {
                q.reject(err)
            });

            return q.promise;
        }

        static
            serviceId:string = "CameraService";
    }
}

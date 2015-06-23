module Service {
    export class PictureUploadService {

        constructor(private $http, private $q, private basePath, private CacheFactory, private $cordovaFileTransfer, private $ionicLoading) {
        }


        uploadImage = (filePath, destinationPath)=> {
            // TODO: check if png or jpeg
            // TODO: grep picture
            // TODO: implement processing
            var q = this.$q.defer();

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
            this.$cordovaFileTransfer.upload(destinationPath, filePath, options).then(function (result) {
                q.resolve(result);
                console.log("SUCCESS: " + result.response);
            }, function (err) {
                q.reject(err);
                console.log("ERROR: " + err);
            }, function (progress) {
                // TODO how?
                //q.notify(progress)
                // constant progress updates
            });
        };

        static serviceId:string = "PictureUploadService";
    }
}

module Service {
    export class PictureUploadService {

        constructor(private $http, private $q, private basePath, private CacheFactory, private $cordovaFileTransfer, private $ionicLoading) {
        }


        uploadImage = (filePath)=> {
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
            this.$cordovaFileTransfer.upload(this.basePath + '/users/my/picture', filePath, options).then(function (result) {
                console.log("SUCCESS: " + result.response);
            }, function (err) {
                console.log("ERROR: " + err);
            }, function (progress) {
                // constant progress updates
            });
        };

        static serviceId:string = "PictureUploadService";
    }
}

module Controller {
    export class GoogleMapCtrl {

        map:any = {};

        constructor() {
            this.map = {
                center: {
                    // kn fh
                    latitude: 47.668403,
                    longitude: 9.170499
                },
                zoom: 12,
                clickedMarker: {
                    id: 0,
                    latitude: null,
                    longitude: null
                },
                //events: this.getEvents()
            };
        }

        static controllerId:string = "GoogleMapCtrl";
    }
}

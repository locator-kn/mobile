module Controller {
    export class LocationOverviewCtrl {
        results:any;

        tripType = 'tab.search-result-locations';
        profileType = 'tab.profile-locations';

        state:string;
        locationSourceId:string;

        // ++++++++ TODO +++++++++++++++++
        // - location by user x
        // - location by my
        // - location by city
        // - location by trip
        // +++++++++++++++++++++++++++++++

        constructor(private $state, private $stateParams, private locationService) {
            this.state = this.$state.current.name;

            this.locationSourceId = $stateParams.locationSourceId;

            if(this.state === this.tripType) {
                // TODO call route to get all locations from trip
            } else if (this.state === this.profileType) {
                this.locationService.getLocationsByUser(this.locationSourceId).then((result) => {
                    this.results = result;
                })
            }


        }

        static controllerId:string = "LocationOverviewCtrl";
    }
}

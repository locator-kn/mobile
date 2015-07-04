module Controller {
    export class AccommodationEquipmentCtrl {

        availableAccommodationEquipment:any = [];
        selectedAccommodationEquipment:any = [];

        constructor(private DataService, private TripService, private $ionicLoading, private $state) {
            // get all eqipment from data service
            this.DataService.getAvailableAccommodationEquipment().then((result) => {
                this.$ionicLoading.hide();
                this.availableAccommodationEquipment = result.data;
            });
        }

        setAccommodationEquipment(equipment) {
            this.TripService.setAccommodationEquipment(equipment);
            this.$state.go('tab.offer');
        }

        static controllerId:string = "AccommodationEquipmentCtrl";
    }
}

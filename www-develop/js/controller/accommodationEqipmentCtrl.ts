module Controller {
    export class AccommodationEquipmentCtrl {

        availableAccommodationEquipment:any = [];
        selectedAccommodationEquipment:any = [];

        constructor(private DataService, private TripService, private $ionicLoading, private $state) {
            // get all eqipment from data service
            this.DataService.getAvailableAccommodationEquipment().then((result) => {
                this.$ionicLoading.hide();
                this.availableAccommodationEquipment = result.data;
                this.selectedAccommodationEquipment = this.TripService.getAccommodationEquipment();

                // initialisation of old selections
                for (var equipment in this.availableAccommodationEquipment) {
                    for (var selected in this.selectedAccommodationEquipment) {
                        if (this.availableAccommodationEquipment[equipment].query_name == this.selectedAccommodationEquipment[selected].query_name) {
                            this.availableAccommodationEquipment[equipment].checked = true;
                        }
                    }
                }
            });
        }

        sync = (bool, item) => {
            if (bool) {
                // add item
                this.selectedAccommodationEquipment.push(item);
            } else {
                // remove item
                for (var i = 0; i < this.selectedAccommodationEquipment.length; i++) {
                    // diff by query name because if checks hashKey
                    if (this.selectedAccommodationEquipment[i].query_name === item.query_name) {
                        this.selectedAccommodationEquipment.splice(i, 1);
                    }
                }
            }
            this.TripService.setAccommodationEquipment(this.selectedAccommodationEquipment);
        };

        setAccommodationEquipment() {
            this.TripService.setAccommodationEquipment(this.selectedAccommodationEquipment);
            this.$state.go('tab.offer');
        }

        static controllerId:string = "AccommodationEquipmentCtrl";
    }
}

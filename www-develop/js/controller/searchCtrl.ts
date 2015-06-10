module Controller {
    export class SearchCtrl {

        selectedDays:number = 1;
        availableDays:any = [];

        constructor(private $scope, private $rootScope, private $element, private $state) {
            this.availableDays = [
                {value: 1, title: "1"},
                {value: 2, title: "2"},
                {value: 3, title: "3"},
                {value: 4, title: "3+"},
            ];
        }

        static controllerId:string = "SearchCtrl";
    }
}

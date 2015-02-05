// Solution for elevator saga
{
    init: function (elevators, floors) {
        var floors_requested = [];

        elevators.forEach(function (elevator) {
            elevator.on("idle", function() {
                if (floors_requested.length > 0) {
                    elevator.goToFloor(floors_requested.shift());
                } else {
                    elevator.goToFloor(0);
                }
            });

            elevator.on("stopped_at_floor", function(floorNum) {

            });

            elevator.on("floor_button_pressed", function(floorNum) {
                elevator.destinationQueue.push(floorNum);
            });
        });

        floors.forEach(function (floor) {
            floor.on("up_button_pressed", function() {
                floors_requested.push(floor.floorNum());
            });
            floor.on("down_button_pressed", function() {
                floors_requested.push(floor.floorNum());
            });
        });
    },
    update: function(dt, elevators, floors) {}
}

// Solution for elevator saga
{
    init: function (elevators, floors) {
        var floors_requested = [];

        var goToFloorWithIndicator = function (elevator, floor) {
            current = elevator.currentFloor();
            if (floor >= current) {
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(false);
            } else {
                elevator.goingDownIndicator(true);
                elevator.goingUpIndicator(false);
            }
            elevator.goToFloor(floor);
        };

        elevators.forEach(function (elevator) {
            elevator.on("idle", function() {
                goToFloorWithIndicator(elevator, 0);
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                if (floors_requested.length > 0) {
                    goToFloorWithIndicator(elevator, floors_requested.shift());
                } else {
                    goToFloorWithIndicator(elevator, 0);
                }
            });

            elevator.on("floor_button_pressed", function(floorNum) {
                goToFloorWithIndicator(elevator, floorNum);
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

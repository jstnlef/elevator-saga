// Solution for elevator saga
{
    init: function (elevators, floors) {
        var direction = {
            UP: "up",
            DOWN: "down",
            NONE: "none",
            BOTH: "both"
        };
        Object.freeze(direction);

        var upFloors = [];
        var downFloors = [];

        elevators.forEach(function (elevator) {

            elevator.setIndicator = function (dir) {
                if (dir === direction.UP) {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                } else if (dir === direction.DOWN) {
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(true);
                } else if (dir === direction.BOTH){
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(true);
                } else {
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(false);
                }

            };

            elevator.goToFloorWithIndicator = function (floor) {
                current = elevator.currentFloor();
                if (floor >= current) {
                    elevator.setIndicator(direction.UP);
                } else {
                    elevator.setIndicator(direction.DOWN);
                }
                elevator.goToFloor(floor);
            };

            elevator.on("idle", function() {

            });

            elevator.on("stopped_at_floor", function(floorNum) {
                console.log("Destination queue: " + elevator.destinationQueue);
                console.log("upFloors queue: " + upFloors);
                console.log("downFloors queue: " + downFloors);
                if (upFloors.length > 0) {
                    elevator.goToFloorWithIndicator(upFloors.shift());
                } else if (downFloors.length > 0){
                    elevator.goToFloorWithIndicator(downFloors.shift());
                } else {
                    elevator.goToFloorWithIndicator(0);
                }
            });

            elevator.on("floor_button_pressed", function(floorNum) {
                elevator.goToFloorWithIndicator(floorNum);
            });
        });

        floors.forEach(function (floor) {
            floor.on("up_button_pressed", function() {
                upFloors.push(floor.floorNum());
            });
            floor.on("down_button_pressed", function() {
                downFloors.push(floor.floorNum());
            });
        });
    },
    update: function(dt, elevators, floors) {}
}

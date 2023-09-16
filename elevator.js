{
    init: function (elevators, floors) {
        var floorState = Array(floors.length).fill(0);

        var addFloorRequest = function (dir, floorNum) {
            var x = 0;
            switch (dir) {
                case "up":
                    x = 1;
                    break;
                case "down":
                    x = 2;
                    break;
                default:
                    break;
            }
            floorState[floorNum] |= x;
            console.log("floorState: " + JSON.stringify(floorState));
        }

        var removeFloorRequest = function (dir, floorNum) {
            var x = 0;
            switch (dir) {
                case "up":
                    x = 2;
                    break;
                case "down":
                    x = 1;
                    break;
                default:
                    break;
            }
            floorState[floorNum] &= x;
            console.log("floorState: " + JSON.stringify(floorState));
        }

        elevators.forEach(function (elevator, index) {
            elevator.id = index;

            elevator.setIndicator = function (dir) {
                var up = elevator.goingUpIndicator();
                var down = elevator.goingDownIndicator();
                switch (dir) {
                    case "up":
                        up = true;
                        down = false;
                        break;
                    case "down":
                        up = false;
                        down = true;
                        break;
                    case "idle":
                        up = false;
                        down = false;
                    default:
                        break;

                }
                elevator.goingUpIndicator(up);
                elevator.goingDownIndicator(down);
            }

            elevator.on("idle", function () {
                console.log("Elevator " + elevator.id + " : idle");
                console.log("Pressed Floors: " + JSON.stringify(elevator.getPressedFloors()));
                var pressedFloors = elevator.getPressedFloors();
                if (pressedFloors.length > 0) {
                    elevator.goToFloor(pressedFloors[0]);
                }
            });

            elevator.on("floor_button_pressed", function (floorNum) {
                console.log("Elevator " + elevator.id + " floor_button_pressed: " + floorNum);
            });

            elevator.on("passing_floor", function (floorNum, direction) {
                console.log("Elevator " + elevator.id + " passing_floor: " + floorNum + " " + direction);
            });

            elevator.on("stopped_at_floor", function (floorNum) {
                console.log("Elevator " + elevator.id + " stopped_at_floor: " + floorNum);
                if (elevator.goingUpIndicator) {
                    removeFloorRequest("up", floorNum);
                }
                if (elevator.goingDownIndicator) {
                    removeFloorRequest("down", floorNum);
                }
            });
        });

        floors.forEach(function (floor) {
            floor.on("up_button_pressed", function () {
                addFloorRequest("up", floor.floorNum());
            });
            floor.on("down_button_pressed", function () {
                addFloorRequest("down", floor.floorNum());
            });
        });
    },
    update: function(dt, elevators, floors) { }
}

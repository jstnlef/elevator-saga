// Solution for elevator saga
{
    init: function (elevators, floors) {
        var direction = {
            UP: "up",
            DOWN: "down",
        };
        Object.freeze(direction);

        var elevatorState = {
            GOING_UP: "goingUp",
            GOING_DOWN: "goingDown",
            IDLE: "idle"
        };
        Object.freeze(elevatorState);

        // TODO: Implement a sortedSet. For now I'll just make sure to call _.uniq and sort()
        var upFloors = [];
        var downFloors = [];

        var updateFloorButtonState = function (dir, floorNum){
            if (dir === direction.UP){
                upFloors.push(floorNum);
                upFloors = _.uniq(upFloors);
                upFloors.sort();
            } else if (dir === direction.DOWN){
                downFloors.push(floorNum)
                downFloors = _.uniq(downFloors);
                downFloors.sort();
                downFloors.reverse();
            }
        }

        var distanceTo = function (from, to) {
            return Math.abs(from - to);
        }

        elevators.forEach(function (elevator, index) {
            elevator.state = elevatorState.IDLE;
            elevator.id = index;

            elevator.setState = function (state) {
                console.log("Setting elevator " + elevator.id + " state: " + state);
                if (state === elevatorState.GOING_UP) {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                    elevator.state = elevatorState.GOING_UP;
                } else if (state === elevatorState.GOING_DOWN) {
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(true);
                    elevator.state = elevatorState.GOING_DOWN;
                } else {
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(false);
                    elevator.state = elevatorState.IDLE;
                }

            };

            elevator.prioritizeDestinationQueue = function () {
                elevator.destinationQueue = _.uniq(elevator.destinationQueue);
                elevator.destinationQueue.sort();
                if (elevator.state == elevatorState.GOING_DOWN){
                    elevator.destinationQueue.reverse();
                }
                elevator.checkDestinationQueue();
            };

            elevator.pushToQueue = function (floorNum) {
                elevator.destinationQueue.push(floorNum);
                elevator.prioritizeDestinationQueue();
            };

            elevator.on("idle", function() {
                var currentFloor = elevator.currentFloor();
                var upFloor = upFloors[0];
                var downFloor = downFloors[0];
                if (upFloor !== undefined && downFloor === undefined) {
                    elevator.setState(elevatorState.GOING_UP);
                    elevator.goToFloor(upFloor);
                } else if (upFloor === undefined && downFloor !== undefined) {
                    elevator.setState(elevatorState.GOING_DOWN);
                    elevator.goToFloor(downFloor);
                } else if (upFloor !== undefined && downFloor !== undefined) {
                    if (distanceTo(currentFloor, upFloor) >= distanceTo(currentFloor, downFloor)) {
                        elevator.setState(elevatorState.GOING_DOWN);
                        elevator.goToFloor(downFloor);
                    } else {
                        elevator.setState(elevatorState.GOING_UP);
                        elevator.goToFloor(upFloor);
                    }
                } else {
                    elevator.setState(elevatorState.IDLE);
                    elevator.goToFloor(currentFloor);
                }
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                console.log('Event: stopped_at_floor');
                console.log("upFloors queue: " + upFloors);
                console.log("downFloors queue: " + downFloors);
                console.log("Elevator " + elevator.id + " destination queue: " + elevator.destinationQueue);
                console.log("Elevator " + elevator.id + " state: " + elevator.state);

                var currentFloor = elevator.currentFloor();
                var upIndex = upFloors.indexOf(currentFloor);
                if (upIndex > -1) {
                    upFloors.splice(upIndex, 1);
                    elevator.setState(elevatorState.GOING_UP);
                    return
                }

                var downIndex = downFloors.indexOf(currentFloor);
                if (downIndex > -1) {
                    downFloors.splice(downIndex, 1);
                    elevator.setState(elevatorState.GOING_DOWN);
                    return
                }
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                console.log('Event: passing_floor ' + floorNum + " " + direction);
            });

            elevator.on("floor_button_pressed", function(floorNum) {
                elevator.pushToQueue(floorNum);
            });
        });

        floors.forEach(function (floor) {
            floor.on("up_button_pressed", function() {
                updateFloorButtonState(direction.UP, floor.floorNum());
            });
            floor.on("down_button_pressed", function() {
                updateFloorButtonState(direction.DOWN, floor.floorNum());
            });
        });
    },
    update: function(dt, elevators, floors) {}
}

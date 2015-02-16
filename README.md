# Elevator Saga Solution

Currently wins up to level 13 fairly consistently, though it has more issues with the challenges
which require minimizing the amount of moves or the maximum wait time.

Will regularly win level 17 however, with around the following stats:
```
Transported/s: 1.41
Avg Waiting Time: 17.1s
Max Waiting Time: 42.9s
Moves: 405
```

## Areas for improvement
* Code definitely needs some refactoring/cleaning up.
* Currently there's a bug around the shared state of the up and down queues where it can "lose" a pressed button. Need to track that down.
* It might make sense to have bit more knowledge of where the other elevators are to make smarter decisions of which floor to go next. 

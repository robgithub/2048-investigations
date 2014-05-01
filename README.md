2048-investigations
===================

2048 game strategies in JavaScript

You can read more about 2048 on wikipedia http://en.wikipedia.org/wiki/2048_%28video_game%29

This project was the product of a thought process that got out of hand and was supposed to have a life time of 1hr max.

This game is NOT INTERACTIVE, the games are played by the computer. It should be trivial to add user interaction, but that was never the goal of the project.

Currently there are seven strategies

"Score: Cumulative": Tries each direction Up, Down, Left, Right and adds the values of each tile together with the number of moves and then times that with the number combinations that were made. This is the *best* strategy and will often result in a "512" tile.

"Score: Moves": Same as "Score: Cumulative" but has no weighting on the number of combinations, instead number of moves is what is rewarded. I had this strategy in version one for most of the time, until I realised that combinations should be rewarded high than number of moves.

"Score: Combinations": Similar to the "Score: Moves" except it ignores number of moves completely and rewards number of combinations.

"Score: Tile Total": Ignores all the weighting of combinations and moves and just counts the resulting total of all the tile values added together.

"Random": Simply plays a random direction each turn and does surprisingly badly. Nearly always getting "64".

"Sequence: Clockwise": Ignores any scores or weighting, just uses "Up", followed by "Right", "Down", "Left" repeatedly. Plays "dumb", usually gets much higher that "Random".

"Sequence: Counter-clockwise": As with "Sequence: Clockwise" but uses the sequence "Up", "Left", "Down", "Right". Again, does better than "Random".

Note this is not a serious investigation, no data is logged it all just a bt of fun.

To use include a link to JQuery 1(1.9.1 & 1.11.0 have been tested) and the Game.js, you can also include the Strategy.js.
Examples are in the examples folder.

Instanciating a Strategy can be done with

```js
var myStrategy = new Strategy('rotateccw', 'Sequence: Counter-clockwise', 'rotateCCW', 5));
myStategy.init();
```
where 'rotateccw' is the id of the div you want to use, 'Sequence: Counter-clockwise' is the text to appear before the game, 'rotateCCW' is the strategy, see below for list and 5 is the number of games for a "run". 
Instanciating a Game can be done with
 
```js
var myGame = new Game($('#game'), 'rotateCCW');
myGame.next();
```
Where $('#game') is a jquery selector for the id "game" and 'rotateCCW' is the strategy, see below for list

'cumul' (Score: Cumulative)
'moves' (Score: Moves)
'combinations' (Score: Combinations)
'total' (Score: Tile Total)
'random' (Random)
'rotateCW' (Sequence: Clockwise)
'rotateCCW' (Sequence: Counter-clockwise)

It is all MIT licenced so go nuts.

A pre-release version (all js in one file) and some additional notes can be viewed in this blog post http://www.jumpstation.co.uk/flog/Apr2014.html#270420141437


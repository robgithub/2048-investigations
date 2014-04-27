// 2048 Investigations
// 2014/04 rob_on_earth
// 
// this file contains the Game object
// https://github.com/robgithub/2048-investigations
/*

The MIT License (MIT)
[OSI Approved License]

The MIT License (MIT)

Copyright (c) 2014 "Rob Davis", "rob_on_earth"

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

function Game(element, strategyType) {
    var game = this; // context 
    game.element = element;
    game.state = [];
    game.lastDirection = '';
    game.status = 'NOT STARTED';
    game.highestTile = 0;
    game.numberOfMoves = 0;
    game.debug=false;
    game.strategyType = strategyType;
    game.rotateDirection='L';
    
    game.move = function(board) {
        var newBoard = game.clone(board);
        var moved = game.shift(newBoard);
        var combination = game.combine(moved.board);
        var moved2 = game.shift(combination.board);
        return {'board':moved2.board, 'combinations':combination.combinations, 'moves':moved.moves+moved2.moves};
    };

    game.test = function() {
        var board = [1,1,1,1,
                     0,1,1,1,
                     0,0,1,1,
                     1,0,0,1];
        board = game.move(board).combinations;
        game.updateDisplay(board);
    };

    // needs to return number of combinations
    game.combine = function(board) {
        var newBoard = game.clone(board);
        var combinations =0;
        for (var y=0; y<4; y++) {
            for (var x=1; x<4; x++) { // never trying to combine the first element
                var i = (y*4)+x;
                if (newBoard[i]!==0 && (newBoard[i-1]===newBoard[i])) {
                    newBoard[i-1] = newBoard[i]*2;
                    newBoard[i]=0;
                    combinations++;
                }
            }
        }
        return {'board':newBoard, 'combinations':combinations};
    };
    
    
    // always moving left, board is pre-rotated
    game.shift = function(board) {
        var newBoard = game.clone(board);
        var moves=0;
        // move first
        for (var y=0; y<4; y++) {
            var begining = y*4; // index of the begining of the line to work on
            for (var x=1; x<4; x++) { // never moving the first element
                var i = (y*4)+x;
                if (newBoard[i]!==0) {
                    var target = i-1;
                    var index = i;
                    while (target>=begining && (newBoard[target]===0) )
                    {
                        newBoard[target] = newBoard[index];
                        newBoard[index] = 0;
                        index--;
                        target--;
                        moves++;
                    }
                }
            }
        }
        return {'board':newBoard, 'moves':moves};
    };
    
    
    game.findMove = function() {
        var directions = ['L','R','U','D'];
        // order random
        directions = game.randomOrder(directions);
        if (game.strategyType==='rotateCW') {
            switch(game.rotateDirection){
                case 'U': directions[0]='R';
                break;
                case 'D': directions[0]='L';
                break;
                case 'R': directions[0]='D';
                break;
                case 'L': directions[0]='U';
                break;
            }
            game.rotateDirection=directions[0];
        }
        if (game.strategyType==='rotateCCW') {
            switch(game.rotateDirection){
                case 'U': directions[0]='L';
                break;
                case 'D': directions[0]='R';
                break;
                case 'R': directions[0]='U';
                break;
                case 'L': directions[0]='D';
                break;
            }
            game.rotateDirection=directions[0];
        }
        // store all attempts
        var attempts = [];
        var highest = -1;
        var winner = -1;
        for (var i = 0;i<4;i++) {
            attempts.push(game.buildMove(directions[i]));
            var score = game.calculateScore(attempts[i]);
            if (score>highest) {
                winner = i;
                highest=score;
            }
        }
        // which has the first highest score
        if (this.debug) console.log('and the winner is attempt ' + winner);
        // set state
        switch(game.strategyType) {
            case 'rotateCW': // direction is overridden before attempts are made
            case 'rotateCCW':
            case 'random': // as the order is random zero index is perfect
                game.state = attempts[0].board;
                game.lastDirection = directions[0];  
                break;
            default: // all the score based strategyTypes
                game.state = attempts[winner].board;
                game.lastDirection = directions[winner];                
                break;
        }        
    };

    game.buildMove = function(dir) {
        if (this.debug) console.log('Building for '+dir);
        var newBoard =game.clone(game.state);
        game.dumpBoard(newBoard,'clone');
        // rotate for dir
        newBoard = game.rotate(dir, newBoard);
        game.dumpBoard(newBoard,'rotated '+dir);
        // do move
        var combination = game.move(newBoard);
        newBoard = combination.board;
        game.dumpBoard(newBoard,'moved');
        // rotate reverse
        var revDir = ''
        switch(dir) {
            case 'U': revDir='U';
                break;
            case 'D': revDir='DR'; // down and reverse
                break;
            case 'R': revDir='R'; // reverse
                break;
            case 'L': revDir='L'; // do nothing 
                break;
        }
        newBoard = game.rotate(revDir, newBoard);
        game.dumpBoard(newBoard, 'rotated again '+revDir);
        return {'board':newBoard, 'combinations':combination.combinations, 'moves':combination.moves};    };


    
    game.rotate = function(dir, board) {
        var newBoard = game.clone(board);
        //debugger;
        switch(dir) {
            case 'L':
                newBoard = board;
                break;
            case 'R':
                for (var y = 0; y<4; y++) {
                    for (var x = 0; x<4; x++) {
                        newBoard[(y*4)+x] = board[(y*4)+(3-x)];
                    }
                }
                break;
            case 'U':
                for (var y = 0; y<4; y++) {
                    for (var x = 0; x<4; x++) {
                        newBoard[(x*4)+y] = board[(y*4)+x];
                    }
                }
                break;
            case 'D':
                for (var y = 0; y<4; y++) {
                    for (var x = 0; x<4; x++) {
                        newBoard[(x*4)+y] = board[(y*4)+x];
                    }
                }
                var anotherBoard = game.clone(newBoard);
                for (var y = 0; y<4; y++) {
                    for (var x = 0; x<4; x++) {
                        newBoard[(y*4)+x] = anotherBoard[(y*4)+(3-x)];
                    }
                }
                break;
            case 'DR':
                anotherBoard = game.rotate('D', board);
                for(var i=0;i<16;i++) {
                    newBoard[i] = anotherBoard[15-i];
                }
                break;
        }
        return newBoard;
    };
    
    game.calculateScore = function(attempt) {
        var board = attempt.board;
        var total = 0;
        for (var i = 0;i<16;i++){
            total+=board[i];
        }
        switch(game.strategyType) {
            case 'total':
                return (total);
                break;
            case 'combinations':
                return total*attempt.combinations;
                break;
            case 'moves':
                return total*attempt.moves;
                break;
            default: // cumul
                return (total+attempt.moves)*attempt.combinations;
                break;
        }
        
    };
    
    game.randomOrder = function(data) {
        var random = [];
        var remaining = data.length;
        while (random.length<remaining) {
            var index = Math.floor(game.getRandom()*data.length);
            random.push(data[index]);
            data.splice(index, 1);
        }
        return random;
    };
    
    game.start= function() {
        game.state = [];
        for (var i=0;i<16;i++) {
           game.state.push(0);
        }
        game.numberOfMoves=0;
        game.highestTile =0;
    };

    game.clone=function(oldBoard) {
        var newBoard = [];
        for (var i=0;i<16;i++) {
           newBoard.push(oldBoard[i]);
        }
        return newBoard;
    };
    
    game.randomTile = function() {
        // new tile is randomly 4 one in ten times else 2
        var tileValue = (Math.floor(game.getRandom()*10) === 9) ? 4 : 2;
        // find a random empty location
        // get all empty locations
        var emptys = [];
        for (var i=0;i<16;i++) {
            if (game.state[i] === 0) {
                emptys.push(i);
            }
        }
        if (emptys.length<1) {
            game.status='GAME OVER';
        }
        game.state[emptys[(Math.floor(game.getRandom()*emptys.length))]]=tileValue;
    };
    
    game.next = function() {
        if (game.status==='NOT STARTED') {
            game.start();
            game.dumpBoard(game.state, 'start');
            game.status='IN PLAY';
            game.randomTile();
            game.dumpBoard(game.state, 'two random tiles');
            game.randomTile();
            game.updateDisplay(game.state);
            return true; // see the initial setup
        }
        if (game.status==='GAME OVER') {
            game.status='NOT STARTED';
            return false;
        }
        game.numberOfMoves++;
        game.findMove();
        game.highestTile = game.highest(game.state);
        if (game.status==='IN PLAY') {
            game.randomTile();
            game.dumpBoard(game.state, 'play random tile');
        }
        game.updateDisplay(game.state);
        return true;
    };

    game.highest=function(board) {
        var high=0;
        for (var i=0;i<16;i++) {
            if (board[i]>high) {
                high = board[i];
            }
        }
        return high;
    };
    
    game.updateDisplay=function(board) {
        game.dumpBoard(game.state, 'game.state');
        if (this.debug) console.log('DIR:'+game.lastDirection);
        if (element.html()===''){
            game.buildDisplay(element);
        }
        for (var i=0;i<16;i++) {
            game.updateCell(element.find('td.i'+i), board[i]);
        }
        element.find('.itteration').text(game.numberOfMoves);
        element.find('.highest').text(game.highestTile);
        element.find('.dir').css('background-color','yellow');
        var cssclass = '';
        switch(game.lastDirection) {
            case 'U': cssclass='up';
                break;
            case 'D': cssclass='down'; 
                break;
            case 'R': cssclass='right'; 
                break;
            case 'L': cssclass='left';  
                break;
        }
        if (cssclass!=='') {
            element.find('.dir.'+cssclass).css('background-color','red');
        }
    };
    
    game.updateCell=function(element, value) {
        element.text(value);
        var colour='#000';
        switch(value) {
            case 2:
                colour = '#333';
                break;
            case 4:
                colour = '#666';
                break;
            case 8:
                colour = '#999';
                break;
            case 16:
                colour = '#ccc';
                break;
            case 32:
                colour = '#fff';
                break;
            case 64:
                colour = '#f9c';
                break;
            case 128:
                colour = '#fcc';
                break;
            case 256:
                colour = '#ffc';
                break;
            case 512:
                colour = '#fc9';
                break;
            case 1024:
                colour = '#fcc';
                break;
            case 2048:
                colour = '#fcf';
                break;
        }
        element.css('background-color',colour);
    };
    
    game.buildDisplay=function(element) {
        var table = '';
        table += '<table style="float:left;10em;width:14em;height:14em;">';
        for (var y=0;y<4;y++) {
            table += '    <tr>';
            for (var x=0;x<4;x++) {
                var i = (y*4)+x; 
                table += '<td class="i'+i+'" style="height:3em;text-align:center;    width:3em;" >';
                table += '-';
                table += '</td>';
            }
            table += '    </tr>';
        }
        table += '</table>';
        var display = '';
        display += '<div class="dir up" style="background-color:black;width:16em;height:1em;"></div>';
        display += '<div class="dir left" style="background-color:red;width:1em;height:14em;float:left;"></div>';
        display +=table;
        display += '<div class="dir right" style="background-color:green;width:1em;height:14em;float:left;"></div>';
        display += '<div class="dir down" style="background-color:blue;width:16em;height:1em;clear:both;"></div>';
        display += '<div class="information">Itteration:<span class="itteration"></span> highest:<span class="highest"></span></div>';
        element.html(display);
    };
    
    game.dumpBoard=function(board, message) {
        if (this.debug) {
            console.log('Dumping board:'+message);
            for (var i=0; i<16;i+=4) {
    console.log(i+'['+board[i]+','+board[i+1]+','+board[i+2]+','+board[i+3]+']');
            }
        }
    };
    
    // return random value between 0 and 1.0
    game.getRandom = function() {
        return Math.random();
    };
    
    
} // end of game class

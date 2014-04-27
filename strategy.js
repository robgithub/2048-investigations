// 2048 Investigations
// 2014/04 rob_on_earth
// 
// this file contains the Strategy object 
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

function Strategy(elementId, label, strategyType, maxGames) {
    var strategy = this; // context 
    strategy.element = $('#'+elementId);
    strategy.pause=false;
    strategy.highestEver = 0;
    strategy.longestEver = 0;
    strategy.totalGames = 0;
    strategy.maxGames = maxGames;
    strategy.currentGame = 0;
    strategy.game={};
    strategy.label=label;
    strategy.strategyType=strategyType;
    strategy.delay=50;

    strategy.init=function() {    
        this.element.append(this.createDiv('label', this.label));
        this.element.append(this.createDiv('game'));
        this.element.append(this.createButton('next'));
        this.element.append(this.createButton('pause'));
        this.element.append(this.createButton('run'));
        this.element.append(this.createButton('fast'));
        this.element.append(this.createButton('slow'));
        this.element.append( this.createInformation('highesttodate', 'Highest tile'));
        this.element.append( this.createInformation('longesttodate', 'Longest game'));
        this.element.append( this.createInformation('autogames', 'Games remaining'));
        this.element.append( this.createInformation('totalgames', 'Games played'));
        this.game = new Game(this.element.find(".game"), this.strategyType);
        this.element.find('.pause').hide();
        this.element.find('.fast').hide();
        this.element.find('.slow').hide();
        this.element.find('.pause').click(function (){
            strategy.pause=true;
            strategy.element.find('.pause').hide();
            strategy.element.find('.fast').hide();
            strategy.element.find('.slow').hide();
            strategy.element.find('.next').show();
            strategy.element.find('.run').show();
        });
        this.element.find('.next').click(function (){
            strategy.pause=true;
            strategy.run(strategy.game);
        });
        this.element.find('.fast').click(function (){
            strategy.delay=50;
            strategy.setSpeedButtons();
        });
        this.element.find('.slow').click(function (){
            strategy.delay=500;
            strategy.setSpeedButtons();
        });
        this.element.find('.run').click(function (){
            strategy.element.find('.pause').show();
            strategy.element.find('.next').hide();
            strategy.element.find('.run').hide();
            strategy.setSpeedButtons();
            strategy.pause=false;
            strategy.run(strategy.game);
            strategy.element.find('.autogames' ).text(strategy.maxGames-strategy.currentGame ); 
        });
        this.element.find('.autogames' ).text(this.maxGames-this.currentGame );    
        this.game.next();
    };
    
    strategy.setSpeedButtons=function(hide) {
        if (hide) {
            this.element.find('.fast').hide();
            this.element.find('.slow').hide();
        } else {
            if (this.delay===50) {
                this.element.find('.fast').hide();
                this.element.find('.slow').show();
            } else {
                this.element.find('.slow').hide();
                this.element.find('.fast').show();
            }
        }
    };
    
    strategy.createButton = function(name){
        var element = document.createElement('input');
        element.setAttribute("type", "button"); 
        element.setAttribute("value", name); 
        element.setAttribute("class", name);
        return element;
    };

    strategy.createInformation = function(name, label){
        var element = this.createDiv('name');
        element.innerHTML=label+':<span class="'+name+'">0</span>';
        return element;
    };
    
    strategy.createDiv = function(name, text){
        var element = document.createElement('div');
        element.setAttribute("class", name);
        if (text) {
            element.innerHTML=text;
        }
        return element;
    };

    strategy.run=function() {
        if (!this.game.next()) {
            if (this.game.highestTile>this.highestEver) {
                this.highestEver = this.game.highestTile;
            }
            if (this.game.numberOfMoves>this.longestEver) {
                this.longestEver = this.game.numberOfMoves;
            }
            strategy.element.find('.highesttodate' ).text(this.highestEver );
            strategy.element.find('.longesttodate' ).text(this.longestEver );
            this.totalGames++;
            this.currentGame++;
            strategy.element.find('.autogames' ).text(this.maxGames-this.currentGame );    
            strategy.element.find('.totalgames' ).text(this.totalGames );    
            if (!this.game.pause && this.currentGame<this.maxGames) {
                setTimeout(function(){
                    strategy.run();
                }, 5000);  
            } else {
                this.currentGame=0;
                this.setSpeedButtons(true);
                this.element.find('.pause').hide();
                this.element.find('.next').show();
                this.element.find('.run').show();
            }
        } else {
            if (!this.pause) {
                setTimeout(function(){
                    strategy.run();
                }, this.delay);
            }
        }
    }
    
} // end of Strategy class

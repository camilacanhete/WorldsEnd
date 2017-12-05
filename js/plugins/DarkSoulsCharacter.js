/*:
 *
 *@plugindesc This plugin allows you to have more freedom on character animation and controls
 *@author csantos
 *
 *@param TILE_SIZE
 *@desc Set tile width and height for pixel movement. RPGMaker default is 48
 *@default 48
 *
 *
 *@param SPRITESHEET_WIDTH
 *@desc How many sprites per row
 *@default 6
 *
 *@param SPRITESHEET_HEIGHT
 *@desc How many sprites per column
 *@default 8
 *
 *@param ANIMATION_SPEED
 *@desc Set animation speed
 *@default 0.8
 *
 *@param MOVE_SPEED
 *@desc Override default move speed
 *@default 3.5
 *
 *@param DIRECTIONS
 *@desc Array of directions (max 8 directions). DO NOT INCLUDE ANY SPACES
 *@default BOTTOM,BOTTOMLEFT,BOTTOMRIGHT,LEFT,RIGHT,TOPLEFT,TOPRIGHT,TOP
 *
 */


(function() {
	
var dsc_tile_size = Number(PluginManager.parameters('DarkSoulsCharacter')["TILE_SIZE"]);
var dsc_sprite_width = Number(PluginManager.parameters('DarkSoulsCharacter')["SPRITESHEET_WIDTH"]);
var dsc_sprite_height = Number(PluginManager.parameters('DarkSoulsCharacter')["SPRITESHEET_HEIGHT"]);
var dsc_animation_speed = Number(PluginManager.parameters('DarkSoulsCharacter')["ANIMATION_SPEED"]);
var dsc_move_speed = Number(PluginManager.parameters('DarkSoulsCharacter')["MOVE_SPEED"]);
var dsc_sprite_directions = String(PluginManager.parameters('DarkSoulsCharacter')["DIRECTIONS"]).split(",");
var dsc_direction = 0;

//------------------------------------------------------------------------------------------------------------------------------------
// CHARACTER MOVEMENT
//------------------------------------------------------------------------------------------------------------------------------------
  
// @override - csantos: adding a new variable called _diagonal on Game_CharacterBase class
// and giving more freedom to player adjust move speed
var dsc_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    dsc_Game_CharacterBase_initMembers.call(this);
    this._stamina  = 100;
    this._diagonal = 0;
    this._moveSpeed = dsc_move_speed;
    this._characterWasMoving = false;
    this._tileQuadrant = { x: 0, y: 0 };
};    

//@override - csantos: enabling diagonal movement - from default 4 directions to 8 directions
Game_Player.prototype.getInputDirection = function() {
    return Input.dir8;
};
    
Game_CharacterBase.prototype.quadDirX = function(d) {
	var quad = this._tileQuadrant.x;
	if (d === 6) {
		quad = this._tileQuadrant.x + 1;
		if (quad > 2) quad = 0;
	} else if (d === 4) {
		quad = this._tileQuadrant.x - 1;
		if (quad < 0) quad = 2;
	}
	return quad;
};

Game_CharacterBase.prototype.quadDirY = function(d) {
	var quad = this._tileQuadrant.y;
	if (d === 2) {
		quad = this._tileQuadrant.y + 1;
		if (quad > 2) quad = 0;
	} else if (d === 8) {
		quad = this._tileQuadrant.y - 1;
		if (quad < 0) quad = 2;
	}
	return quad;
};
    
Game_CharacterBase.prototype.canPassTile = function(x, y) {
    if (!$gameMap.isValid(x, y)) {
        return false;
    }
    if (this.isThrough() || this.isDebugThrough()) {
        return true;
    }
    if (!$gameMap.isPassable(x, y, this._direction)) {
        return false;
    }
    if (this.isCollidedWithCharacters(x, y)) {
        return false;
    }
    return true;
};
  
var dsc_Game_CharacterBase_canPass = Game_CharacterBase.prototype.canPass;
Game_CharacterBase.prototype.canPass = function(x, y, d, qx, qy) {
    var x = Math.round(x);
	var y = Math.round(y);
    
    if(qx && qy) {
        switch (d) {
            case 6:
                if (qx === 1) {
                    if (!dsc_Game_CharacterBase_canPass.call(this, x, y, d)) return false;
                    if (qy === 1) {
                        var pass = dsc_Game_CharacterBase_canPass.call(this, x, y + 1, d);
                        //if (!pass) this._diagSlide = Galv.PMOVE.getHorzVertDirs(9);
                        return pass;
                    }
                    if (qy === 2) {
                        var pass = dsc_Game_CharacterBase_canPass.call(this, x, y - 1, d);
                        //if (!pass) this._diagSlide = Galv.PMOVE.getHorzVertDirs(3);
                        return pass;
                    }
                } else if (qx === 2 && this._tileQuadrant.x === 1) {
                    return this.canPassTile(x,y);  // if caught up against something
                }
                return true;
                break;
            case 4:
                if (qx === 2) {
                    if (!dsc_Game_CharacterBase_canPass.call(this, x, y, d)) return false;
                    if (qy === 1) {
                        var pass = dsc_Game_CharacterBase_canPass.call(this, x, y + 1, d);
                        //if (!pass) this._diagSlide = Galv.PMOVE.getHorzVertDirs(7);
                        return pass;
                    }
                    if (qy === 2) {
                        var pass = dsc_Game_CharacterBase_canPass.call(this, x, y - 1, d);
                        //if (!pass) this._diagSlide = Galv.PMOVE.getHorzVertDirs(1);
                        return pass;
                    }
                } else if (qx === 1 && this._tileQuadrant.x === 2) {
                    return this.canPassTile(x,y);  // if caught up against something
                }
                return true;
                break;
            case 8:
                if (qy === 2) {
                    if (!dsc_Game_CharacterBase_canPass.call(this, x, y, d)) return false;
                    if (qx === 1) {
                        var pass = dsc_Game_CharacterBase_canPass.call(this, x + 1, y, d);
                        //if (!pass) this._diagSlide = Galv.PMOVE.getHorzVertDirs(7);
                        return pass;
                    }
                    if (qx === 2) {
                        var pass = dsc_Game_CharacterBase_canPass.call(this, x - 1, y, d);
                        //if (!pass) this._diagSlide = Galv.PMOVE.getHorzVertDirs(9);
                        return pass;
                    }
                } else if (qy === 1 && this._tileQuadrant.y === 2) {
                    return this.canPassTile(x,y);  // if caught up against something
                }
                return true;
                break;
            case 2:
                if (qy === 1) {
                    if (!dsc_Game_CharacterBase_canPass.call(this, x, y, d)) return false;
                    if (qx === 1) {
                        var pass = dsc_Game_CharacterBase_canPass.call(this, x + 1, y, d);  // do diagonal down left around event here?
                        //if (!pass) this._diagSlide = Galv.PMOVE.getHorzVertDirs(1);
                        return pass;
                    }
                    if (qx === 2) {
                        var pass = dsc_Game_CharacterBase_canPass.call(this, x - 1, y, d);  // do diagonal down right around event here?
                        //if (!pass) this._diagSlide = Galv.PMOVE.getHorzVertDirs(3);
                        return pass;
                    }
                } else if (qy === 2 && this._tileQuadrant.y === 1) {
                    return this.canPassTile(x,y);  // if caught up against something
                }
                return true;
                break;
        }
    }
    
    return dsc_Game_CharacterBase_canPass.call(this, x, y, d);
};
 
//csanto: new function to return a tile partition
Game_Map.prototype.quadMod = function(q) {
    switch(q) {
        case 1:
            return 0.33;
        break;
        case 2:
            return 0.67;
        break;
        
    }
    return 0;
};
    
//csantos: new function similar to xWithDirectionQuad that calculates a portion of X movement 
//(we're making a new function to make calculations faster)
Game_Map.prototype.xWithDirectionQuad = function(x, d, q) {
	var x = x + (d === 6 ? 0.33 : d === 4 ? -0.33 : 0);
	return Math.round(x * 100) / 100;
};

//csantos: new function similar to yWithDirectionQuad that calculates a portion of Y movement 
//(we're making a new function to make calculations faster)
Game_Map.prototype.yWithDirectionQuad = function(y, d) {
    return y + (d === 2 ? 0.33 : d === 8 ? -0.33 : 0);
};

//csantos: new function similar to roundXWithDirection that calculates a portion of X movement 
//(we're making a new function to make calculations faster)
Game_Map.prototype.roundXWithDirectionQuad = function(x, d, q) {
	var mod = this.quadMod(q);	
	if (d === 6) {
		x = q === 0 ? Math.floor(x) + 1 + mod : Math.floor(x) + mod;
	} else if (d === 4) {
		x = q === 2 ? Math.floor(x) - 1 + mod : Math.floor(x) + mod;
	}
	return this.roundX(x);
};

//csantos: new function similar to roundYWithDirection that calculates a portion of Y movement 
//(we're making a new function to make calculations faster)
Game_Map.prototype.roundYWithDirectionQuad = function(y, d, q) {
	var mod = this.quadMod(q);	
	if (d === 2) {
		y = q === 0 ? Math.floor(y) + 1 + mod : Math.floor(y) + mod;
	} else if (d === 8) {
		y = q === 2 ? Math.floor(y) - 1 + mod : Math.floor(y) + mod;
	}
	return this.roundY(y);
};


// @override - csantos: overriding moveStraight to reset _diagonal variable
var dsc_Game_CharacterBase_moveStraight = Game_CharacterBase.prototype.moveStraight;
Game_CharacterBase.prototype.moveStraight = function(d) {
    if (d % 2 !== 0) {
        this._diagonal = d;
        var horz = (d === 1 || d === 7) ? 4 : 6;
        var vert = (d === 1 || d === 3) ? 2 : 8;
        this.moveDiagonally(horz, vert)
    } else {
        this._diagonal = 0;
        
        //csantos: pixel movement portion below
        var dirX = this.quadDirX(d);
        var dirY = this.quadDirY(d);
        var x = $gameMap.roundXWithDirectionQuad(this._x, d, dirX);
        var y = $gameMap.roundYWithDirectionQuad(this._y, d, dirY);
        
        this.setMovementSuccess(this.canPass(x, y, d, dirX, dirY));

        if (this.isMovementSucceeded()) {
            this.setDirection(d);
            this._tileQuadrant.x = dirX;
            this._tileQuadrant.y = dirY;
            this._x = x;
            this._y = y;
            this._realX = $gameMap.xWithDirectionQuad(this._x, this.reverseDir(d), dirX);
            this._realY = $gameMap.yWithDirectionQuad(this._y, this.reverseDir(d), dirY);
            this.increaseSteps();
        }  else {
            this.setDirection(d);
            this.checkEventTriggerTouchFront(d);
        }
        
        //dsc_Game_CharacterBase_moveStraight.call(this, d);
    }
};    
    
//@override - csantos: make character move diagonally and set proper direction to it
var dsc_Game_CharacterBase_moveDiagonally = Game_CharacterBase.prototype.moveDiagonally;
Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
    this.setDiagonalDirection(horz, vert);
    //dsc_Game_CharacterBase_moveDiagonally.call(this, horz, vert);
    
    //csantos: pixel movement portion below
    var dirX = this.quadDirX(horz);
    var dirY = this.quadDirY(vert);
    var x = $gameMap.roundXWithDirectionQuad(this._x, horz, dirX);
    var y = $gameMap.roundYWithDirectionQuad(this._y, vert, dirY);
    
    this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
    if (this.isMovementSucceeded()) {
        this._tileQuadrant.x = dirX;
        this._tileQuadrant.y = dirY;
        this._x = x;
        this._y = y;
        this._realX = $gameMap.xWithDirectionQuad(this._x, this.reverseDir(horz), dirX);
        this._realY = $gameMap.yWithDirectionQuad(this._y, this.reverseDir(vert), dirX);
        this.increaseSteps();
    }
    if (this._direction === this.reverseDir(horz)) {
        this.setDirection(horz);
    }
    if (this._direction === this.reverseDir(vert)) {
        this.setDirection(vert);
    }
    
    this.diagonalDirection();
    if (!this.isMovementSucceeded()) this.checkEventTriggerTouchFront(this._diagonal);
};

//csantos: creating a new function to set _diagonal value
Game_CharacterBase.prototype.setDiagonalDirection = function(horz, vert) {
    if (horz === 4 && vert === 2) this._diagonal = 1;
    if (horz === 6 && vert === 2) this._diagonal = 3;
    if (horz === 4 && vert === 8) this._diagonal = 7;
    if (horz === 6 && vert === 8) this._diagonal = 9;
};
    
//csantos: creating a new function to get _diagonal 
Game_CharacterBase.prototype.getDiagonalDirection = function() {
    if (this._diagonal === 1) return 5;
    if (this._diagonal === 7) return 7;
    if (this._diagonal === 3) return 4;
    if (this._diagonal === 9) return 6;
};

//csantos: creating a new function to convert diagonal direction into game-like direction
Game_CharacterBase.prototype.diagonalDirection = function() {
    if (this._diagonal === 1) this.setDirection(2);
    if (this._diagonal === 7) this.setDirection(4);
    if (this._diagonal === 3) this.setDirection(6);
    if (this._diagonal === 9) this.setDirection(8);
};

//csantos: creating a new function to check if character is diagonally aligned
Game_CharacterBase.prototype.isDiagonal = function() {
    return (this._diagonal !== 0)
};	

//csantos: creating a new function to convert diagonal direction into axis coordinates
Game_Character.prototype.diagonalMovement = function(d) {
    if (d === 1) this.moveDiagonally(4, 2);
    if (d === 3) this.moveDiagonally(6, 2);
    if (d === 7) this.moveDiagonally(4, 8);
    if (d === 9) this.moveDiagonally(6, 8);
};

//@override - csantos: override distance per frame to adjust diagonal speed
var dsc_Game_CharacterBase_distancePerFrame = Game_CharacterBase.prototype.distancePerFrame;
Game_CharacterBase.prototype.distancePerFrame = function() {
    var distance = dsc_Game_CharacterBase_distancePerFrame.call(this);
    if (this.isDiagonal()) distance /= Math.sqrt(2);
    return distance;
};

//@override - csantos: check if event was triggered while character was diagonally aligned
var dsc_Game_CharacterBase_checkEventTriggerTouchFront = Game_CharacterBase.prototype.checkEventTriggerTouchFront;
Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d) {
    if (d % 2 !== 0){
        var horz = ((d === 1 || d === 7) ? 4 : 6);
        var vert = ((d === 1 || d === 3) ? 2 : 8);
        var x2 = $gameMap.roundXWithDirection(this.x, horz);
        var y2 = $gameMap.roundYWithDirection(this.y, vert);
        this.checkEventTriggerTouch(x2, y2);
        if (!$gameMap.isEventRunning()) this.checkEventTriggerTouch(this.x, y2);
        if (!$gameMap.isEventRunning()) this.checkEventTriggerTouch(x2, this.y);
    } else {
        dsc_Game_CharacterBase_checkEventTriggerTouchFront.call(this, d)
    }				
};

//@override - csantos: overriding copyPosition in order to copy _diagonal variable aswell
var dsc_Game_CharacterBase_copyPosition = Game_CharacterBase.prototype.copyPosition;
Game_CharacterBase.prototype.copyPosition = function(character) {
    dsc_Game_CharacterBase_copyPosition.call(this, character);
    this._diagonal = character._diagonal;
    this.diagonalDirection();
};

//@override - csantos: execute movement diagonally or else 
var dsc_Game_Player_executeMove = Game_Player.prototype.executeMove;
Game_Player.prototype.executeMove = function(direction) {
    if (direction % 2 !== 0) {
        this._diagonal = direction;
        this.diagonalMovement(direction);
    } else {
        this._diagonal = 0;
        dsc_Game_Player_executeMove.call(this, direction);
    };
};
    
//------------------------------------------------------------------------------------------------------------------------------------
// CHARACTER ANIMATION
//------------------------------------------------------------------------------------------------------------------------------------

// @override - csantos: setting a custom spritesheet bitmap
var dsc_Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function() {
	
    this._character._cframes = !this._character._cframes ? dsc_sprite_width : this._character._cframes;
    this._character._spattern = 0;
    this._character._patSpd = this._character._cframes * dsc_animation_speed;
    //this._cframes = this._character._cframes;
    
	dsc_Sprite_Character_setCharacterBitmap.call(this);
};

//@override - csantos: this function controls which sprite block character is, since the spritesheet can have up to 8 different characters (default is 0)
var dsc_Sprite_Character_characterBlockX = Sprite_Character.prototype.characterBlockX;
Sprite_Character.prototype.characterBlockX = function() {
    if (this._isBigCharacter) {
        return 0;
    } else {
        var index = this._character.characterIndex();
        return index % 4 * this._character._cframes;
    }
};

//@override - csantos: this function controls the sprite width
Sprite_Character.prototype.patternWidth = function() {
    return this.bitmap.width / this._character._cframes;
};
   
//@override - csantos: this function controls the sprite height
Sprite_Character.prototype.patternHeight = function() {
    return this.bitmap.height / dsc_sprite_height;
};
    
//@override - csantos: this function controls which row of the sprite pattern should be displayed
var dsc_Sprite_Character_characterPatternY = Sprite_Character.prototype.characterPatternY;
Sprite_Character.prototype.characterPatternY = function() {
    
    if(this._character.isDiagonal()) return this._character.getDiagonalDirection();
    
    return dsc_Sprite_Character_characterPatternY.call(this);
};

//csantos: creating a new function to convert the input direction to the correspondent animation present on the current sprite configuration 
Sprite_Character.prototype.getAnimationIndex = function(animationIndex) {
    
    var animationName = "";
    
    switch(animationIndex) {
        case 0:
            animationName = "BOTTOM";
        break;
        case 1:
            animationName = "LEFT";
        break;
        case 2:
            animationName = "RIGHT";
        break;
        case 3:
            animationName = "TOP";
        break;
        case 4:
            animationName = "BOTTOMRIGHT";
        break;
        case 5:
            animationName = "BOTTOMLEFT";
        break;
        case 6:
            animationName = "TOPRIGHT";
        break;
        case 7:
            animationName = "TOPLEFT";
        break;
    }
    
    return dsc_sprite_directions.indexOf(animationName);
};    

//@override - csantos: this function updates character frame
//The important part is characterPatternY, it controls which row of animation we are displaying at the moment
//We'll override the animation standard sequence to have more freedom
Sprite_Character.prototype.updateCharacterFrame = function() {
    var pw = this.patternWidth();
    var ph = this.patternHeight();
    var sx = (this.characterBlockX() + this.characterPatternX()) * pw;
    var i = this.getAnimationIndex(this.characterPatternY());
    var sy = (this.characterBlockY() + i) * ph;

    this.updateHalfBodySprites();
    if (this._bushDepth > 0) {
        var d = this._bushDepth;
        this._upperBody.setFrame(sx, sy, pw, ph - d);
        this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
        this.setFrame(sx, sy, 0, ph);
    } else {
        this.setFrame(sx, sy, pw, ph);
    }
};
    
// @override - csantos: this function controls the column frames (y axis) from 0 to this._cframes
Game_CharacterBase.prototype.pattern = function() {
    return this._pattern < this._cframes ? this._pattern : this._spattern;
};

//@override - csantos: this function resets _pattern 
Game_CharacterBase.prototype.updatePattern = function() {
    if (!this.hasStepAnime() && this._stopCount > 0) {
        this.resetPattern();
    } else {
		this._pattern = (this._pattern + 1) % (this._cframes + this._spattern);
    }
};

//@override - csantos: this function controls animation speed
var dsc_CharacterBase_animationWait = Game_CharacterBase.prototype.animationWait;
Game_CharacterBase.prototype.animationWait = function() {
    return dsc_CharacterBase_animationWait.call(this) - this._patSpd;
};

//@override - csantos: this function controls player spritesheet animation
var dsc_Game_Player_updateAnimation = Game_Player.prototype.updateAnimation;
Game_Player.prototype.updateAnimation = function() {
    
    if(this._isMoving && !this._characterWasMoving) {
        this._cframes = 6;
        this.actor()._characterName = "Walk";
        this.refresh();
        
    } else if(!this._isMoving && this._characterWasMoving) {
        this._cframes = 1;
        this.actor()._characterName = "Stand";
        this.refresh();
        ////this.actor().setCharacterImage("Stand", 0);
    }
    
    this._characterWasMoving = this._isMoving;

    dsc_Game_Player_updateAnimation.call(this);
};    
    
//------------------------------------------------------------------------------------------------------------------------------------
// STAMINA
//------------------------------------------------------------------------------------------------------------------------------------
 
//csantos: define a new property on Game_CharacterBase so we can use $gamePlayer.stamina to get stamina value
Object.defineProperties(Game_CharacterBase.prototype, {
    stamina: { 
        get: function() { return this._stamina; },
        set: function(s) { if(s >= 0 && s <= 100) { this._stamina = s; } else if( s > 100 ) { this._stamina = 100; } else { this._stamina = 0; } },
        configurable: true 
    }
});

    
Game_Player.prototype.updateDashing = function() {
    if(this._dashing) {
        this.stamina -= 0.25;
        if(this.stamina <= 0) {
            this._dashing = false;
            return;    
        }
    } else {
        this.stamina += 0.25;
    }
};

})();
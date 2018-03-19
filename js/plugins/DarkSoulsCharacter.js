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
 *@param MP_RECOVERY
 *@desc Recovery formula for stamina (mp)
 *@default a.level * 0.001 * a.mmp
 *
 */

var Imported = Imported || {};
Imported.DarkSoulsCharacter = '0.0.1';

(function() {
	
var dsc_tile_size = Number(PluginManager.parameters('DarkSoulsCharacter')["TILE_SIZE"]);
var dsc_sprite_width = Number(PluginManager.parameters('DarkSoulsCharacter')["SPRITESHEET_WIDTH"]);
var dsc_sprite_height = Number(PluginManager.parameters('DarkSoulsCharacter')["SPRITESHEET_HEIGHT"]);
var dsc_animation_speed = Number(PluginManager.parameters('DarkSoulsCharacter')["ANIMATION_SPEED"]);
var dsc_move_speed = Number(PluginManager.parameters('DarkSoulsCharacter')["MOVE_SPEED"]);
var dsc_sprite_directions = String(PluginManager.parameters('DarkSoulsCharacter')["DIRECTIONS"]).split(",");
var dsc_mp_recovery_formula = String(PluginManager.parameters('DarkSoulsCharacter')["MP_RECOVERY"]).replace(/a./gi, "this.actor().");
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
    this._isAttacking = false;
    this._isRolling = false;
    this._isHealing = false;
    this._characterWasAttacking = false;
};    

//@override - csantos: enabling diagonal movement - from default 4 directions to 8 directions
Game_Player.prototype.getInputDirection = function() {
    return Input.dir8;
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
    if (this.isDiagonal() && !this.isRolling()) distance /= Math.sqrt(2);
    return distance;
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

//csantos: create new sprite class inherit from Sprite_Character to customize player's sprite only
function Sprite_Player() {
    this.initialize.apply(this, arguments);
}
    
Sprite_Player.prototype = Object.create(Sprite_Character.prototype);
Sprite_Player.prototype.constructor = Sprite_Player;
    
/*Sprite_Player.prototype.initialize = function() {
    Sprite_Character.prototype.initialize.call(this);
};*/
    
// @override - csantos: setting a custom spritesheet bitmap
var dsc_Sprite_Player_setCharacterBitmap = Sprite_Player.prototype.setCharacterBitmap;
Sprite_Player.prototype.setCharacterBitmap = function() {
	
    this._character._cframes = !this._character._cframes ? dsc_sprite_width : this._character._cframes;
    this._character._spattern = 0;
    this._character._patSpd = this._character._cframes * dsc_animation_speed;
    //this._cframes = this._character._cframes;
    
	dsc_Sprite_Player_setCharacterBitmap.call(this);
};

//@override - csantos: this function controls which sprite block character is, since the spritesheet can have up to 8 different characters (default is 0)
var dsc_Sprite_Player_characterBlockX = Sprite_Player.prototype.characterBlockX;
Sprite_Player.prototype.characterBlockX = function() {
    if (this._isBigCharacter) {
        return 0;
    } else {
        var index = this._character.characterIndex();
        return index % 4 * this._character._cframes;
    }
};

//@override - csantos: this function controls the sprite width
Sprite_Player.prototype.patternWidth = function() {
    return this.bitmap.width / this._character._cframes;
};
   
//@override - csantos: this function controls the sprite height
Sprite_Player.prototype.patternHeight = function() {
    return this.bitmap.height / dsc_sprite_height;
};
    
//@override - csantos: this function controls which row of the sprite pattern should be displayed
var dsc_Sprite_Player_characterPatternY = Sprite_Player.prototype.characterPatternY;
Sprite_Player.prototype.characterPatternY = function() {
    
    if(this._character.isDiagonal()) return this._character.getDiagonalDirection();
    
    return dsc_Sprite_Player_characterPatternY.call(this);
};

//csantos: creating a new function to convert the input direction to the correspondent animation present on the current sprite configuration 
Sprite_Player.prototype.getAnimationIndex = function(animationIndex) {
    
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
Sprite_Player.prototype.updateCharacterFrame = function() {
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

// @override - csantos: create player's character sprite as Sprite_Player and not Sprite_Character
Spriteset_Map.prototype.createCharacters = function() {
    this._characterSprites = [];
    $gameMap.events().forEach(function(event) {
        this._characterSprites.push(new Sprite_Character(event));
    }, this);
    $gameMap.vehicles().forEach(function(vehicle) {
        this._characterSprites.push(new Sprite_Character(vehicle));
    }, this);
    $gamePlayer.followers().reverseEach(function(follower) {
        this._characterSprites.push(new Sprite_Character(follower));
    }, this);
    this._characterSprites.push(new Sprite_Player($gamePlayer));
    for (var i = 0; i < this._characterSprites.length; i++) {
        this._tilemap.addChild(this._characterSprites[i]);
    }
};
    
// @override - csantos: this function controls the column frames (y axis) from 0 to this._cframes
Game_Player.prototype.pattern = function() {
    return this._pattern < this._cframes ? this._pattern : this._spattern;
};

//@override - csantos: this function resets _pattern 
Game_Player.prototype.updatePattern = function() {
    
    //csantos: in order to make the attack animation continuous, we need to make an exception for it
    if (!this.isAttacking() && !this.isRolling() && !this.isHealing() && !this.hasStepAnime() && this._stopCount > 0) {
        this.resetPattern();
    } else {
		this._pattern = (this._pattern + 1) % (this._cframes + this._spattern);
        
        //csantos: reset attack
        if(this._pattern === this._cframes - 1) { 
            if(this.isAttacking()) this.resetAttack(); 
            if(this.isRolling()) this.resetRolling();
            if(this.isHealing()) this.resetHealing();
        }
    }
};

//@override - csantos: this function controls animation speed
var dsc_Game_Player_animationWait = Game_Player.prototype.animationWait;
Game_Player.prototype.animationWait = function() {
    return dsc_Game_Player_animationWait.call(this) - ((this._isAttacking) ? this._patSpd * 2.5 : this._patSpd);
};

//csantos: new function to return leader when calling game player actor
Game_Player.prototype.actor = function() {
    return $gameParty.leader();
};

//@override - csantos: this function controls player spritesheet animation
var dsc_Game_Player_updateAnimation = Game_Player.prototype.updateAnimation;
Game_Player.prototype.updateAnimation = function() {
    
    if(this.isAttacking()) {
        this._cframes = 5;
        this.actor()._characterName = "Attack";
        //console.log("actor is attacking");
    }
    else if(this.isRolling()) {
        this._cframes = 7;
        this.actor()._characterName = "Roll";
        //console.log("actor is attacking");
    }
    else if(this.isHealing()) {
        this._cframes = 10;
        this.actor()._characterName = "Heal";
        //console.log("actor is attacking");
    }
    else if(this.isMoving()) {
        this._cframes = 6;
        this.actor()._characterName = "Walk";
        //console.log("actor is moving");
        
    }
    else {
        this._cframes = 1;
        this.actor()._characterName = "Stand";
        //console.log("actor is standing");
        ////this.actor().setCharacterImage("Stand", 0);
    }
    
    this.refresh();
    this._characterWasMoving = this.isMoving();
    this._characterWasAttacking = this.isAttacking();
    
    dsc_Game_Player_updateAnimation.call(this);
};

var dsc_Game_Player_updateAnimationCount = Game_Player.prototype.updateAnimationCount;    
Game_Player.prototype.updateAnimationCount = function() {
    
    if(this.isAttacking() || this.isRolling() || this.isHealing()) {
        this._animationCount++;
        return;
    }
    
    dsc_Game_Player_updateAnimationCount.call(this);
};
    
//------------------------------------------------------------------------------------------------------------------------------------
// STAMINA
//------------------------------------------------------------------------------------------------------------------------------------
 
//csantos: define a new property on Game_CharacterBase so we can use $gamePlayer.stamina to get stamina value
Object.defineProperties(Game_BattlerBase.prototype, {
    mp: { 
        get: function() { return this._mp; },
        set: function(s) { if(s >= 0 && s <= this.mmp) { this._mp = s; } else if( s > this.mmp ) { this._mp = this.mmp; } else { this._mp = 0; } },
        configurable: true 
    }
});
    
/*Object.defineProperties(Game_CharacterBase.prototype, {
    stamina: { 
        get: function() { return this._stamina; },
        set: function(s) { if(s >= 0 && s <= 100) { this._stamina = s; } else if( s > 100 ) { this._stamina = 100; } else { this._stamina = 0; } },
        configurable: true 
    }
});*/

    
Game_Player.prototype.updateDashing = function() {
    if(this.isMoving() && this._dashing) {
        this.actor().mp -= 0.25;
        if(this.actor().mp <= 0) {
            this._dashing = false;
            return;    
        }      
        /*this.stamina -= 0.25;
        if(this.stamina <= 0) {
            this._dashing = false;
            return;    
        }*/
        
    } else {
        //this.stamina += 0.25;
        //console.log(this.actor().mrg);
        //this.actor().mp += this.actor().mrg;
        //console.log(dsc_mp_recovery_formula);
        this.actor().mp += eval(dsc_mp_recovery_formula);
        //console.log(this.actor().mp);
    }
};

})();

//------------------------------------------------------------------------------------------------------------------------------------
// ADDITIONAL MOVEMENTS - ATTACK
//------------------------------------------------------------------------------------------------------------------------------------

Game_CharacterBase.prototype.isAttacking = function() {
    return this._isAttacking;
};

Game_CharacterBase.prototype.resetAttack = function() {
    this._isAttacking = false;
};

Game_CharacterBase.prototype.isRolling = function() {
    return this._isRolling;
};

Game_CharacterBase.prototype.resetRolling = function() {
    this._isRolling = false;
};

Game_CharacterBase.prototype.isHealing = function() {
    return this._isHealing;
};

Game_CharacterBase.prototype.resetHealing = function() {
    this._isHealing = false;
};

//@override - csantos: this function was copied from QABS script to update animation accordingly
Game_Player.prototype.useSkill = function(skillId, fromEvent) {
    
    if (!this.canInputSkill(fromEvent)) return null;
    if (!this.canUseSkill(skillId)) return null;

    if (this._groundTargeting) {
        this.onTargetingCancel();
    }
    var skill = this.forceSkill(skillId);
    if (!this._groundTargeting) {
        this.battler().paySkillCost($dataSkills[skillId]);
    }
    
    this.updateCommands(skillId);
    this.payItemCost(skillId);
    
    return skill;
};

Game_Player.prototype.updateCommands = function(id) {
    
    switch(id) {
        case 1:
            if(!this._isAttacking) { 
                this._isAttacking = true;
                this._pattern = 0;
            }
        break;
        case 2:
            if(!this._isRolling) { 
                this._isRolling = true;
                this._isAttacking = false;
                this._pattern = 0;
            }
        break;
        case 3:
            if(!this._isHealing) {
                this._isHealing = true;
                this._isAttacking = false;
                this._pattern = 0;
            }
        break;
    }
};

/*var dsc_Game_Battler_gainHp = Game_Battler.prototype.gainHp;    
Game_Battler.prototype.gainHp = function(value) {
    if($gamePlayer.isRolling()) return;
    dsc_Game_Battler_gainHp.call(this, value);
};*/
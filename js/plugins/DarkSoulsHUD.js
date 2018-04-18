/*:
 *
 *@plugindesc This plugin makes a health bar/stamina bar appears on map
 *@author csantos
 *
 *@param BACKGROUND_HP_IMAGE_NAME
 *@desc Set background hp image filename inside img/gui folder
 *@default health_bar_background
 *
 *@param BACKGROUND_HP_X_OFFSET
 *@desc Set background hp x offset to align with foreground
 *@default 30
 *
 *@param BACKGROUND_HP_Y_OFFSET
 *@desc Set background hp y offset to align with foreground
 *@default 0
 *
 *@param FOREGROUND_HP_IMAGE_NAME
 *@desc Set background hp image filename inside img/gui folder
 *@default health_bar_foreground
 *
 *@param BACKGROUND_HP_IMAGE_WIDTH
 *@desc Set background stamina image width
 *@default 196
 *
 *@param BACKGROUND_HP_IMAGE_HEIGHT
 *@desc Set background stamina image height
 *@default 64
 *
 *@param FOREGROUND_HP_IMAGE_WIDTH
 *@desc Set background hp image width
 *@default 256
 *
 *@param FOREGROUND_HP_IMAGE_HEIGHT
 *@desc Set background hp image height
 *@default 64
 *
 *@param BACKGROUND_STAMINA_IMAGE_NAME
 *@desc Set background stamina image filename inside img/gui folder
 *@default stamina_bar_background
 *
 *@param BACKGROUND_STAMINA_X_OFFSET
 *@desc Set background stamina x offset to align with foreground
 *@default 30
 *
 *@param BACKGROUND_STAMINA_Y_OFFSET
 *@desc Set background stamina y offset to align with foreground
 *@default 0
 *
 *@param FOREGROUND_STAMINA_IMAGE_NAME
 *@desc Set background stamina image filename inside img/gui folder
 *@default stamina_bar_foreground
 *
 *@param BACKGROUND_STAMINA_IMAGE_WIDTH
 *@desc Set background stamina image width
 *@default 196
 *
 *@param BACKGROUND_STAMINA_IMAGE_HEIGHT
 *@desc Set background stamina image height
 *@default 32
 *
 *@param FOREGROUND_STAMINA_IMAGE_WIDTH
 *@desc Set background stamina image width
 *@default 256
 *
 *@param FOREGROUND_STAMINA_IMAGE_HEIGHT
 *@desc Set background stamina image height
 *@default 32
 *
 */


(function() {

var dsc_background_hp_image_name = String(PluginManager.parameters('DarkSoulsHUD')["BACKGROUND_HP_IMAGE_NAME"]);
var dsc_background_hp_x_offset = Number(PluginManager.parameters('DarkSoulsHUD')["BACKGROUND_HP_X_OFFSET"]);
var dsc_background_hp_y_offset = Number(PluginManager.parameters('DarkSoulsHUD')["BACKGROUND_HP_Y_OFFSET"]);
var dsc_background_hp_image_width = Number(PluginManager.parameters('DarkSoulsHUD')["BACKGROUND_HP_IMAGE_WIDTH"]);
var dsc_background_hp_image_height = Number(PluginManager.parameters('DarkSoulsHUD')["BACKGROUND_HP_IMAGE_HEIGHT"]);
var dsc_foreground_hp_image_name = String(PluginManager.parameters('DarkSoulsHUD')["FOREGROUND_HP_IMAGE_NAME"]);
var dsc_foreground_hp_image_width = Number(PluginManager.parameters('DarkSoulsHUD')["FOREGROUND_HP_IMAGE_WIDTH"]);
var dsc_foreground_hp_image_height = Number(PluginManager.parameters('DarkSoulsHUD')["FOREGROUND_HP_IMAGE_HEIGHT"]);

var dsc_background_stamina_image_name = String(PluginManager.parameters('DarkSoulsHUD')["BACKGROUND_STAMINA_IMAGE_NAME"]);
var dsc_background_stamina_x_offset = Number(PluginManager.parameters('DarkSoulsHUD')["BACKGROUND_STAMINA_X_OFFSET"]);
var dsc_background_stamina_y_offset = Number(PluginManager.parameters('DarkSoulsHUD')["BACKGROUND_STAMINA_Y_OFFSET"]);
var dsc_background_stamina_image_width = Number(PluginManager.parameters('DarkSoulsHUD')["BACKGROUND_STAMINA_IMAGE_WIDTH"]);
var dsc_background_stamina_image_height = Number(PluginManager.parameters('DarkSoulsHUD')["BACKGROUND_STAMINA_IMAGE_HEIGHT"]);
var dsc_foreground_stamina_image_name = String(PluginManager.parameters('DarkSoulsHUD')["FOREGROUND_STAMINA_IMAGE_NAME"]);
var dsc_foreground_stamina_image_width = Number(PluginManager.parameters('DarkSoulsHUD')["FOREGROUND_STAMINA_IMAGE_WIDTH"]);
var dsc_foreground_stamina_image_height = Number(PluginManager.parameters('DarkSoulsHUD')["FOREGROUND_STAMINA_IMAGE_HEIGHT"]);

//------------------------------------------------------------------------------------------------------------------------------------
// PLAYER HEALTH/STAMINA GUI
//------------------------------------------------------------------------------------------------------------------------------------    
    
// @override - csantos: adding a new window on map called _healthBar to show player's hp and stamina
var dsc_Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    dsc_Scene_Map_start.call(this);
    this._healthBar = new PlayerGUI(100, 100);
    this.addWindow(this._healthBar); 
};

// @override - csantos: updating the window called _healthBar with other map updates
var dsc_Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    dsc_Scene_Map_update.call(this);
    this._healthBar.refresh();
};

//csantos: creating a class for the health bar window
function PlayerGUI() {
    this.createHPForeground();
    this.createHPBackground();
    this.createStaminaForeground();
    this.createStaminaBackground();
    this.initialize.apply(this, arguments);
}

PlayerGUI.prototype = Object.create(Window_Base.prototype);
PlayerGUI.prototype.constructor = PlayerGUI;

PlayerGUI.prototype.initialize = function(x, y) {
    Window_Base.prototype.initialize.call(this, 0, 0, this.windowWidth(), this.windowHeight());
    this.opacity = 0;
    this.setHPForeground();
    this.setHPBackground();
    this.setStaminaForeground();
    this.setStaminaBackground();
    this.refresh();
};

PlayerGUI.prototype.refresh = function(){
    this.contents.clear();
    this._guiHPBackground.setFrame(0, 0, (dsc_background_hp_image_width * $gameParty.leader().hp/$gameParty.leader().mhp), dsc_background_hp_image_height);
    this._guiStaminaBackground.setFrame(0, 0, (dsc_background_stamina_image_width * $gameParty.leader().mp/$gameParty.leader().mmp), dsc_background_stamina_image_height);
};

PlayerGUI.prototype.windowWidth = function() {
    return (dsc_foreground_hp_image_width > dsc_foreground_stamina_image_width) ? dsc_foreground_hp_image_width : dsc_foreground_stamina_image_width;
};
    
PlayerGUI.prototype.windowHeight = function() {
    return dsc_foreground_hp_image_height + 10 + dsc_foreground_stamina_image_height;
};
    
PlayerGUI.prototype.createHPForeground = function() {
    this._guiHPForeground = new Sprite();
    this._guiHPForeground.bitmap = ImageManager.loadBitmap('img/gui/', dsc_foreground_hp_image_name);
    this._guiHPForeground.anchor.x = 0;
    this._guiHPForeground.anchor.y = 0;
    this._guiHPForeground.x = 0;
    this._guiHPForeground.y = 0;
};
    
PlayerGUI.prototype.setHPForeground = function() {
    this.addChild(this._guiHPForeground);
};
    
PlayerGUI.prototype.createHPBackground = function() {
    this._guiHPBackground = new Sprite();
    this._guiHPBackground.bitmap = ImageManager.loadBitmap('img/gui/', dsc_background_hp_image_name);
    this._guiHPBackground.anchor.x = 0;
    this._guiHPBackground.anchor.y = 0;
    this._guiHPBackground.x = dsc_background_hp_x_offset;
    this._guiHPBackground.y = dsc_background_hp_y_offset;
};
    
PlayerGUI.prototype.setHPBackground = function() {
    this.addChildAt(this._guiHPBackground, 1);
};
    
PlayerGUI.prototype.createStaminaForeground = function() {
    this._guiStaminaForeground = new Sprite();
    this._guiStaminaForeground.bitmap = ImageManager.loadBitmap('img/gui/', dsc_foreground_stamina_image_name);
    this._guiStaminaForeground.anchor.x = 0;
    this._guiStaminaForeground.anchor.y = 0;
    this._guiStaminaForeground.x = 0;
    this._guiStaminaForeground.y = dsc_foreground_hp_image_height + 10; 
};
    
PlayerGUI.prototype.setStaminaForeground = function() {
    this.addChild(this._guiStaminaForeground);
};
    
PlayerGUI.prototype.createStaminaBackground = function() {
    this._guiStaminaBackground = new Sprite();
    this._guiStaminaBackground.bitmap = ImageManager.loadBitmap('img/gui/', dsc_background_stamina_image_name);
    this._guiStaminaBackground.anchor.x = 0;
    this._guiStaminaBackground.anchor.y = 0;
    this._guiStaminaBackground.x = dsc_background_stamina_x_offset;
    this._guiStaminaBackground.y = dsc_foreground_hp_image_height + dsc_background_stamina_y_offset + 10;
    //console.log($gameParty.leader());
    //console.log($gameSystem.absKeys());
    //console.log($gameSystem.absKeys().filter(function(o) { return o.skillId === 1; }));
};
    
PlayerGUI.prototype.setStaminaBackground = function() {
    this.addChildAt(this._guiStaminaBackground, 0);
};
    
//------------------------------------------------------------------------------------------------------------------------------------
// ENEMY AIM GAUGE
//------------------------------------------------------------------------------------------------------------------------------------    

Sprite_Character.prototype.setBattler = function(battler) {
    this.aimGUI = new AimGUI();
    this.aimGUI.setup(this._character, battler);
    this.addChild(this.aimGUI);
};

var dsc_Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {
    dsc_Game_Enemy_setup.call(this, enemyId, x, y);
    this._isTarget = false;
    this._aimPOSX = 0;
    this._aimPOSY = -24;
};

function AimGUI() {
    this.initialize.apply(this, arguments);
}
    
AimGUI.prototype = Object.create(Sprite.prototype);
AimGUI.prototype.constructor = AimGUI;

AimGUI.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._character = null;
    this._battler = null;
    this.width = 34;
    this.height = 34;
    this.createAimForeground();
};

AimGUI.prototype.createAimForeground = function() {
    this.bitmap = ImageManager.loadBitmap('img/gui/', 'aim');
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    //this.x = 0;
    //this.y = 0;
};

AimGUI.prototype.setup = function(character, battler) {
    this._character = character;
    this._battler = battler;
    this.refresh();
};

AimGUI.prototype.refresh = function() {
    if (!this._battler) return;
    this.clear();
};

AimGUI.prototype.showGauge = function() {
    return true;
};

AimGUI.prototype.update = function() {
    Sprite.prototype.update.call(this);
    
    if(this._battler && this._battler._isTarget) {
        this.showHud();
        this.updatePosition();
        return;
    }
    
    this.hideHud();
};

AimGUI.prototype.updatePosition = function() {
    this.x = this._battler._aimPOSX;
    this.y = this._battler._aimPOSY;
};

AimGUI.prototype.showHud = function() {
    if (!this.visible) {
        this.refresh();
        this.visible = true;
    }
};

AimGUI.prototype.hideHud = function() {
    if (this.visible) {
        this.clear();
        this.visible = false;
    }
};

AimGUI.prototype.clear = function() {
};    
    
})();
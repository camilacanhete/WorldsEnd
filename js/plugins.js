// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins =
[
{"name":"Community_Basic","status":true,"description":"Basic plugin for manipulating important parameters.","parameters":{"cacheLimit":"20","screenWidth":"816","screenHeight":"624","changeWindowWidthTo":"","changeWindowHeightTo":"","renderingMode":"auto","alwaysDash":"off"}},
{"name":"========================","status":true,"description":"","parameters":{}},
{"name":"DarkSoulsCharacter","status":true,"description":"This plugin allows you to have more freedom on character animation and controls","parameters":{"TILE_SIZE":"48","SPRITESHEET_WIDTH":"1","SPRITESHEET_HEIGHT":"8","ANIMATION_SPEED":"0.8","MOVE_SPEED":"3.5","DIRECTIONS":"BOTTOM,BOTTOMLEFT,BOTTOMRIGHT,LEFT,RIGHT,TOPLEFT,TOPRIGHT,TOP","MP_RECOVERY":"a.level * 0.001 * a.mmp"}},
{"name":"DarkSoulsHealthBar","status":true,"description":"This plugin makes a health bar/stamina bar appears on map","parameters":{"BACKGROUND_HP_IMAGE_NAME":"health_bar_background","BACKGROUND_HP_X_OFFSET":"30","BACKGROUND_HP_Y_OFFSET":"0","FOREGROUND_HP_IMAGE_NAME":"health_bar_foreground","BACKGROUND_HP_IMAGE_WIDTH":"196","BACKGROUND_HP_IMAGE_HEIGHT":"64","FOREGROUND_HP_IMAGE_WIDTH":"256","FOREGROUND_HP_IMAGE_HEIGHT":"64","BACKGROUND_STAMINA_IMAGE_NAME":"stamina_bar_background","BACKGROUND_STAMINA_X_OFFSET":"30","BACKGROUND_STAMINA_Y_OFFSET":"0","FOREGROUND_STAMINA_IMAGE_NAME":"stamina_bar_foreground","BACKGROUND_STAMINA_IMAGE_WIDTH":"196","BACKGROUND_STAMINA_IMAGE_HEIGHT":"32","FOREGROUND_STAMINA_IMAGE_WIDTH":"256","FOREGROUND_STAMINA_IMAGE_HEIGHT":"32"}},
{"name":"========================","status":true,"description":"","parameters":{}},
{"name":"QPlus","status":true,"description":"<QPlus> (Should go above all Q Plugins)\nSome small changes to MV for easier plugin development.","parameters":{"Quick Test":"false","Default Enabled Switches":"[]","Ignore Mouse when inactive":"false"}},
{"name":"QInput","status":true,"description":"<QInput>\nAdds additional keys to Input class, and allows remapping keys.","parameters":{"Threshold":"0.5","Input Remap":"","Ok":"[\"#enter\", \"#space\", \"#z\", \"$A\"]","Escape / Cancel":"[\"#esc\", \"#insert\", \"#x\", \"#num0\", \"$B\"]","Menu":"[\"#esc\", \"$Y\"]","Shift":"[\"#shift\", \"#cancel\", \"$X\"]","Control":"[\"#ctrl\", \"#alt\"]","Tab":"[\"#tab\"]","Pageup":"[\"#pageup\", \"#q\", \"$L1\"]","Pagedown":"[\"#pagedown\", \"#w\", \"$R1\"]","Left":"[\"#left\", \"#num4\", \"$LEFT\"]","Right":"[\"#right\", \"#num6\", \"$RIGHT\"]","Up":"[\"#up\", \"#num8\", \"$UP\"]","Down":"[\"#down\", \"#num2\", \"$DOWN\"]","Debug":"[\"#f9\"]","ControlKeys Remap":"","FPS":"f2","Streched":"f3","FullScreen":"f4","Restart":"f5","Console":"f8"}},
{"name":"========================","status":true,"description":"","parameters":{}},
{"name":"QMovement","status":true,"description":"<QMovement>\nMore control over character movement","parameters":{"Main Settings":"","Grid":"1","Tile Size":"48","Off Grid":"true","Optional Settings":"","Smart Move":"2","Mid Pass":"false","Move on click":"true","Diagonal":"true","Diagonal Speed":"0","Colliders":"","Player Collider":"{\"Type\":\"box\",\"Width\":\"36\",\"Height\":\"24\",\"Offset X\":\"6\",\"Offset Y\":\"24\"}","Event Collider":"{\"Type\":\"box\",\"Width\":\"36\",\"Height\":\"24\",\"Offset X\":\"6\",\"Offset Y\":\"24\"}","Presets":"[]","Debug Settings":"","Show Colliders":"true"}},
{"name":"QM+CollisionMap","status":true,"description":"<QMCollisionMap>\nQMovement Addon: Adds image collision map feature","parameters":{"Scan Size":"4","Folder":"img/parallaxes/"}},
{"name":"========================","status":true,"description":"","parameters":{}},
{"name":"QABS","status":true,"description":"<QABS>\nAction Battle System for QMovement","parameters":{"Attack Settings":"","Quick Target":"false","Lock when Targeting":"true","Aim with Mouse":"false","Aim with Analog":"false","Move Resistance Rate Stat":"xparam(1)","Loot Settings":"","Loot Decay":"600","AoE Loot":"true","Loot Touch Trigger":"false","Gold Icon":"314","Level Animation":"52","Show Damage":"true","Enemy AI":"","AI Default Sight Range":"240","AI Action Wait":"30","AI Uses QSight":"true","AI uses QPathfind":"true","Default Skills":"[\"{\\\"Keyboard Input\\\":\\\"mouse1\\\",\\\"Gamepad Input\\\":\\\"$R2\\\",\\\"Rebind\\\":\\\"true\\\",\\\"Skill Id\\\":\\\"1\\\"}\",\"{\\\"Keyboard Input\\\":\\\"mouse2\\\",\\\"Gamepad Input\\\":\\\"$L2\\\",\\\"Rebind\\\":\\\"true\\\",\\\"Skill Id\\\":\\\"2\\\"}\",\"{\\\"Keyboard Input\\\":\\\"#q\\\",\\\"Gamepad Input\\\":\\\"$L1\\\",\\\"Rebind\\\":\\\"true\\\",\\\"Skill Id\\\":\\\"3\\\"}\",\"{\\\"Keyboard Input\\\":\\\"#e\\\",\\\"Gamepad Input\\\":\\\"$R1\\\",\\\"Rebind\\\":\\\"true\\\",\\\"Skill Id\\\":\\\"9\\\"}\"]"}},
{"name":"QABS+Gauges","status":true,"description":"<QABSGauges>","parameters":{"Gauge Configs":"","Gauge Width":"48","Gauge Height":"4","Boss Gauge Width":"480","Boss Gauge Height":"16","Gauge Default OX":"0","Gauge Default OY":"-48","Boss Gauge Default OX":"0","Boss Gauge Default OY":"24","Gauge Colors":"","Gauge Background Color":"#202040","Gauge Inbetween Color":"#ffffff","Gauge HP Color 1":"#e08040","Gauge HP Color 2":"#f0c040","Gauge Text":"","Text Font":"GameFont","Font Size":"14","Font Color":"#ffffff","Boss Text Font":"GameFont","Boss Font Size":"18","Boss Font Color":"#ffffff"}},
{"name":"QABS+Skillbar","status":true,"description":"<QABSSkillbar>\nQABS Addon: Adds a mmo like skillbar","parameters":{"Show Unassigned Keys":"false","Default visibility":"true"}},
{"name":"========================","status":true,"description":"","parameters":{}},
{"name":"QPathfind","status":true,"description":"<QPathfind>\nA* Pathfinding algorithm","parameters":{"Diagonals":"false","Any Angle":"false","Intervals":"100","Smart Wait":"60","Dash on Mouse":"true"}},
{"name":"QSight","status":true,"description":"<QSight>\nReal time line of sight","parameters":{"See Through Terrain":"[]","Show":"false"}},
{"name":"QPopup","status":true,"description":"<QPopup>\nLets you create popups in the map or on screen","parameters":{"Presets":"[]"}},
{"name":"========================","status":true,"description":"","parameters":{}},
{"name":"YEP_GridFreeDoodads","status":true,"description":"v1.05 Place Grid-Free Doodads into your game using an\nin-game editor. Static and animated doodads can be used!","parameters":{"---General---":"","Doodads Folder":"img/doodads/","Doodads Smoothing":"false","Alphabetical Settings":"false","---Grid Snap---":"","Default Grid Snap":"false","Grid Snap Width":"48","Grid Snap Height":"48"}},
{"name":"YEP_X_ExtDoodadPack1","status":true,"description":"v1.01 (Requires YEP_GridFreeDoodads.js) Adds extra options\nto the Grid-Free Doodads plugin's doodad settings.","parameters":{}},
{"name":"========================","status":true,"description":"","parameters":{}},
{"name":"TitleVideo","status":true,"description":"Adds a video above the static image for the main title screen.","parameters":{"Video Name":"Elevator_Final","Muted":"no","Width":"auto","Height":"auto","X":"0","Y":"0","Loop":"yes","Playback Rate":"1.0","Blend Mode":"NORMAL","Opacity":"1.0","Tint":"0xffffff","Loop Start":"0","Loop End":"end","Debug":"no"}},
{"name":"========================","status":true,"description":"","parameters":{}}
];

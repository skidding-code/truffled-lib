local characterNames = {'dad', 'boyfriend'}

luaDebugMode = true

local cameraDisplacement = 10
local camBasePos = {0, 0}
local camBetterFollowLerp = 0.1
local useMustHitSection = true
local charToFocus = 'dad'
local currentCamOffset = {0, 0}

local shouldFocus = true

local yesOverlay = false

function onCreatePost()
    setProperty("comboGroup.visible", false)
    setProperty('isCameraOnForcedPos', true)
    createInstance('cam_dad', 'flixel.FlxCamera', {})
    createInstance('cam_boyfriend', 'flixel.FlxCamera', {screenWidth / 2, 0})

    createInstance('camPoint_dad', 'flixel.FlxObject', {0, 0, 1, 1})
    createInstance('camPoint_boyfriend', 'flixel.FlxObject', {0, 0, 1, 1})

    for i = 1, #characterNames do
        local camName = 'cam_' .. characterNames[i]
        setProperty(camName .. '.bgColor', FlxColor('000000'))
        setProperty(camName .. '.visible', false)
        callMethod(camName .. '.setSize', {screenWidth / 2, screenHeight})
        runHaxeCode([[
            var cam = game.variables.get("]] .. camName .. [[");
            FlxG.cameras.add(cam);
        ]])
    end

    setProperty('cam_dad.x', -screenWidth)
    setProperty('cam_boyfriend.x', screenWidth)

    for i = 1, #characterNames do
        runHaxeCode([[
            var cam = game.variables.get("cam_]] .. characterNames[i] .. [[");
            var point = game.variables.get("camPoint_]] .. characterNames[i] .. [[");
            cam.follow(point, game.camGame.style, 0.1);
        ]])
    end

    runHaxeCode([[
    FlxG.cameras.remove(game.camHUD, false);
    FlxG.cameras.add(game.camHUD, false);

    FlxG.cameras.remove(game.camOther, true);
    FlxG.cameras.add(game.camOther, true);
    ]])

    makeLuaSprite("jellybeanGradient", "jellybeanGradient", 0, 0)
    scaleObject("jellybeanGradient", 1.5, 1.5, true)
    addLuaSprite("jellybeanGradient")

    createInstance('checkers', 'flixel.addons.display.FlxBackdrop', {nil, 0x11})
    loadGraphic('checkers', 'checkers')
    scaleObject("checkers", 1, 1)
    setObjectOrder("checkers", 1)
    addInstance('checkers')

    makeLuaSprite("trollGradient", "trollGradient", -2000, 0)
    scaleObject("trollGradient", 1.5, 1.5, true)
    addLuaSprite("trollGradient")

    makeLuaSprite("skelebg", "skelebg", -1700, 0)
    scaleObject("skelebg", 1.65, 1.5, true)
    setProperty("skelebg.alpha", 0)
    addLuaSprite("skelebg")

    makeAnimatedLuaSprite("bg_skele", "bg_skele", -1500, 500)
    addAnimationByPrefix("bg_skele", "idle", "bg skele boppin0", 24, true)
    setProperty("bg_skele.alpha", 0)
    addLuaSprite("bg_skele")

    makeLuaSprite("blackOut", "", 0, 0)
    setObjectCamera("blackOut", 'hud')
    makeGraphic("blackOut", screenWidth + 200, screenHeight + 200, "000000")
    setProperty("blackOut.alpha", 0)
    screenCenter("blackOut")
    addLuaSprite("blackOut")

    makeLuaSprite("lastOverlay", "lastOverlay", 0, 0)
    setObjectCamera("lastOverlay", 'hud')
    setProperty("lastOverlay.alpha", 0)
    screenCenter("lastOverlay")
    setBlendMode("lastOverlay", 'add')
    addLuaSprite("lastOverlay", true)

    setProperty('boyfriend.x', getProperty('jellybeanGradient.x') + getProperty('jellybeanGradient.width') / 2 -
        getProperty('boyfriend.width') / 2 - 150)
    setProperty('boyfriend.y',
        getProperty('jellybeanGradient.y') + getProperty('jellybeanGradient.height') / 2 -
            getProperty('boyfriend.height') / 2 - 60)

    setProperty('dad.x',
        getProperty('trollGradient.x') + getProperty('trollGradient.width') / 2 - getProperty('dad.width') / 2 + 250)
    setProperty('dad.y', getProperty('trollGradient.y') + getProperty('trollGradient.height') / 2 -
        getProperty('dad.height') / 2 + 50)

    runHaxeCode([[
    game.camGame.target = null;
    ]]);

    runHaxeCode([[
	var shit = game.getLuaObject("checkers", true);
	var camGame = FlxG.camera;
	var camBoyfriend = game.variables.get("cam_boyfriend");
	shit.cameras = [camGame, camBoyfriend];
    ]]);

end

function onSongStart()
end

function getDisplacement(charName)
    local animName = getProperty(charName .. '.animation.curAnim.name')
    if animName == 'singLEFT' then
        return {-cameraDisplacement, 0}
    elseif animName == 'singDOWN' then
        return {0, cameraDisplacement}
    elseif animName == 'singUP' then
        return {0, -cameraDisplacement}
    elseif animName == 'singRIGHT' then
        return {cameraDisplacement, 0}
    else
        return {0, 0}
    end
end

function onBeatHit()
    if yesOverlay then
        setProperty("lastOverlay.alpha", 2)
        doTweenAlpha("lastOverlay", "lastOverlay", 0.01,
            getPropertyFromClass('backend.Conductor', 'stepCrochet') / 1000 * 4, "linear")
    end
end

function onMoveCamera(char)
    if not useMustHitSection then
        charToFocus = char

        if char == 'boyfriend' then
            camBasePos = {getProperty('jellybeanGradient.x') + getProperty('jellybeanGradient.width') / 2,
                          getProperty('jellybeanGradient.y') + getProperty('jellybeanGradient.height') / 2}
        elseif char == 'dad' then
            camBasePos = {getProperty('trollGradient.x') + getProperty('trollGradient.width') / 2,
                          getProperty('trollGradient.y') + getProperty('trollGradient.height') / 2}
        end
    end
end

local timeElapsed = 0;

function onUpdate(elapsed)
    local oldFramesElapsed = math.floor(timeElapsed / (1 / 60));
    timeElapsed = timeElapsed + elapsed;
    local framesElapsed = math.floor(timeElapsed / (1 / 60));

    if oldFramesElapsed ~= framesElapsed then
        setProperty('checkers.x', getProperty("checkers.x") + 1)
        setProperty('checkers.y', getProperty("checkers.y") + 1)
    end
    if useMustHitSection then
        if mustHitSection then
            camBasePos = {getProperty('jellybeanGradient.x') + getProperty('jellybeanGradient.width') / 2,
                          getProperty('jellybeanGradient.y') + getProperty('jellybeanGradient.height') / 2}
        else
            camBasePos = {getProperty('trollGradient.x') + getProperty('trollGradient.width') / 2,
                          getProperty('trollGradient.y') + getProperty('trollGradient.height') / 2}
        end
    end

    local mftarget = useMustHitSection and (mustHitSection and 'boyfriend' or 'dad') or charToFocus

    local targetDisplacement = getDisplacement(mftarget)
    currentCamOffset[1] = lerp(currentCamOffset[1], targetDisplacement[1], camBetterFollowLerp)
    currentCamOffset[2] = lerp(currentCamOffset[2], targetDisplacement[2], camBetterFollowLerp)

    local fuckx = math.floor(camBasePos[1] + currentCamOffset[1] - getProperty('camGame.width') / 2)
    local fucky = math.floor(camBasePos[2] + currentCamOffset[2] - getProperty('camGame.height') / 2)

    if shouldFocus then
        setProperty('camGame.scroll.x', fuckx)
        setProperty('camGame.scroll.y', fucky)
    end

    local fuckdad = getDisplacement('dad')
    setProperty('camPoint_dad.x', getProperty('trollGradient.x') + getProperty('trollGradient.width') / 2 + fuckdad[1])
    setProperty('camPoint_dad.y', getProperty('trollGradient.y') + getProperty('trollGradient.height') / 2 + fuckdad[2])

    local fuckingbf = getDisplacement('boyfriend')
    setProperty('camPoint_boyfriend.x',
        getProperty('jellybeanGradient.x') + getProperty('jellybeanGradient.width') / 2 + fuckingbf[1])
    setProperty('camPoint_boyfriend.y',
        getProperty('jellybeanGradient.y') + getProperty('jellybeanGradient.height') / 2 + fuckingbf[2])

end

function lerp(a, b, t)
    return a + (b - a) * t
end

function onGameOverStart()
    close()
end

function onEvent(eventName, value1, value2)
    if eventName == '' then
        if value1 == 'splitYes' then
            setProperty('cam_dad.visible', true)
            setProperty('cam_boyfriend.visible', true)

            setProperty('cam_dad.alpha', 1)
            setProperty('cam_boyfriend.alpha', 1)

            doTweenX('heyfuckingdadcam', 'cam_dad', 0,
                getPropertyFromClass('backend.Conductor', 'stepCrochet') / 1000 * 8, 'expoOut');
            doTweenX('heyfuckingblueballcam', 'cam_boyfriend', screenWidth / 2,
                getPropertyFromClass('backend.Conductor', 'stepCrochet') / 1000 * 8, 'expoOut');
        elseif value1 == 'splitNo' then
            doTweenX('FUCKOFFDAD', 'cam_dad', -screenWidth / 2 - 200,
                getPropertyFromClass('backend.Conductor', 'stepCrochet') / 1000 * 4, 'quadIn');
            doTweenX('FUCKOFFBLUEFUCKINGBALLS', 'cam_boyfriend', screenWidth + 200,
                getPropertyFromClass('backend.Conductor', 'stepCrochet') / 1000 * 4, 'quadIn');
        elseif value1 == 'camstop' then
            runHaxeCode('game.camGame.target = null;')
            shouldFocus = true
        elseif value1 == 'camyes' then
            runHaxeCode('game.camGame.target = game.camFollow;')
            shouldFocus = false
        elseif value1 == 'ohthats' then
            yesOverlay = true
        elseif value1 == 'doneee' then
            yesOverlay = false
        end

    end
end


function onGameOverStart()
    close()
end
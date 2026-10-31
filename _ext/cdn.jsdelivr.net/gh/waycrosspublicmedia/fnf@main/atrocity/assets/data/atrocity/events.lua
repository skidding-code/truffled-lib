local forTest = false -- if you set this to true, cutscene would nt play

local hudList = {"healthBar", "iconP1", "iconP2", "scoreTxt", "timeBar", "timeTxt", "timeBarBG"}
local timeList = {"timeBar", "timeTxt", "timeBarBG"}

function onCreatePost()
    addCharacterToList("gskeleton", "dad")
    if not forTest then
        setProperty("camGame.alpha", 0.001)

        for i, v in ipairs(hudList) do
            setProperty(v .. ".alpha", 0.001)
        end

        for i, v in ipairs(timeList) do
            setProperty(v .. ".visible", false)
        end
    end
end

function onSongStart()
    if not forTest then

        makeVideoSprite("intro", "intro", -335, -200, "hud", false)

        setObjectCamera("intro", "hud")

        scaleObject("intro", 0.7, 0.7)
    end
    for i = 0, 7 do
        if not downscroll then
            noteTweenY("byeNotes" .. i, i, -300, 1, "expoIn")
        else
            noteTweenY("byeNotes" .. i, i, 1200, 1, "expoIn")
        end
    end
end

function onTweenCompleted(tag, vars)
    for i = 0, 7 do
        if tag == "byeNotes" .. i then
            noteTweenAlpha("byeAlpha" .. i, i, 0, 0.01, "linear")
            if not downscroll then
                noteTweenY("heyNotes" .. i, i, 50, 1, "expoOut")
            else
                noteTweenY("heyNotes" .. i, i, 560, 1, "expoOut")
            end
        end
    end

    for i = 0, 7 do
        if tag == "byeNotesaa" .. i then
            noteTweenAlpha("byeAlphaaa" .. i, i, 0, 0.01, "linear")
        end
    end
end

function onEvent(event, value1, value2, strumTime)
    if event == '' then
        if value1 == 'flashlol' then
            cameraFlash("game", "white", 1, true)
        end
        if value1 == 'idknosplit' then
            setProperty('cam_dad.alpha', 0)
            setProperty('cam_boyfriend.alpha', 0)
        end
        if value1 == 'noteHey' then
            for i = 0, 7 do
                noteTweenAlpha("heyAlpha" .. i, i, 1, 2, "expoOut")
            end
        end
        if value1 == 'start' then
            setProperty("intro.visible", false)
            setProperty("camGame.alpha", 1)
            for i, v in ipairs(hudList) do
                setProperty(v .. ".alpha", 1)
            end

            for i, v in ipairs(timeList) do
                setProperty(v .. ".visible", true)
            end
            cameraFlash("game", "white", 1, true)
        end

        if value1 == 'omgsmoothshit' then
            setProperty("cameraSpeed", 100)

            doTweenAlpha('byebtich', 'cam_dad', 0, 0.01, 'linear')
            doTweenAlpha('byebf', 'cam_boyfriend', 0, 0.01, 'linear')

            setProperty("blackOut.alpha", 1)

            setProperty("defaultCamZoom", 1)

            doTweenZoom("idkzoom", "camGame", 1, 0.01, "linear")

            setProperty("camFollow.x", -1200)
            setProperty("camFollow.y", 500)
        end
        if value1 == 'ooo' then
            setProperty("cameraSpeed", 1.5)
            doTweenAlpha("blackOut", "blackOut", 0, 4, "linear")
            startTween('cameralol', 'camFollow', {
                x = -700,
                y = 500
            }, 15, {
                ease = 'linear'
            })
        end
        if value1 == 'moresmooth' then
            cancelTween("cameralol")
            setProperty("cameraSpeed", 10000)

            setProperty("blackOut.alpha", 1)

            setProperty("defaultCamZoom", 1.2)

            doTweenZoom("idkzoom", "camGame", 1.2, 0.01, "linear")

            setProperty("camFollow.x", 1300)
            setProperty("camFollow.y", 540)
        end
        if value1 == 'oooo' then
            setProperty("cameraSpeed", 1.5)
            doTweenAlpha("blackOut", "blackOut", 0, 4, "linear")
            startTween('cameralol', 'camFollow', {
                x = 500,
                y = 540
            }, 15, {
                ease = 'linear'
            })
        end
        if value1 == 'hey' then
            cameraFlash("game", "white", 1.5, true)
            cancelTween("cameralol")
            setProperty("cameraSpeed", 1.5)
            doTweenAlpha('byebtich', 'cam_dad', 1, 0.01, 'linear')
            doTweenAlpha('byebf', 'cam_boyfriend', 1, 0.01, 'linear')
            setProperty("defaultCamZoom", 1)
            doTweenZoom("idkzoom", "camGame", 1, 0.01, "linear")
        end
        if value1 == 'scary' then
            setProperty("cameraSpeed", 100)

            doTweenAlpha('byebtich', 'cam_dad', 0.0001, 0.01, 'linear')
            doTweenAlpha('byebf', 'cam_boyfriend', 0.001, 0.01, 'linear')

            setProperty("blackOut.alpha", 1)

            for i, v in ipairs(hudList) do
                doTweenAlpha(v, v, 0, 2, "linear")
            end

            for i, v in ipairs(timeList) do
                setProperty(v .. ".visible", false)
            end

            for i = 0, 7 do
                if not downscroll then
                    noteTweenY("byeNotesa" .. i, i, -300, 1, "expoIn")
                else
                    noteTweenY("byeNotesa" .. i, i, 1200, 1, "expoIn")
                end
            end
        end
        if value1 == 'wowchange' then
            setProperty("camGame.alpha", 0)
            triggerEvent("Change Character", "Dad", "skeleton")
            setProperty("bg_skele.alpha", 1)
            setProperty("skelebg.alpha", 1)
            setProperty("trollGradient.alpha", 0)

            setProperty('dad.x', getProperty('trollGradient.x') + getProperty('trollGradient.width') / 2 -
                getProperty('dad.width') / 2)
            setProperty('dad.y', getProperty('trollGradient.y') + getProperty('trollGradient.height') / 2 -
                getProperty('dad.height') / 2)
        end
        if value1 == 'heythere' then

            doTweenAlpha("blackOut", "blackOut", 0, 6, "linear")
            doTweenAlpha("cam_boyfriend", "cam_boyfriend", 1, 6, "linear")

            for i = 0, 7 do
                if not downscroll then
                    noteTweenY("heyNotes" .. i, i, 50, 1, "expoOut")
                else
                    noteTweenY("heyNotes" .. i, i, 560, 1, "expoOut")
                end
            end
        end
        if value1 == 'omgsans' then

            doTweenAlpha("cam_dad", "cam_dad", 1, 1, "linear")
        end
        if value1 == 'cool' then
            triggerEvent("Change Character", "Dad", "gskeleton")
            setProperty('dad.x', getProperty('trollGradient.x') + getProperty('trollGradient.width') / 2 -
                getProperty('dad.width') / 2)
            setProperty('dad.y', getProperty('trollGradient.y') + getProperty('trollGradient.height') / 2 -
                getProperty('dad.height') / 2)
            cameraFlash("hud", "yellow", 0.2, true)
        end
        if value1 == 'ohthats' then
            cameraFlash("hud", "white", 1.5, true)
            for i, v in ipairs(hudList) do
                setProperty(v .. ".alpha", 1)
            end

            for i, v in ipairs(timeList) do
                setProperty(v .. ".visible", true)
            end
        end
        if value1 == 'doneee' then
            for i = 0, 7 do
                if not downscroll then
                    noteTweenY("byeNotesaa" .. i, i, -300, 1, "quadIn")
                else
                    noteTweenY("byeNotesaa" .. i, i, 1200, 1, "quadIn")
                end
            end

            doTweenAlpha("blackOut", "blackOut", 1, 3, "linear")

            for i, v in ipairs(hudList) do
                doTweenAlpha(v .. "sa", v, 0, 2, "linear")
            end

            for i, v in ipairs(timeList) do
                setProperty(v .. ".visible", false)
            end
        end
        if value1 == 'lmfao' then
            removeLuaSprite("bg_skele")
            removeLuaSprite("skelebg")
            triggerEvent("Change Character", "Dad", "stinkybutt")
            setProperty("trollGradient.alpha", 1)
            doTweenAlpha("cam_boyfriend", "cam_boyfriend", 0.01, 0.01, "linear")
            doTweenAlpha("cam_dad", "cam_dad", 0.01, 0.01, "linear")

            setProperty('dad.x', getProperty('trollGradient.x') + getProperty('trollGradient.width') / 2 -
                getProperty('dad.width') / 2 + 250)
            setProperty('dad.y', getProperty('trollGradient.y') + getProperty('trollGradient.height') / 2 -
                getProperty('dad.height') / 2 + 50)

        end
        if value1 == 'wtf' then
            setProperty("camGame.alpha", 1)
            doTweenAlpha("blackOut", "blackOut", 0, 0.001, "linear")

        end
    end
end

function onGameOverStart()
    close()
end

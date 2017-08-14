let cubrism = (function() {
    var background
    var background_inner
    var started = false;
    var gameInterval;
    var enemy = {
        enemies: [],
        act: function ()
        {
            addEnemy()
            actEnemy()
        },
        damage: function (damage, i)
        {
            enemy.enemies[i].health -= 25;
            if (enemy.enemies[i].health <= 0)
            {
                score += 100;
                enemy.enemies[i].alive = false;
            }

        },
        health: 100
    }
    var score = 0;
    var player = {
        img: new Image(),
        size: 0,
        x: 0,
        y: 0,
        shooting: false,
        lastDamageTime: 0,
        act: function ()
        {
            playerFire()
            playerMoveShots()
            playerSetVelocity()
            playerMove()
            playerShieldRecharge()
        },
        cannon : new Image(),
        angle : Math.PI/2,
        damage : function (dam, t)
        {
            var time = new Date().getTime()
            var d = false;
            if (t == 0 && player.lastHitTime + 1000 <= time){
                d = true;
                player.lastDamageTime = time;
                player.lastHitTime = time;
            }
            else if (t == 1){
                player.lastDamageTime = time;
                d = true;
            }
            if(d == true)
            {
                if (player.shield >= 25)
                {
                    player.shield -= dam;
                }
                else if (player.shield > 0)
                {
                    let hDam = dam - player.shield;
                    player.shield = 0;
                    player.health -= hDam;
                }
                else {
                    player.health -= dam;
                }
                updateHealthBars()
                if (player.health <= 0) {
                    endGame()
                }
            }
        },
        placeCannon : function()
        {
            ctx.translate( player.x+player.size/2, player.y+player.size/2 );
            ctx.rotate(player.angle);
            ctx.drawImage(player.cannon, 0, 0, player.cannon.width, player.cannon.height,
                -player.size*1.5/2, -player.size*1.5/2, player.size*1.5, player.size*1.5);
            ctx.rotate(-player.angle);
            ctx.translate( -player.x-player.size/2, -player.y-player.size/2 );
        },
        shield: 100,
        health: 100,
        lastShotTime : 0,
        lastHitTime: 0,
        shots: [],
        botHealth: new Image(),
        topHealth: new Image(),
        botShield: new Image(),
        topShield: new Image()
        };
    player.topHealth.src = 'cubrism/healthBarTop.png';
    player.botHealth.src = 'cubrism/healthBarBottom.png';
    player.topShield.src = 'cubrism/shieldBarTop.png';
    player.botShield.src = 'cubrism/shieldBarBottom.png';
    player.cannon.src = 'cubrism/playerCannon.png';
    let playerShotImg = new Image();
    playerShotImg.src = 'cubrism/playerShot.png';
    let enemy0ShotImg = new Image();
    enemy0ShotImg.src = 'cubrism/enemy0Shot.png';
    let enemy0Img = new Image();
    enemy0Img.src = 'cubrism/enemy0.png';
    let enemy1Img = new Image();
    enemy1Img.src = 'cubrism/enemy1.png';
    let enemy25Img = new Image();
    enemy25Img.src = 'cubrism/enemy25.png';
    let enemy50Img = new Image();
    enemy50Img.src = 'cubrism/enemy50.png';
    let enemy75Img = new Image();
    enemy75Img.src = 'cubrism/enemy75.png';
    var mouse = {
        x: 0,
        y: 0
    }
    var keys = {
        l: false,
        r: false,
        u: false,
        d: false
    }
    var room = {
        img: new Image(),
        size: {
            x: 0,
            y: 0
        },
        x: 0,
        y: 0,
        xv: 0,
        yv: 0
    };
    var background = {
        img: new Image(),
        size: {
            x: 0,
            y: 0
        },
        px: 0,
        py: 0
    };
    var canv;
    window.onload = loadCubrism()
    function loadCubrism() {
        canv=document.getElementById("mf");
        ctx = canv.getContext("2d");
        player.img.src = 'cubrism/player.png'
        player.xv = 0
        player.yv = 0
        background.img.src = 'cubrism/background.jpg';
        background.img.onload = function(){
            room.img.src = 'cubrism/backgroundInner.jpg';
            room.img.onload = function(){
                resizeCanvas()
                window.addEventListener('resize', resizeCanvas, false);
                document.addEventListener("keydown",keyPush);
                }
            }
        }
    function resizeCanvas() {
        let width = $("#cubrism_canvas").width();
        let heigh = $("#cubrism_canvas").height();
        let oldRoomX = room.x;
        let oldRoomSizeX = room.size.x;
        let oldRoomY = room.y;
        let oldRoomSizeY = room.size.y;
        canv.width = width;
        canv.height = width * 9/16;
        //background.x = window.innerWidth*0.1;
        background.x = width * 0.05;
        background.y = 0;
        background.size.x = width * 0.9;
        background.size.y = background.size.x * 9/16;
        room.x = background.x + background.size.x * 0.1;
        room.y = background.y + background.size.y * 0.1;
        room.size.x = background.size.x * 0.8;
        room.size.y = background.size.y * 0.8;
        player.x = background.x + background.size.x * 0.5 - background.size.y * 0.05;
        player.y = background.y + background.size.y * 0.45;
        player.size = background.size.y * 0.075;
        for (var i = 0; i < enemy.enemies.length; i++)
        {
            enemy.enemies[i].size = background.size.y * 0.1;
            enemy.enemies[i].x = room.x + ((enemy.enemies[i].x- oldRoomX) * room.size.x / oldRoomSizeX);
            enemy.enemies[i].y = room.y + ((enemy.enemies[i].y - oldRoomY) * room.size.y / oldRoomSizeY);
        }
        ctx.drawImage(background.img, 0, 0, background.img.width, background.img.height,
            background.x, background.y, background.size.x, background.size.y);
        ctx.drawImage(room.img, 0, 0, room.img.width, room.img.height,
            room.x, room.y, room.size.x, room.size.y);
        ctx.drawImage(player.img, 0, 0, player.img.width, player.img.height,
            player.x, player.y, player.size, player.size);
        player.placeCannon();

    }
    function game ()
    {
        if ($(document).scrollTop() < $("#mf").offset().top +background.size.y &&
            $(document).scrollTop()+ $(window).height() > $("#mf").offset().top)
        {
            loadUI()
            player.act()
            enemy.act()
        }

    }
    function updateHealthBars()
    {
        ctx.drawImage(player.botHealth, 0, 0, player.botHealth.width, player.botHealth.height,
            room.x, background.y+background.size.y * 0.02, background.size.x * 0.25, background.size.y * 0.06);
        ctx.drawImage(player.botShield, 0, 0, player.botShield.width, player.botShield.height,
            room.x, background.y+background.size.y * 0.02, background.size.x * 0.25, background.size.y * 0.06);
        ctx.drawImage(player.topHealth, 0, 0, player.topHealth.width * (player.health/100), player.topHealth.height,
            room.x, background.y+background.size.y * 0.02, background.size.x * 0.25 * (player.health/100), background.size.y * 0.06);
        ctx.drawImage(player.topShield, 0, 0, player.topShield.width * (player.shield/100), player.topShield.height,
            room.x, background.y+background.size.y * 0.02, background.size.x * 0.25 * (player.shield/100), background.size.y * 0.06);
    }
    function loadUI()
    {
        ctx.drawImage(room.img, 0, 0, room.img.width, room.img.height,
            room.x, room.y, room.size.x, room.size.y);
    }
    function playerFire()
    {
        if (player.shooting == true)
        {
            var time = new Date().getTime()
            if (player.lastShotTime + 1000 <= time)
            {
                player.lastShotTime = time;
                playerShoot()
            }
            else {
                if (mouse.y - player.y + player.size/2 !=0 && mouse.x + player.size/2 - player.x != 0)
                {
                    let a = Math.atan((mouse.y - player.y + player.size/2 )/(mouse.x + player.size/2 - player.x));
                    if (mouse.x + player.size/2 - player.x < 0){a += Math.PI;}
                    else if (mouse.y - player.y + player.size/2  < 0){a += Math.PI*2;}
                    player.angle = a;
                }
            }
        }
    }
    function playerShoot()
    {
        var playerShot = {
            size: background.size.y * 0.025,
            x: player.x + player.size/2 - background.size.y * 0.0125,
            y: player.y + player.size/2 - background.size.y * 0.0125,
            destX: mouse.x,
            destY: mouse.y,
            angle: 0
        };
        let chx = playerShot.destX - playerShot.x
        let chy = playerShot.destY - playerShot.y
        playerShot.angle = Math.atan((playerShot.destY - playerShot.y)/(playerShot.destX - playerShot.x))
        if (chx < 0){playerShot.angle += Math.PI}
        else if (chy < 0){playerShot.angle += Math.PI*2;}
        player.angle = playerShot.angle;
        ctx.drawImage(playerShotImg, 0, 0, playerShotImg.width, playerShotImg.height,
            playerShot.x, playerShot.y, playerShot.size, playerShot.size);
        player.shots.push(playerShot);
    }
    function playerMoveShots()
    {
        for(var i = 0; i < player.shots.length; i++)
        {
            var remove = false;
            if (0.02 * room.size.y * Math.cos(player.shots[i].angle) + player.shots[i].x + player.shots[i].size > room.x + room.size.x
                || 0.02 * room.size.y * Math.cos(player.shots[i].angle)+ player.shots[i].x < room.x)
            {remove = true;}
            else {
                player.shots[i].x = 0.02 * room.size.y * Math.cos(player.shots[i].angle)+ player.shots[i].x
            }
            if (0.02 * room.size.y * Math.sin(player.shots[i].angle) + player.shots[i].y + player.shots[i].size > room.y + room.size.y
                || 0.02 * room.size.y * Math.sin(player.shots[i].angle) + player.shots[i].y < room.y)
            {remove = true;}
            else {
                player.shots[i].y = 0.02 * room.size.y * Math.sin(player.shots[i].angle)+ player.shots[i].y
            }
            if (remove == true)
            {
                player.shots.splice(i,1);
                i--;
            }
            else {
                var hit = false;
                for (var j = 0; j < enemy.enemies.length; j++)
                {
                    if (player.shots[i].x < enemy.enemies[j].x + enemy.enemies[j].size &&
                        player.shots[i].x + player.shots[i].size > enemy.enemies[j].x &&
                        player.shots[i].y < enemy.enemies[j].y + enemy.enemies[j].size &&
                        player.shots[i].y + player.shots[i].size > enemy.enemies[j].y)
                        {
                            enemy.damage(25, j);
                            hit = true;
                        }
                    }
                if (hit == true)
                {
                    player.shots.splice(i,1);
                    i--;
                }
                else {
                    ctx.drawImage(playerShotImg, 0, 0, playerShotImg.width, playerShotImg.height,
                        player.shots[i].x, player.shots[i].y, player.shots[i].size, player.shots[i].size);

                }
            }
        }
    }
    function playerMove()
    {
        if (player.x + room.size.y * 0.0075 * player.xv + player.size < room.x + room.size.x &&
            player.x + room.size.y * 0.0075 * player.xv > room.x)
        {
            player.x += room.size.y * 0.0075 * player.xv
        }
        else if (player.x + room.size.y * 0.0075 * player.xv + player.size < room.x + room.size.x){
            player.x = room.x
        }
        else {
            player.x = room.x + room.size.x - player.size
        }
        if (player.y + room.size.y * 0.0075 * player.yv + player.size < room.y + room.size.y &&
            player.y + room.size.y * 0.0075 * player.yv > room.y)
        {
            player.y += room.size.y * 0.0075 * player.yv
        }
        else if (player.y + room.size.y * 0.0075 * player.yv + player.size < room.y + room.size.y){
            player.y = room.y
        }
        else {
            player.y = room.y + room.size.y - player.size
        }
        ctx.drawImage(player.img, 0, 0, player.img.width, player.img.height,
            player.x, player.y, player.size, player.size);
        player.placeCannon();
    }
    function playerSetVelocity()
    {
        player.xv = 0;
        player.yv = 0;
        xvel = false
        yvel = false
        if (keys.l){player.xv -= 1; xvel = true;}
        if (keys.r){player.xv += 1; xvel = true;}
        if (keys.u){player.yv -= 1; yvel = true;}
        if (keys.d){player.yv += 1; yvel = true;}
        if (xvel == true && yvel == true)
        {
            player.xv *= 0.707106
            player.yv *= 0.707106
        }
    }
    function playerShieldRecharge()
    {
        var time = new Date().getTime()
        if (player.lastDamageTime + 1100 <= time && player.shield < 100) {
            player.shield += 0.25;
            ctx.drawImage(player.botShield, 0, 0, player.botShield.width, player.botShield.height,
                    room.x, background.y+background.size.y * 0.02, background.size.x * 0.25, background.size.y * 0.06);
            ctx.drawImage(player.topShield, 0, 0, player.topShield.width * (player.shield/100), player.topShield.height,
                room.x, background.y+background.size.y * 0.02, background.size.x * 0.25 * (player.shield/100), background.size.y * 0.06);

        }
    }
    function actEnemy()
    {
        for(var i = 0; i < enemy.enemies.length; i++)
        {
              if (enemy.enemies[i].alive == true)
              {
                var eImg = enemy0Img;
                if (enemy.enemies[i].type == 0)
                {
                    enemyTrackingMove(enemy.enemies[i]);
                }
                else if (enemy.enemies[i].type == 1)
                {
                    enemyRandomMove(enemy.enemies[i]);
                    enemyShoot(enemy.enemies[i]);
                    eImg = enemy1Img;
                }
                ctx.drawImage(eImg, 0, 0, eImg.width, eImg.height,
                        enemy.enemies[i].x, enemy.enemies[i].y, enemy.enemies[i].size, enemy.enemies[i].size);
                enemyAddDamageEffect(enemy.enemies[i]);
                enemyHitPlayer(enemy.enemies[i]);
                }
            else {
                let e = enemy.enemies[i];
                if (e.deathAlpha > 0)
                {
                    ctx.globalAlpha = e.deathAlpha;
                    enemy.enemies[i].deathAlpha -= 0.01;
                    if (e.type == 0)
                    {
                        ctx.drawImage(enemy0Img, 0, 0, enemy0Img.width, enemy0Img.height,
                                e.x, e.y, e.size, e.size);
                    }
                    else if (e.type == 1)
                    {
                        ctx.drawImage(enemy1Img, 0, 0, enemy1Img.width, enemy0Img.height,
                                e.x, e.y, e.size, e.size);
                    }
                    ctx.drawImage(enemy25Img, 0, 0, enemy25Img.width, enemy25Img.height,
                            e.x, e.y, e.size, e.size);
                    ctx.globalAlpha = 1.0;
                }
                else {
                    enemy.enemies.splice(i,1);
                }
            }
        }
    }
    function addEnemy()
    {
        if (enemy.enemies.length < 2)
        {
            let t = Math.floor(Math.random() * 2);

            var en = {
                type: t,
                size: player.size,
                x: player.x,
                y: player.y,
                mDamage: 25,
                rDamage: 25,
                tLoc: {
                    x: 0,
                    y:0
                },
                children : [],
                actTime : 0,
                health: 100,
                alive : true,
                deathAlpha : 1.0
            };
            if (t == 1){en.mDamage = 15;}
            var dist = 0;
            while (dist < room.size.x * 0.3)
            {
                en.x = room.x + (room.size.x-en.size) * Math.floor(Math.random() * 100)/100
                en.y = room.y + (room.size.y-en.size) * Math.floor(Math.random() * 100)/100
                dist = Math.sqrt(Math.pow((enemy.x - player.x),2)+Math.pow((enemy.x - player.x),2))
            }
            en.tLoc.x = en.x;
            en.tLoc.y = en.y;
            enemy.enemies.push(en);
        }
    }
    function enemyRandomMove(e)
    {
        if (Math.max(e.x,e.tLoc.x)-Math.min(e.x,e.tLoc.x)<= room.y * 0.01 && Math.max(e.y,e.tLoc.y)-Math.min(e.y,e.tLoc.y)<= room.y * 0.01)
        {
            e.tLoc.x = room.x + (room.size.x-e.size) * Math.floor(Math.random() * 100)/100
            e.tLoc.y = room.y + (room.size.y-e.size) * Math.floor(Math.random() * 100)/100
        }
        var angle = Math.atan((e.tLoc.y-e.y)/(e.tLoc.x-e.x))
        if ((e.tLoc.x-e.x) < 0){angle += Math.PI}
        else if ((e.tLoc.y-e.y) < 0){angle += Math.PI*2;}
        e.x = 0.0025 * room.size.y * Math.cos(angle) + e.x;
        e.y = 0.0025 * room.size.y * Math.sin(angle) + e.y;
    }
    function enemyTrackingMove(e)
    {
        var angle = Math.atan((player.y - e.y)/(player.x - e.x))
        if ((player.x - e.x) < 0){angle += Math.PI}
        else if ((player.y - e.y) < 0){angle += Math.PI*2;}
        e.x = 0.005 * room.size.y * Math.cos(angle) + e.x
        e.y = 0.005 * room.size.y * Math.sin(angle) + e.y
    }
    function enemyShoot(e)
    {
        var time = new Date().getTime()
        if (e.actTime + 1000 <= time)
        {
            e.actTime = time;
            var enemyShot = {
                size: background.size.y * 0.025,
                x: e.x + e.size/2 - background.size.y * 0.0125,
                y: e.y + e.size/2 - background.size.y * 0.0125,
                destX: player.x,
                destY: player.y,
                angle: 0
            };
            let chx = enemyShot.destX - enemyShot.x
            let chy = enemyShot.destY - enemyShot.y
            enemyShot.angle = Math.atan((enemyShot.destY - enemyShot.y)/(enemyShot.destX - enemyShot.x))
            if (chx < 0){enemyShot.angle += Math.PI}
            else if (chy < 0){enemyShot.angle += Math.PI*2;}
            e.children.push(enemyShot);
        }
        for(var i = 0; i < e.children.length; i++)
        {
            let shot = e.children[i]
            var remove = false;
            if (0.02 * room.size.y * Math.cos(shot.angle) + shot.x + shot.size > room.x + room.size.x
                || 0.02 * room.size.y * Math.cos(shot.angle)+ shot.x < room.x)
            {remove = true;}
            else { shot.x = 0.015 * room.size.y * Math.cos(shot.angle)+ shot.x}
            if (0.02 * room.size.y * Math.sin(shot.angle) + shot.y + shot.size > room.y + room.size.y
            || 0.02 * room.size.y * Math.sin(shot.angle) + shot.y < room.y)
            {remove = true;}
            else {shot.y = 0.015 * room.size.y * Math.sin(shot.angle)+ shot.y}
            if (remove == true)
            {
                e.children.splice(i,1);
                i--;
            }
            else {
                if (shot.x < player.x + player.size &&
                        shot.x + shot.size > player.x &&
                        shot.y < player.y + player.size &&
                        shot.y + shot.size > player.y)
                {
                    player.damage(e.rDamage, 1);
                    e.children.splice(i,1);
                    i--;
                }
                else {
                    ctx.drawImage(enemy0ShotImg, 0, 0, enemy0ShotImg.width, enemy0ShotImg.height,
                        shot.x, shot.y, shot.size, shot.size);

                }
            }
        }
    }
    function enemyHitPlayer(e)
    {
        if (player.x < e.x + e.size &&
            player.x + player.size > e.x &&
            player.y < e.y + e.size &&
            player.y + player.size > e.y)
            {
                player.damage(e.mDamage, 0);
            }
    }
    function enemyAddDamageEffect(e)
    {
        if(e.health <= 25)
        {
            ctx.drawImage(enemy25Img, 0, 0, enemy25Img.width, enemy25Img.height,
                    e.x, e.y, e.size, e.size);
        }
        else if(e.health <= 50)
        {
            ctx.drawImage(enemy50Img, 0, 0, enemy50Img.width, enemy50Img.height,
                    e.x, e.y, e.size, e.size);
        }
        else if(e.health <= 75)
        {
            ctx.drawImage(enemy75Img, 0, 0, enemy75Img.width, enemy75Img.height,
                    e.x, e.y, e.size, e.size);
        }
    }
    function startGame() {
        started = true;
        document.addEventListener("keyup",keyUp);
        window.addEventListener("keydown", function(e) {
            if (started == true)
            {
                if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                    e.preventDefault();
                }
            }
        }, false);
        updateHealthBars()
        gameInterval = setInterval(game,10);
        document.onmousedown = function(){player.shooting = true;};
        document.onmouseup = function(){player.shooting = false;};
        document.onmousemove = function(e){
            //var rect = canv.getBoundingClientRect()
            //mouse.x = e.pageX-rect.left;
            //mouse.y = e.pageY-rect.top;
            var canvasOffset=$("#mf").offset();
            var offsetX=canvasOffset.left;
            var offsetY=canvasOffset.top; // relationship bitmap vs. element for Y
            mouse.x = ( e.pageX - offsetX);   // scale mouse coordinates after they have
            mouse.y = (e.pageY - offsetY);
        }
      }
    function endGame() {
        started = false;
        player.health = 100;
        player.shield = 100;
        enemy.enemies.length = 0;
        clearInterval(gameInterval);
        ctx.drawImage(background.img, 0, 0, background.img.width, background.img.height,
            background.x, background.y, background.size.x, background.size.y);

    }
    function keyPush(evt) {
        player.xv = 0
        player.yv = 0
        if (started == true)
        {
            switch(evt.keyCode) {
                case 37:
                    keys.l = true;
                    break;
                case 38:
                    keys.u = true;
                    break;
                case 39:
                    keys.r = true;
                    break;
                case 40:
                    keys.d = true;
                    break;
                case 87:
                    keys.u = true;
                    break;
                case 68:
                    keys.r = true;
                    break;
                case 65:
                    keys.l = true;
                    break;
                case 83:
                    keys.d = true;
                    break;
            }
        }
        else {
            if (evt.keyCode == 32)
            {
                //console.log ($(document).scrollTop() + " " + ($("#mf").offset().top + background.size.y));
                //console.log ($(document).scrollBottom() + " " + $("#mf").offset().top+ background.size.y);
                if ($(document).scrollTop() < $("#mf").offset().top +background.size.y &&
                    $(document).scrollTop()+ $(window).height() > $("#mf").offset().top)
                {
                    startGame()
                }
            }
        }

    }
    function keyUp(evt) {
        switch(evt.keyCode) {
            case 37:
                keys.l = false;
                break;
            case 38:
                keys.u = false;
                break;
            case 39:
                keys.r = false;
                break;
            case 40:
                keys.d = false;
                break;
            case 87:
                keys.u = false;
                break;
            case 68:
                keys.r = false;
                break;
            case 65:
                keys.l = false;
                break;
            case 83:
                keys.d = false;
                break;
        }
    }
})()
window.onload = cubrism;

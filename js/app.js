(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function addLoadedClass() {
        window.addEventListener("load", (function() {
            if (document.querySelector("body")) setTimeout((function() {
                document.querySelector("body").classList.add("_loaded");
            }), 200);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    if (sessionStorage.getItem("preloader")) {
        if (document.querySelector(".preloader")) document.querySelector(".preloader").classList.add("_hide");
        document.querySelector(".wrapper").classList.add("_visible");
    }
    if (sessionStorage.getItem("money")) {
        if (document.querySelector(".check")) document.querySelectorAll(".check").forEach((el => {
            el.textContent = sessionStorage.getItem("money");
        }));
    } else {
        sessionStorage.setItem("money", 5e3);
        if (document.querySelector(".check")) document.querySelectorAll(".check").forEach((el => {
            el.textContent = sessionStorage.getItem("money");
        }));
    }
    if (document.querySelector(".game")) {
        if (+sessionStorage.getItem("money") >= 100) sessionStorage.setItem("current-bet", 100); else sessionStorage.setItem("current-bet", 0);
        document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
    }
    const preloader = document.querySelector(".preloader");
    const wrapper = document.querySelector(".wrapper");
    const window_width = document.documentElement.clientWidth;
    document.documentElement.clientHeight;
    function deleteMoney(count, block) {
        let money = +sessionStorage.getItem("money");
        sessionStorage.setItem("money", money - count);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.add("_delete-money")));
            document.querySelectorAll(block).forEach((el => el.textContent = sessionStorage.getItem("money")));
        }), 500);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_delete-money")));
        }), 1500);
    }
    function addRemoveClass(block, className, delay) {
        document.querySelector(block).classList.add(className);
        setTimeout((() => {
            document.querySelector(block).classList.remove(className);
        }), delay);
    }
    function noMoney(block) {
        document.querySelectorAll(block).forEach((el => el.classList.add("_no-money")));
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_no-money")));
        }), 1e3);
    }
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    function translToPercent(all, current) {
        return 100 * current / all;
    }
    let anim_items = document.querySelectorAll(".icon-anim img");
    function getRandomAnimate() {
        let number = getRandom(0, 4);
        let arr = [ "jump", "scale", "rotate", "rotate-2" ];
        let random_item = getRandom(0, anim_items.length);
        anim_items.forEach((el => {
            if (el.classList.contains("_anim-icon-jump")) el.classList.remove("_anim-icon-jump"); else if (el.classList.contains("_anim-icon-scale")) el.classList.remove("_anim-icon-scale"); else if (el.classList.contains("_anim-icon-rotate")) el.classList.remove("_anim-icon-rotate"); else if (el.classList.contains("_anim-icon-rotate-2")) el.classList.remove("_anim-icon-rotate-2");
        }));
        setTimeout((() => {
            anim_items[random_item].classList.add(`_anim-icon-${arr[number]}`);
        }), 100);
    }
    if (document.querySelector(".icon-anim img")) setInterval((() => {
        getRandomAnimate();
    }), 1e4);
    const prices = {
        colb: 50,
        glove: 35
    };
    if (document.querySelector(".main") && document.querySelector(".preloader").classList.contains("_hide")) {
        document.querySelector(".main").classList.add("_active");
        document.querySelector(".back-images").classList.add("_active");
        checkStartBonuses();
        drawPrices();
        drawCurrentCountBonuses();
    }
    function checkStartBonuses() {
        if (!sessionStorage.getItem("colb")) sessionStorage.setItem("colb", 0);
        if (!sessionStorage.getItem("glove")) sessionStorage.setItem("glove", 0);
    }
    function drawPrices() {
        document.querySelector(".glove-price").textContent = prices.glove;
        document.querySelector(".colb-price").textContent = prices.colb;
    }
    function drawCurrentCountBonuses() {
        if (+sessionStorage.getItem("colb") > 0) document.querySelectorAll(".colb-item__count").forEach((item => item.textContent = sessionStorage.getItem("colb"))); else document.querySelectorAll(".colb-item__count").forEach((item => item.textContent = "+"));
        if (+sessionStorage.getItem("glove") > 0) document.querySelectorAll(".glove-item__count").forEach((item => item.textContent = sessionStorage.getItem("glove"))); else document.querySelectorAll(".glove-item__count").forEach((item => item.textContent = "+"));
    }
    if (document.querySelector(".game") && document.querySelector(".preloader").classList.contains("_hide")) drawCurrentCountBonuses();
    var casinoAutoSpin;
    class Slot {
        constructor(domElement, config = {}) {
            Symbol.preload();
            this.currentSymbols = [ [ "1" ], [ "2" ], [ "4" ], [ "3" ], [ "5" ] ];
            this.nextSymbols = [ [ "1" ], [ "2" ], [ "4" ], [ "3" ], [ "5" ] ];
            this.container = domElement;
            this.reels = Array.from(this.container.getElementsByClassName("reel")).map(((reelContainer, idx) => new Reel(reelContainer, idx, this.currentSymbols[idx])));
            this.betButton = document.querySelector(".bet-box__button_max");
            this.betButton.addEventListener("click", (() => {
                if (+sessionStorage.getItem("money") >= 100) {
                    document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("money");
                    sessionStorage.setItem("current-bet", sessionStorage.getItem("money"));
                } else noMoney(".check");
            }));
            this.spinButton = document.querySelector(".bet-box__button_play");
            this.spinButton.addEventListener("click", (() => {
                if (+sessionStorage.getItem("money") >= +sessionStorage.getItem("current-bet")) this.spin(); else noMoney(".check");
            }));
            this.casinoAutoSpinCount = 0;
            this.autoSpinButton = document.querySelector(".bet-box__button_auto");
            this.autoSpinButton.addEventListener("click", (() => {
                var oThis = this;
                this.casinoAutoSpinCount = 0;
                if (+sessionStorage.getItem("money") > +sessionStorage.getItem("current-bet")) {
                    this.casinoAutoSpinCount++;
                    this.spin();
                }
                casinoAutoSpin = setInterval((function() {
                    oThis.casinoAutoSpinCount++;
                    if (oThis.casinoAutoSpinCount < 10 && +sessionStorage.getItem("money") >= +sessionStorage.getItem("current-bet")) oThis.spin(); else {
                        clearInterval(casinoAutoSpin);
                        noMoney(".check");
                    }
                }), 5500);
            }));
            if (config.inverted) this.container.classList.add("inverted");
            this.config = config;
        }
        spin() {
            this.currentSymbols = this.nextSymbols;
            this.nextSymbols = [ [ Symbol.random() ], [ Symbol.random() ], [ Symbol.random() ], [ Symbol.random() ], [ Symbol.random() ] ];
            this.onSpinStart(this.nextSymbols);
            return Promise.all(this.reels.map((reel => {
                reel.renderSymbols(this.nextSymbols[reel.idx]);
                return reel.spin();
            }))).then((() => this.onSpinEnd(this.nextSymbols)));
        }
        onSpinStart(symbols) {
            this.spinButton.classList.add("_hold");
            this.autoSpinButton.classList.add("_hold");
            this.betButton.classList.add("_hold");
            document.querySelector(".block-bet").classList.add("_hold");
            this.config.onSpinStart?.(symbols);
            removeActiveClass(".reel");
        }
        onSpinEnd(symbols) {
            this.spinButton.classList.remove("_hold");
            this.autoSpinButton.classList.remove("_hold");
            this.betButton.classList.remove("_hold");
            document.querySelector(".block-bet").classList.remove("_hold");
            this.config.onSpinEnd?.(symbols);
        }
    }
    class Reel {
        constructor(reelContainer, idx, initialSymbols) {
            this.reelContainer = reelContainer;
            this.idx = idx;
            this.symbolContainer = document.createElement("div");
            this.symbolContainer.classList.add("icons");
            this.reelContainer.appendChild(this.symbolContainer);
            this.animation = this.symbolContainer.animate([ {
                transform: "none",
                filter: "blur(0)"
            }, {
                filter: "blur(2px)",
                offset: .5
            }, {
                transform: `translateY(-${10 * Math.floor(this.factor) / (1 + 10 * Math.floor(this.factor)) * 100}%)`,
                filter: "blur(0)"
            } ], {
                duration: 1e3 * this.factor,
                easing: "ease-in-out"
            });
            this.animation.cancel();
            initialSymbols.forEach((symbol => this.symbolContainer.appendChild(new Symbol(symbol).img)));
        }
        get factor() {
            return 1 + Math.pow(this.idx / 2, 2);
        }
        renderSymbols(nextSymbols) {
            const fragment = document.createDocumentFragment();
            for (let i = 1; i < 1 + 10 * Math.floor(this.factor); i++) {
                const icon = new Symbol(i >= 10 * Math.floor(this.factor) - 2 ? nextSymbols[i - 10 * Math.floor(this.factor)] : void 0);
                fragment.appendChild(icon.img);
            }
            this.symbolContainer.appendChild(fragment);
        }
        spin() {
            const animationPromise = new Promise((resolve => this.animation.onfinish = resolve));
            const timeoutPromise = new Promise((resolve => setTimeout(resolve, 1e3 * this.factor)));
            this.animation.play();
            return Promise.race([ animationPromise, timeoutPromise ]).then((() => {
                if ("finished" !== this.animation.playState) this.animation.finish();
                const max = this.symbolContainer.children.length - 1;
                for (let i = 0; i < max; i++) this.symbolContainer.firstChild.remove();
            }));
        }
    }
    const cache = {};
    class Symbol {
        constructor(name = Symbol.random()) {
            this.name = name;
            if (cache[name]) this.img = cache[name].cloneNode(); else {
                this.img = new Image;
                this.img.src = `img/icons/icon-${name}.png`;
                cache[name] = this.img;
            }
        }
        static preload() {
            Symbol.symbols.forEach((symbol => new Symbol(symbol)));
        }
        static get symbols() {
            return [ "1", "2", "3", "4", "5" ];
        }
        static random() {
            return this.symbols[Math.floor(Math.random() * this.symbols.length)];
        }
    }
    const config = {
        inverted: false,
        onSpinStart: symbols => {},
        onSpinEnd: symbols => {
            console.log(symbols);
            console.log(+symbols[0]);
            console.log(+symbols[1]);
            console.log(+symbols[2]);
            console.log(+symbols[3]);
            console.log(+symbols[4]);
            if (+symbols[0] == +symbols[1] && +symbols[1] == +symbols[2] && +symbols[2] == +symbols[3] && +symbols[3] == +symbols[4]) {
                console.log("ВЫПАЛИ ВСЕ ОДИНАКОВЫЕ");
                addActiveClass(".reel", 0);
                addActiveClass(".reel", 1);
                addActiveClass(".reel", 2);
                addActiveClass(".reel", 3);
                addActiveClass(".reel", 4);
                heroFight();
                setTimeout((() => {
                    damageHero(3);
                }), 2500);
            } else if (+symbols[0] == +symbols[1] && +symbols[1] == +symbols[2] && +symbols[2] == +symbols[3]) {
                console.log("ВЫПАЛИ 4 ОДИНАКОВЫХ - 1, 2, 3, 4");
                addActiveClass(".reel", 0);
                addActiveClass(".reel", 1);
                addActiveClass(".reel", 2);
                addActiveClass(".reel", 3);
                heroFight();
                setTimeout((() => {
                    damageHero(2);
                }), 2500);
            } else if (+symbols[0] == +symbols[2] && +symbols[2] == +symbols[3] && +symbols[3] == +symbols[4]) {
                console.log("ВЫПАЛИ 4 ОДИНАКОВЫХ - 1, 3, 4, 5");
                addActiveClass(".reel", 0);
                addActiveClass(".reel", 2);
                addActiveClass(".reel", 3);
                addActiveClass(".reel", 4);
                heroFight();
                setTimeout((() => {
                    damageHero(2);
                }), 2500);
            } else if (+symbols[0] == +symbols[1] && +symbols[1] == +symbols[3] && +symbols[3] == +symbols[4]) {
                console.log("ВЫПАЛИ 4 ОДИНАКОВЫХ - 1, 2, 4, 5");
                addActiveClass(".reel", 0);
                addActiveClass(".reel", 1);
                addActiveClass(".reel", 3);
                addActiveClass(".reel", 4);
                heroFight();
                setTimeout((() => {
                    damageHero(2);
                }), 2500);
            } else if (+symbols[0] == +symbols[1] && +symbols[1] == +symbols[2] && +symbols[2] == +symbols[4]) {
                console.log("ВЫПАЛИ 4 ОДИНАКОВЫХ - 1, 2, 3, 5");
                addActiveClass(".reel", 0);
                addActiveClass(".reel", 1);
                addActiveClass(".reel", 2);
                addActiveClass(".reel", 4);
                heroFight();
                setTimeout((() => {
                    damageHero(2);
                }), 2500);
            } else if (+symbols[1] == +symbols[2] && +symbols[2] == +symbols[3] && +symbols[3] == +symbols[4]) {
                console.log("ВЫПАЛИ 4 ОДИНАКОВЫХ - 2, 3, 4, 5");
                addActiveClass(".reel", 1);
                addActiveClass(".reel", 2);
                addActiveClass(".reel", 3);
                addActiveClass(".reel", 4);
                heroFight();
                setTimeout((() => {
                    damageHero(2);
                }), 2500);
            } else if (+symbols[0] == +symbols[1] && +symbols[1] == +symbols[2]) {
                console.log("ВЫПАЛИ 3 ОДИНАКОВЫХ - 1, 2, 3");
                addActiveClass(".reel", 0);
                addActiveClass(".reel", 1);
                addActiveClass(".reel", 2);
                heroFight();
                setTimeout((() => {
                    damageHero(1);
                }), 2500);
            } else if (+symbols[0] == +symbols[1] && +symbols[1] == +symbols[3]) {
                console.log("ВЫПАЛИ 3 ОДИНАКОВЫХ - 1, 2, 4");
                console.log("ЭТОТ НЕ срабатывал");
                addActiveClass(".reel", 0);
                addActiveClass(".reel", 1);
                addActiveClass(".reel", 3);
                heroFight();
                setTimeout((() => {
                    damageHero(1);
                }), 2500);
            } else if (+symbols[0] == +symbols[1] && +symbols[1] == +symbols[4]) {
                console.log("ВЫПАЛИ 3 ОДИНАКОВЫХ - 1, 2, 5");
                addActiveClass(".reel", 0);
                addActiveClass(".reel", 1);
                addActiveClass(".reel", 4);
                heroFight();
                setTimeout((() => {
                    damageHero(1);
                }), 2500);
            } else if (+symbols[0] == +symbols[2] && +symbols[2] == +symbols[3]) {
                console.log("ВЫПАЛИ 3 ОДИНАКОВЫХ - 1, 3, 4");
                addActiveClass(".reel", 0);
                addActiveClass(".reel", 2);
                addActiveClass(".reel", 3);
                heroFight();
                setTimeout((() => {
                    damageHero(1);
                }), 2500);
            } else if (+symbols[0] == +symbols[2] && +symbols[2] == +symbols[4]) {
                console.log("ВЫПАЛИ 3 ОДИНАКОВЫХ - 1, 3, 5");
                addActiveClass(".reel", 0);
                addActiveClass(".reel", 2);
                addActiveClass(".reel", 4);
                heroFight();
                setTimeout((() => {
                    damageHero(1);
                }), 2500);
            } else if (+symbols[0] == +symbols[3] && +symbols[3] == +symbols[4]) {
                console.log("ВЫПАЛИ 3 ОДИНАКОВЫХ - 1, 4, 5");
                addActiveClass(".reel", 0);
                addActiveClass(".reel", 3);
                addActiveClass(".reel", 4);
                heroFight();
                setTimeout((() => {
                    damageHero(1);
                }), 2500);
            } else if (+symbols[1] == +symbols[2] && +symbols[2] == +symbols[3]) {
                console.log("ВЫПАЛИ 3 ОДИНАКОВЫХ - 2, 3, 4");
                addActiveClass(".reel", 1);
                addActiveClass(".reel", 2);
                addActiveClass(".reel", 3);
                heroFight();
                setTimeout((() => {
                    damageHero(1);
                }), 2500);
            } else if (+symbols[1] == +symbols[3] && +symbols[3] == +symbols[4]) {
                console.log("ВЫПАЛИ 3 ОДИНАКОВЫХ - 2, 4, 5");
                addActiveClass(".reel", 1);
                addActiveClass(".reel", 3);
                addActiveClass(".reel", 4);
                heroFight();
                setTimeout((() => {
                    damageHero(1);
                }), 2500);
            } else if (+symbols[2] == +symbols[3] && +symbols[3] == +symbols[4]) {
                console.log("ВЫПАЛИ 3 ОДИНАКОВЫХ - 3, 4, 5");
                addActiveClass(".reel", 2);
                addActiveClass(".reel", 3);
                addActiveClass(".reel", 4);
                heroFight();
                setTimeout((() => {
                    damageHero(1);
                }), 2500);
            } else {
                console.log("НИЧЕГО НЕ ВЫПАЛО - СОПЕРНИК НАНОСИТ УДАР");
                enemyFight();
                setTimeout((() => {
                    damageEnemy();
                }), 2500);
            }
        }
    };
    if (document.querySelector(".game")) {
        new Slot(document.getElementById("slot"), config);
    }
    function addActiveClass(block, index) {
        document.querySelectorAll(block)[index].classList.add("_active");
    }
    function removeActiveClass(block) {
        document.querySelectorAll(block).forEach((item => {
            if (item.classList.contains("_active")) item.classList.remove("_active");
        }));
    }
    const config_hero = {
        boxer: document.querySelector(".content__boxer_1"),
        image: document.querySelector(".content__boxer_1 img"),
        health: 2e3,
        count: 1,
        timerIdFight: false,
        timerIdBack: false,
        left: 35
    };
    const config_enemy = {
        boxer: document.querySelector(".content__boxer_2"),
        image: document.querySelector(".content__boxer_2 img"),
        health: 2e3,
        count: 1,
        timerIdFight: false,
        timerIdBack: false,
        right: 35
    };
    if (window_width > 800) {
        config_hero.left = 45;
        config_enemy.right = 45;
    }
    function heroFight() {
        document.querySelectorAll(".bet-box__button").forEach((item => item.classList.add("_hold")));
        config_hero.timerIdFight = setInterval((() => {
            config_hero.count++;
            config_hero.boxer.style.left = `${config_hero.count}%`;
            if (config_hero.count >= config_hero.left) {
                clearInterval(config_hero.timerIdFight);
                config_hero.image.setAttribute("src", "img/gif/boxer-1-fight.gif");
                heroBack();
                document.querySelectorAll(".bet-box__button").forEach((item => item.classList.remove("_hold")));
            }
        }), 50);
    }
    function heroBack() {
        setTimeout((() => {
            config_hero.image.setAttribute("src", "img/gif/boxer-1-stay.gif");
            config_hero.timerIdBack = setInterval((() => {
                config_hero.count--;
                config_hero.boxer.style.left = `${config_hero.count}%`;
                if (config_hero.count <= 1) clearInterval(config_hero.timerIdBack);
            }), 50);
        }), 1e3);
    }
    function enemyFight() {
        document.querySelectorAll(".bet-box__button").forEach((item => item.classList.add("_hold")));
        config_enemy.timerIdFight = setInterval((() => {
            config_enemy.count++;
            config_enemy.boxer.style.right = `${config_enemy.count}%`;
            if (config_enemy.count >= config_enemy.right) {
                clearInterval(config_enemy.timerIdFight);
                config_enemy.image.setAttribute("src", "img/gif/boxer-2-fight.gif");
                enemyBack();
                document.querySelectorAll(".bet-box__button").forEach((item => item.classList.remove("_hold")));
            }
        }), 50);
    }
    function enemyBack() {
        setTimeout((() => {
            config_enemy.image.setAttribute("src", "img/gif/boxer-2-stay.gif");
            config_enemy.timerIdBack = setInterval((() => {
                config_enemy.count--;
                config_enemy.boxer.style.right = `${config_enemy.count}%`;
                if (config_enemy.count <= 1) clearInterval(config_enemy.timerIdBack);
            }), 50);
        }), 1500);
    }
    function damageHero(level) {
        if (1 == level) {
            let num = getRandom(250, 350);
            createTextDamage(".content__boxer_2", num, 2);
            config_enemy.health = config_enemy.health - num;
        } else if (2 == level) {
            let num = getRandom(400, 500);
            createTextDamage(".content__boxer_2", num, 2);
            config_enemy.health = config_enemy.health - num;
        } else if (3 == level) {
            let num = getRandom(650, 800);
            createTextDamage(".content__boxer_2", num, 2);
            config_enemy.health = config_enemy.health - num;
        }
        if (config_enemy.health <= 0) document.querySelector(".header__current-health_2").style.width = `0%`; else document.querySelector(".header__current-health_2").style.width = `${translToPercent(2e3, config_enemy.health)}%`;
        checkGameOver();
    }
    function damageEnemy() {
        let num = getRandom(200, 400);
        createTextDamage(".content__boxer_1", num, 1);
        config_hero.health = config_hero.health - num;
        if (config_enemy.health <= 0) document.querySelector(".header__current-health_1").style.width = `0%`; else document.querySelector(".header__current-health_1").style.width = `${translToPercent(2e3, config_hero.health)}%`;
        checkGameOver();
    }
    function createTextDamage(block, damage, num) {
        let item = document.createElement("div");
        if (1 == num) {
            item.classList.add("content__text");
            item.classList.add("content__text_1");
        } else if (2 == num) {
            item.classList.add("content__text");
            item.classList.add("content__text_2");
        }
        item.textContent = `+${damage}`;
        document.querySelector(block).append(item);
        setTimeout((() => {
            item.remove();
        }), 2e3);
    }
    function checkGameOver() {
        if (config_enemy.health <= 0) setTimeout((() => {
            document.querySelector(".win").classList.add("_active");
        }), 1e3); else if (config_hero.health <= 0) setTimeout((() => {
            document.querySelector(".win").classList.add("_active");
        }), 1e3);
    }
    document.addEventListener("click", (e => {
        let targetElement = e.target;
        let bank = +sessionStorage.getItem("money");
        let bet = +sessionStorage.getItem("current-bet");
        if (targetElement.closest(".preloader__button")) {
            sessionStorage.setItem("preloader", true);
            preloader.classList.add("_hide");
            wrapper.classList.add("_visible");
            if (document.querySelector(".main") && document.querySelector(".preloader").classList.contains("_hide")) {
                document.querySelector(".main").classList.add("_active");
                document.querySelector(".back-images").classList.add("_active");
                checkStartBonuses();
                drawPrices();
                drawCurrentCountBonuses();
            }
        }
        if (targetElement.closest(".main__button_shop")) document.querySelector(".main__body").classList.add("_shop");
        if (targetElement.closest(".main__button-back")) document.querySelector(".main__body").classList.remove("_shop");
        if (targetElement.closest(".shop__button_glove ")) if (bank >= prices.glove) {
            deleteMoney(prices.glove, ".check");
            sessionStorage.setItem("glove", +sessionStorage.getItem("glove") + 1);
            setTimeout((() => {
                drawCurrentCountBonuses();
            }), 500);
            addRemoveClass(".shop__icon-glove", "_anim", 1e3);
            addRemoveClass(".shop__button_glove", "_hold", 1e3);
        } else noMoney(".check");
        if (targetElement.closest(".shop__button_colb")) if (bank >= prices.colb) {
            deleteMoney(prices.colb, ".check");
            sessionStorage.setItem("colb", +sessionStorage.getItem("colb") + 1);
            setTimeout((() => {
                drawCurrentCountBonuses();
            }), 500);
            addRemoveClass(".shop__icon-colb", "_anim", 1e3);
            addRemoveClass(".shop__button_colb", "_hold", 1e3);
        } else noMoney(".check");
        if (targetElement.closest(".block-bet__minus")) if (bet > 100) {
            sessionStorage.setItem("current-bet", bet - 100);
            document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
        }
        if (targetElement.closest(".block-bet__plus")) if (bank - 100 > bet) {
            sessionStorage.setItem("current-bet", bet + 100);
            document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
        } else noMoney(".check");
    }));
    window["FLS"] = true;
    isWebp();
    addLoadedClass();
})();
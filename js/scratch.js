const imgData = [
    "./images/BG/LP_03_scratch_01.png",
];

function brigeGo(numID, imgDataNum, autoCompletePercentage = 50) {
    var bridge = document.getElementById(`${numID}`),
        bridgeCanvas = bridge.getContext("2d"),
        brushRadius = (bridge.width / 100) * 5,
        img = new Image(),
        isCompleted = false, // 防止重複觸發完成事件
        triggerPercentage = autoCompletePercentage; // 可調整的觸發百分比

    if (brushRadius < 50) {
        brushRadius = 50;
    }

    img.onload = function () {
        bridgeCanvas.drawImage(img, 0, 0, bridge.width, bridge.height);
    };
    img.src = imgData[imgDataNum];

    function detectLeftButton(event) {
        if ("buttons" in event) {
            return event.buttons === 1;
        } else if ("which" in event) {
            return event.which === 1;
        } else {
            return event.button === 1;
        }
    }

    function getBrushPos(xRef, yRef) {
        var bridgeRect = bridge.getBoundingClientRect();
        return {
            x: Math.floor(
                ((xRef - bridgeRect.left) / (bridgeRect.right - bridgeRect.left)) *
                bridge.width
            ),
            y: Math.floor(
                ((yRef - bridgeRect.top) / (bridgeRect.bottom - bridgeRect.top)) *
                bridge.height
            ),
        };
    }

    function drawDot(mouseX, mouseY) {
        bridgeCanvas.beginPath();
        bridgeCanvas.arc(mouseX, mouseY, brushRadius, 0, 2 * Math.PI, true);
        bridgeCanvas.fillStyle = "#000";
        bridgeCanvas.globalCompositeOperation = "destination-out";
        bridgeCanvas.fill();
    }

    // 檢測刮除進度的函數
    function checkScratchProgress() {
        if (isCompleted) return; // 如果已經完成就不再檢測

        var imageData = bridgeCanvas.getImageData(0, 0, bridge.width, bridge.height);
        var pixels = imageData.data;
        var transparentPixels = 0;
        var totalPixels = bridge.width * bridge.height;

        // 計算透明像素數量（alpha值為0的像素）
        for (var i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
                transparentPixels++;
            }
        }

        var scratchedPercentage = (transparentPixels / totalPixels) * 100;
        
        // 使用可調整的百分比觸發自動完成
        if (scratchedPercentage >= triggerPercentage) {
            autoComplete();
        }
    }

    // 動態設置觸發百分比的函數
    function setAutoCompletePercentage(percentage) {
        if (percentage >= 0 && percentage <= 100) {
            triggerPercentage = percentage;
            console.log(`自動完成觸發百分比已設置為: ${percentage}%`);
        } else {
            console.warn("百分比必須在 0-100 之間");
        }
    }

    // 獲取當前觸發百分比
    function getAutoCompletePercentage() {
        return triggerPercentage;
    }

    // 獲取當前刮除進度
    function getCurrentProgress() {
        var imageData = bridgeCanvas.getImageData(0, 0, bridge.width, bridge.height);
        var pixels = imageData.data;
        var transparentPixels = 0;
        var totalPixels = bridge.width * bridge.height;

        for (var i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
                transparentPixels++;
            }
        }

        return Math.round((transparentPixels / totalPixels) * 100);
    }
    

    // 自動完成函數 - 漸進式清除效果
    function autoComplete() {
        if (isCompleted) return;
        
        isCompleted = true;
        
        // 漸進式清除效果
        var animationDuration = 800; // 動畫持續時間（毫秒）
        var startTime = Date.now();
        var circles = []; // 存儲擴散圓圈
        
        // 創建多個擴散點
        for (var i = 0; i < 8; i++) {
            circles.push({
                x: Math.random() * bridge.width,
                y: Math.random() * bridge.height,
                maxRadius: Math.max(bridge.width, bridge.height),
                startDelay: i * 100 // 每個圓圈延遲啟動
            });
        }
        
        function animateReveal() {
            var elapsed = Date.now() - startTime;
            var progress = Math.min(elapsed / animationDuration, 1);
            
            bridgeCanvas.globalCompositeOperation = "destination-out";
            
            // 繪製擴散圓圈
            circles.forEach(function(circle, index) {
                var circleStart = circle.startDelay;
                if (elapsed > circleStart) {
                    var circleProgress = Math.min((elapsed - circleStart) / (animationDuration - circleStart), 1);
                    // 使用緩動函數讓動畫更自然
                    var easeProgress = 1 - Math.pow(1 - circleProgress, 3);
                    var currentRadius = circle.maxRadius * easeProgress;
                    
                    bridgeCanvas.beginPath();
                    bridgeCanvas.arc(circle.x, circle.y, currentRadius, 0, 2 * Math.PI);
                    bridgeCanvas.fill();
                }
            });
            
            if (progress < 1) {
                requestAnimationFrame(animateReveal);
            } else {
                // 動畫完成後的回調
                console.log("刮刮樂已自動完成！");
                if (typeof onScratchComplete === 'function') {
                    onScratchComplete();
                }
            }
        }
        
        requestAnimationFrame(animateReveal);
    }

    bridge.addEventListener(
        "mousemove",
        function (e) {
            var brushPos = getBrushPos(e.clientX, e.clientY);
            var leftBut = detectLeftButton(e);
            if (leftBut == 1) {
                drawDot(brushPos.x, brushPos.y);
                // 每次刮除後檢測進度
                setTimeout(checkScratchProgress, 100); // 延遲檢測以提高性能
            }
        },
        false
    );

    bridge.addEventListener(
        "touchmove",
        function (e) {
            e.preventDefault();
            var touch = e.targetTouches[0];
            if (touch) {
                var brushPos = getBrushPos(touch.clientX, touch.clientY);
                drawDot(brushPos.x, brushPos.y);
                // 每次刮除後檢測進度
                setTimeout(checkScratchProgress, 100); // 延遲檢測以提高性能
            }
        },
        false
    );

    // 返回控制對象，讓外部可以調用相關函數
    return {
        setAutoCompletePercentage: setAutoCompletePercentage,
        getAutoCompletePercentage: getAutoCompletePercentage,
        getCurrentProgress: getCurrentProgress,
        autoComplete: autoComplete,
        // 新增：設置動畫速度
        setAnimationDuration: function(duration) {
            if (duration > 0) {
                animationDuration = duration;
            }
        }
    };
}

// 使用範例：
// 基本使用 - 預設50%自動完成
// var scratchCard1 = brigeGo('canvas1', 0);

// 自定義觸發百分比和動畫速度
// var scratchCard2 = brigeGo('canvas2', 0, 30);
// scratchCard2.setAnimationDuration(1200); // 設置1.2秒動畫時間

// 更多控制選項：
// scratchCard1.setAutoCompletePercentage(70); // 改為70%觸發
// scratchCard1.setAnimationDuration(500); // 設置0.5秒快速動畫
// console.log(scratchCard1.getCurrentProgress()); // 查看當前進度

// 可選：定義完成後的回調函數
function onScratchComplete() {
    // 在這裡添加刮刮樂完成後要執行的代碼
    // alert("恭喜！刮刮樂已完成！");
    const scratchShow = document.querySelector('.scratch_final')
    scratchShow.classList.add('scratch_final--show')
    setTimeout(()=>{
        window.scrollTo({ "behavior": "smooth", "top": scratchShow.offsetTop  })
    },500)
    // 例如：顯示獎品、跳轉頁面、播放動畫等
}
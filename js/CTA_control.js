// 取出當前的URL名稱，並提取最後一個名稱，當作pastr的名字
let pathArray = window.location.pathname.split('/').filter(function (part) {
    return part !== '';
});
let testName = pathArray[pathArray.length - 1]

/*------------------------------------*\
     調整區 開始  只需要更動此處即可
\*------------------------------------*/
let CTAdata = {
    variation: 1,//有3種模式請看PPT
    //輸入要開始出現的日期
    timeStart: "2024-4-22 10:00:00",
    //輸入結束的時間
    timeEnd: "2024-5-14 10:00:00",
    // 可以輸入網址 或 #ID
    href: "https://www.ozioproduct01.com/QQMOM24",
    // 有關媒體 lnk_流水編號【不可重複】
    lnkID: "lnk_99",
    // 有關媒體 跳轉參數用請改【_cta】後面的內容
    pastr: `${testName}_ctaQQMOM24`,
    //輸入【手機】呈現圖片
    spImg: "https://www.ozioproduct01.com/STA_CTA/clockCTA/img/cta-sp.gif",
    //輸入【電腦】呈現圖片
    pcImg: "https://www.ozioproduct01.com/STA_CTA/clockCTA/img/cta.gif",
}

/*------------------------------------*\
     調整區 結束  只需要更動此處即可
\*------------------------------------*/




// 建立CTA結構 S
const div = document.createElement("div");
div.setAttribute("id", "cta");

div.innerHTML = `
<a  href="${CTAdata.href}"id="${CTAdata.lnkID}" pastr="${CTAdata.pastr}">
<picture>
<source srcset="${CTAdata.spImg}" media="(max-width: 1000px)">
<img src="${CTAdata.pcImg}" alt="MDN">
</picture>
</a>
`;
document.body.appendChild(div);
// 建立CTA結構 E

// CTA的DOM宣告-控制元素
const cta = document.querySelector("#cta");


/*------------------------------------*\
     設定出現與結束日期
\*------------------------------------*/
var DateStart = new Date(CTAdata.timeStart.replace(/-/g, "/")).getTime();

var DateEnd = new Date(CTAdata.timeEnd.replace(/-/g, "/")).getTime();

var cta_now = new Date().getTime(); //當下的時間

DateCheck()
function DateCheck() {
    console.log("時間確認")
    //開始行為
    if (cta_now >= DateStart && cta_now <= DateEnd) {
        console.log("CTA進行中")
        resize();
        window.addEventListener("scroll", function () {

            //要在哪出現
            let afterFV = document.getElementById("ctaStart").offsetTop;
            //要在哪消失
            let offerClose = document.getElementById("ctaEnd").offsetTop;
            // let cta = document.querySelector(".cta");

            if (window.scrollY <= afterFV) {
                cta.style.display = "none";
            } else if (window.scrollY >= offerClose) {
                cta.style.display = "none";
            } else {
                cta.style.display = "block";
            }
        });
    }
    //結束行為
    else {
        console.log("時間結束 或 時間未到")
        cta.style.display = "none";
        return
    }
}
window.onresize = DateCheck;

// CTA樣式
function resize() {
    // 哪種樣式
    let show = CTAdata.variation;

    if (show == 1) {
        const width = window.innerWidth;
        if (width >= 1000) {
            cta.style.cssText = `
        position: fixed;
        right: 2%; 
        bottom: 2%;    
        width: 12%;
        display:none; 
        z-index:999`;
        } else {
            cta.style.cssText = ` 
        position: fixed; 
        width: 100% ;
        right: 0;
        bottom: 0;
        z-index:999`;
        }
    } else if (show == 2) {
        cta.style.cssText = `
        position: fixed;
        right: 50%;
        transform: translate(50%, 0%);
        bottom: 0%;
        width: 100%;
        max-width: 1000px;
        display: none;
            z-index: 999;`;
    } else if (show == 3) {
        cta.style.cssText = `
        position: fixed;
        right: 2%; 
        bottom: 2%;    
        width: clamp(125px ,11vw ,400px);
        display:none; 
        z-index:999`;
    }

}


const Link = document.querySelector("#cta a");
if (CTAdata.href.charAt(0) == "#") {
    Link.setAttribute("class", "scrollLink");
}


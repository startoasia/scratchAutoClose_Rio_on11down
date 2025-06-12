// 收合功能
function scrollShow(scrollID) {
    const show = document.querySelector(scrollID)
    show.classList.toggle("show")
}

// 彈跳視窗
function popUpShow(showElement) {
    document.body.style.overflow = "hidden";
    const show = document.querySelector(showElement);
    show.classList.add("popControl--active");
    document.body.style.overflow = "hidden";
    show.style.overflowY = "scroll";
}

function popUpClose(showElement) {
    document.body.style.overflow = "visible";
    const show = document.querySelector(showElement);
    show.classList.remove("popControl--active");
    document.body.style.overflow = "visible";
    show.style.overflowY = "hidden";
}

const FV_timeline = gsap.timeline({
    defaults: { duration: 1.5, ease: 'power1.inOut' }

})

gsap.set(['.thing_01', '.thing_03'], { opacity: 0, yPercent: 50, scale: 0.5 })

FV_timeline.to('.thing_01', { opacity: 1, yPercent: 0, scale: 1 })
    .to('.thing_03', { opacity: 1, yPercent: 0, scale: 1 }, "<0.25")
    .add(moveDown('.thing_06'))
    .add(moveDown('.thing_07'))
    .add(moveDown('.thing_08'))
    .add(moveScale(['.thing_09-1', '.thing_09-2', '.thing_09-3', '.card_pointer']), "0")



function moveDown(element) {
    gsap.set(element, { yPercent: -5 })
    const tl = gsap.timeline({
        defaults: { duration: 1.25, ease: 'power1.inOut' },
        yoyo: true, repeat: -1,
    });
    tl.to(element, { yPercent: 5 });
    return tl
}
function moveScale(element) {
    gsap.set(element, { scale: .95 })
    const tl = gsap.timeline({
        defaults: { duration: .75, ease: 'power1.inOut' },
        yoyo: true, repeat: -1,
    });
    tl.to(element, { scale: 1.05 });
    return tl
}



const cards = document.querySelectorAll('.card');
const card_pointer = document.querySelectorAll('.card_pointer');

const bg09 = document.querySelector('.LP_09');
let autoCardTimer = null;
let cardClicked = false;
let autoCardTriggered = false;

cards.forEach((card, ind) => {
    card.addEventListener('click', () => {
        card.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
        card_pointer[ind].style.opacity = "0";
        cardClicked = true; // 有點擊就設為 true
        if (autoCardTimer) {
            clearTimeout(autoCardTimer); // 點擊時清除計時器
        }
    });
});

window.addEventListener('scroll', () => {
    if (
        window.scrollY >= bg09.offsetTop &&
        !autoCardTriggered &&
        !cardClicked
    ) {
        autoCardTriggered = true;
        autoCardTimer = setTimeout(() => {
            if (!cardClicked) {
                autoChangeCard();
            }
        }, 3000); // 3秒沒動作才執行
    }
});

function autoChangeCard() {
    let i = 0;
    function flipNext() {
        if (i < cards.length) {
            cards[i].querySelector('.card-inner').style.transform = 'rotateY(180deg)';
            card_pointer[i].style.opacity = "0";
            i++;
            setTimeout(flipNext, 400); // 每張間隔0.4秒
        }
    }
    flipNext();
}

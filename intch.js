const sectionCategories = ["home", "games", "aboutme", "contact"];
let touchPos;
let currentId = 0;
let animLock = false;

const animateCSS = async (element, animation, prefix = 'animate__') => {
    const animationName = `${prefix}${animation}`;
    const node = element;
    node.classList.add(`${prefix}animated`, animationName);

    await new Promise(resolve => {
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });
};

function navbar(id) {
    const old = document.querySelector(".selected");
    old.classList.remove("selected");
    old.classList.add("link");

    const newLink = document.querySelector(`.${id}`);
    newLink.classList.add("selected");
    newLink.classList.remove("link");
}

function goToPage(id) {
    if (animLock || sections[currentId] === sections[id]) return;

    animLock = true;
    animateCSS(document.querySelector(".logo"), "flash");

    sections[currentId].style.setProperty('--animate-duration', '0.5s');
    const direction = id > currentId ? "Up" : "Down";

    animateCSS(sections[currentId], `backOut${direction}`).then(() => {
        sections[currentId].style.display = 'none';
        currentId = id;
        sections[currentId].style.display = 'block';
        sections[currentId].style.setProperty('--animate-duration', '0.5s');

        const category = sections[currentId].getAttribute("cat");
        const categoryIndex = sectionCategories.indexOf(category);

        if (categoryIndex !== -1) {
            navbar(sectionCategories[categoryIndex]);
        }

        animateCSS(sections[currentId], `backIn${direction}`).then(() => {
            animLock = false;
        });
    });
}

function changePage(next) {
    goToPage(currentId + next < 0 ? sections.length - 1 : currentId + next >= sections.length ? 0 : currentId + next);
}

document.ontouchstart = function (e) {
    touchPos = e.changedTouches[0].clientY;
}

document.ontouchmove = function (e) {
    let newTouchPos = e.changedTouches[0].clientY;
    if (newTouchPos > touchPos) {
        changePage(-1);
    }
    if (newTouchPos < touchPos) {
        changePage(1);
    }
}

addEventListener("wheel", (event) => {
    const next = event.deltaY > 0 ? 1 : -1;
    changePage(next);
});

const sections = document.querySelectorAll('section');

for (const section of sections) {
    section.style.display = section !== sections[currentId] ? 'none' : 'block';
}

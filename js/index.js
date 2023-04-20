
var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container')
}

function parseLrc(lrc) {
    var lines = lrc.split('\n')
    let lineArr = []
    for (i in lines) {
        let line = lines[i]
        let lineItem = line.split(']')
        let time = lineItem[0].substr(1)
        let words = lineItem[1]
        lineArr.push({ time: paeseTime(time), words })
    }
    return lineArr
}

function paeseTime(time) {
    let times = time.split(':')
    return +times[0] * 60 + +times[1]
}

// 正在播放的下表
function findIndex() {
    let curTime = doms.audio.currentTime//浏览器当前时间
    for (let i in lrcData) {
        // console.log(lrcData[i].time, curTime);
        if (lrcData[i].time > curTime) {
            return i - 1 < 0 ? 0 : i - 1
        }
    }
    // 没遍了没找到
    return lrcData.length - 1;
}

// 创建歌词元素li
function createLrcElement() {
    const frag = document.createDocumentFragment()//文档片段
    for (i in lrcData) {
        let li = document.createElement('li')
        li.textContent = lrcData[i].words
        frag.appendChild(li)//每次创建一个li, 修改了dom树。
    }
    doms.ul.appendChild(frag);
}


//设置ul的偏移量
function offsetUl() {
    // console.log(doms.ul.children[0]);
    let index = findIndex()//播放的第几句

    //播放第几句的li总高度
    let h1 = firstLiHeight * index + firstLiHeight / 2
    //偏移量
    let offset = h1 - containerHeight / 2

    // if (offset < 0) {
    //     offset = 0
    // }
    // if (offset > maxOffset) {
    //     offset = maxOffset
    // }
    // console.log(-offset);
    doms.ul.style.transform = `translateY(${offset < 0 ? -offset : -offset}px)`;
    // doms.ul.children[index].className = 'active'

    let activeDom = document.querySelector('.active')
    if (activeDom) {
        activeDom.classList.remove('active')
    }

    doms.ul.children[index].classList.add('active')

    // return offset
}

let lrcData = parseLrc(lrc)
createLrcElement()
// 容器高度
let containerHeight = doms.container.clientHeight;
// 第一个li的高度
let firstLiHeight = doms.ul.children[0].clientHeight;
// 最大偏移量
let maxOffset = doms.ul.clientHeight - containerHeight;

doms.audio.addEventListener('timeupdate', offsetUl)
document.getElementById('startButton').addEventListener('click', function() {
    const poem = document.getElementById('poemInput').value;
    const syllables = getSyllables(poem);
    createFallingSyllables(syllables);
});

function getSyllables(poem) {
    return poem.split('').filter(char => char.trim());
}

function createFallingSyllables(syllables) {
    const fallingArea = document.getElementById('fallingArea');
    fallingArea.innerHTML = '';  // Clear previous syllables

    // 일정 주기로 새로운 눈을 생성하는 함수 호출
    setInterval(() => {
        syllables.forEach(syllable => {
            const syllableElement = document.createElement('div');
            syllableElement.textContent = syllable;
            syllableElement.classList.add('syllable');
            syllableElement.style.left = `${Math.random() * (fallingArea.clientWidth - 20)}px`;
            syllableElement.style.top = `${Math.random() * -200}px`;
            syllableElement.style.fontFamily = "'Noto Sans KR', sans-serif";
            syllableElement.style.fontSize = `${Math.random() * (30 - 13) + 13}px`; // 폰트 크기를 13px 이상, 30px 이하로 설정
            syllableElement.style.color = getRandomColor();
            fallingArea.appendChild(syllableElement);

            animateSyllable(syllableElement);
        });
    }, 5000); // 5초마다 새로운 눈 생성

    fallingArea.addEventListener('mousemove', handleMouseMove);
}

function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function animateSyllable(element) {
    const fallingArea = element.parentElement;
    const fallingAreaHeight = fallingArea.clientHeight;
    let speed = 0.5; // 초기 속도
    let dx = Math.random() < 0.5 ? -1 : 1;

    function fall() {
        const top = parseFloat(element.style.top);
        const newTop = top + speed;
        speed += 0.005; // 점진적으로 속도 증가 (느리게 시작해서 천천히 빨라짐)

        if (newTop < fallingAreaHeight) {
            element.style.top = `${newTop}px`;
            const left = parseFloat(element.style.left);
            element.style.left = `${left + dx}px`;

            // 화면 경계를 벗어나지 않도록 조정
            if (left + dx < 0 || left + dx > fallingArea.clientWidth - 20) {
                dx = -dx;
            }

            requestAnimationFrame(fall);
        } else {
            // 음절이 화면 하단에 도달하면 멈추고 사라지는 애니메이션 시작
            element.style.top = `${fallingAreaHeight - element.clientHeight}px`;
            element.style.animation = 'melt 3s forwards';
            // 애니메이션이 끝난 후 제거
            element.addEventListener('animationend', () => {
                element.remove();
            });
        }
    }

    fall();

    element.addEventListener('mouseover', () => {
        // 글자가 터지는 효과
        element.style.transition = 'transform 0.2s, opacity 0.2s';
        element.style.transform = 'scale(0)';
        element.style.opacity = '0';
        setTimeout(() => {
            element.remove();
        }, 200); // 200ms 후에 요소 제거
    });
}

function handleMouseMove(event) {
    const fallingArea = event.currentTarget;
    const mouseX = event.clientX - fallingArea.offsetLeft;
    const mouseY = event.clientY - fallingArea.offsetTop;

    Array.from(fallingArea.children).forEach(syllableElement => {
        const rect = syllableElement.getBoundingClientRect();
        const elementX = rect.left - fallingArea.offsetLeft;
        const elementY = rect.top - fallingArea.offsetTop;

        const distance = Math.hypot(mouseX - elementX, mouseY - elementY);
        if (distance < 20) {
            // 마우스 포인터와 가까운 경우 방향 변경
            const dx = mouseX > elementX ? -2 : 2;
            syllableElement.style.left = `${parseFloat(syllableElement.style.left) + dx}px`;
        }
    });
}

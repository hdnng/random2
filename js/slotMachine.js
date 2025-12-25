document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.getElementById('spinBtn');
    const slotMachine = document.getElementById('slot-machine');
    const items = document.querySelector('.items');
    const overlay = document.getElementById('overlay');
    const resultImg = document.getElementById('result-img');
    const headerTitle = document.getElementById('header-title');
    const footerText = document.getElementById('footer-text');
    const totalItems = 9;
    const repeatCount = 12;

    function getItemWidth() {
        const firstItem = document.querySelector('.item');
        return firstItem.offsetWidth;
    }

    const products = [
        { img: '/img/result/KQ1.png', percentage: 12 },
        { img: '/img/result/KQ 2.png', percentage: 11 },
        { img: '/img/result/KQ 3.png', percentage: 11 },
        { img: '/img/result/KQ 4.png', percentage: 11 },
        { img: '/img/result/KQ 5.png', percentage: 11 },
        { img: '/img/result/KQ 6.png', percentage: 11 },
        { img: '/img/result/KQ 7.png', percentage: 11 },
        { img: '/img/result/KQ 8.png', percentage: 11 },
        { img: '/img/result/KQ 9.png', percentage: 11 }
    ];

    // repeat item
    const originalItems = items.innerHTML;
    items.innerHTML = originalItems.repeat(repeatCount);

    let isSpinning = false;

    function getRandomProductIndex() {
        const total = products.reduce((s, p) => s + p.percentage, 0);
        let r = Math.random() * total;
        for (let i = 0; i < products.length; i++) {
            r -= products[i].percentage;
            if (r <= 0) return i;
        }
        return 0;
    }

    function resetPosition(centerOffset, itemWidth) {
        items.style.transition = 'none';
        items.style.transform =
            `translateX(${-(totalItems * itemWidth * 4) + centerOffset}px)`;
        items.offsetHeight;
    }

    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;

        const itemWidth = getItemWidth();
        spinButton.style.display = 'none';
        slotMachine.style.opacity = 1;

        const winIndex = getRandomProductIndex();
        currentWinIndex = winIndex; // lưu lại để dùng khi kết thúc

        const slotWidth = slotMachine.offsetWidth;
        const centerOffset = (slotWidth - itemWidth) / 2;

        resetPosition(centerOffset, itemWidth);

        const loops = 9;
        const finalPosition =
            -(totalItems * itemWidth * loops) -
            (winIndex * itemWidth) +
            centerOffset;

        items.style.transition =
            'transform 10.5s cubic-bezier(0.08, 0.82, 0.17, 1)';
        items.style.transform = `translateX(${finalPosition}px)`;

        items.addEventListener('transitionend', () => {
            isSpinning = false;
            slotMachine.style.opacity = 0;
            headerTitle.style.display = 'none';
            footerText.style.display = 'none';

            const img = new Image();
            img.src = products[winIndex].img;

            img.onload = () => {
                resultImg.src = img.src;
                overlay.classList.remove('hidden');
            };
        }, { once: true });
    });

    overlay.addEventListener('click', () => {
        overlay.classList.add('hidden');
        spinButton.style.display = 'block';
        headerTitle.style.display = 'block';
        footerText.style.display = 'block';
        slotMachine.style.opacity = 0;
    });
});

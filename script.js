document.addEventListener('DOMContentLoaded', function() {
    const potions = [
        { name: '빨강포션', image: 'figs/red_p.png', recovery: 50 },
        { name: '주황포션', image: 'figs/orange_p.png', recovery: 150 },
        { name: '하얀포션', image: 'figs/white_p.png', recovery: 300 },
        { name: '똥똥이 핫도그', image: 'figs/hot.png', recovery: 400 },
        { name: '길쭉이 핫도그', image: 'figs/longdog.png', recovery: 500 },
        { name: '장어구이', image: 'figs/eel.png', recovery: 1000 },
        { name: '쭈쭈바', image: 'figs/zzozzo.png', recovery: 2000 },
        { name: '살살녹는 치즈', image: 'figs/cheese.png', recovery: 4000 },
        { name: '순록의 우유', image: 'figs/zzozzo.png', recovery: 5000 },
        { name: '엘릭서', image: 'figs/elic.png', recovery: 99999 }
    ];


document.getElementById('damageForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const job = parseInt(document.getElementById('job').value);
    const level = parseInt(document.getElementById('level').value);
    const str = parseInt(document.getElementById('str').value);
    const dex = parseInt(document.getElementById('dex').value);
    const int = parseInt(document.getElementById('int').value);
    const luk = parseInt(document.getElementById('luk').value);
    const pdd = parseInt(document.getElementById('pdd').value);
    const m_level = parseInt(document.getElementById('m_level').value);
    const m_pad = parseInt(document.getElementById('m_pad').value);

    const clac_D = (level, m_level) => {
        const a = 13.0 / (13.0 + (level - m_level));
        const b = 1.3;
        return level >= m_level ? a : b;
    };

    const clac_C = (str, dex, int, luk) => {
        return str / 2800.0 + dex / 3200.0 + int / 7200.0 + luk / 3200.0;
    };

    const clac_B = (PDD, stdPDD, level, m_level, str, dex, int, luk) => {
        const C = clac_C(str, dex, int, luk);
        const D = clac_D(level, m_level);
        const temp1 = C * 28.0 / 45.0 + (level * 7.0 / 13000.0);
        const temp2 = D * (C + level / 550.0 + 0.28);
        return PDD >= stdPDD ? temp1 : temp2;
    };

    const clac_stdPdd = (level, job) => {
        if (job === 2) {
            if (level >= 100) return 494;
            else if (level >= 95) return 446;
            else if (level >= 15) return 83;
            else return 54;
        }
        // Add other job cases if necessary
        return 999;
    };

    const A = clac_C(str, dex, int, luk) + 0.28;
    const stdPdd = clac_stdPdd(level, job);
    const B = clac_B(pdd, stdPdd, level, m_level, str, dex, int, luk);

    let damagemin = Math.floor((m_pad * m_pad * 0.008) - (pdd * A) - ((pdd - stdPdd) * B));
    let damagemax = Math.floor((m_pad * m_pad * 0.0085) - (pdd * A) - ((pdd - stdPdd) * B));

    if (damagemin < 1) damagemin = 1;
    if (damagemax < 1) damagemax = 1;

    document.getElementById('result').innerHTML = `
        <span class="min-damage">최소 피격 데미지: ${damagemin}</span><br>
        <span class="max-damage">최대 피격 데미지: ${damagemax}</span>`;

    // 추천 물약 찾기
    const recommendedPotions = potions
        .filter(potion => potion.recovery >= damagemax)
        .sort((a, b) => a.recovery - b.recovery)
        .slice(0, 1);

    const recommendationDiv = document.getElementById('recommendation');
    if (recommendedPotions.length > 0) {
        recommendationDiv.innerHTML = '<h3>추천 물약:</h3>';
        recommendedPotions.forEach(potion => {
            recommendationDiv.innerHTML += `
                <div>
                    <img src="${potion.image}" alt="${potion.name}" style="width: 50px; height: auto;">
                    <span>${potion.name}</span>
                </div>
            `;
        });
    } else {
        recommendationDiv.innerHTML = '추천 물약이 없습니다.';
    }
});

document.getElementById('saveSettings').addEventListener('click', function() {
    const settings = {
        job: document.getElementById('job').value,
        level: document.getElementById('level').value,
        str: document.getElementById('str').value,
        dex: document.getElementById('dex').value,
        int: document.getElementById('int').value,
        luk: document.getElementById('luk').value,
        pdd: document.getElementById('pdd').value,
        m_level: document.getElementById('m_level').value,
        m_pad: document.getElementById('m_pad').value
    };
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('설정이 저장되었습니다.');
});

document.getElementById('loadSettings').addEventListener('click', function() {
    loadSettings();
    alert('설정을 불러왔습니다.');
});

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings'));
    if (settings) {
        document.getElementById('job').value = settings.job;
        document.getElementById('level').value = settings.level;
        document.getElementById('str').value = settings.str;
        document.getElementById('dex').value = settings.dex;
        document.getElementById('int').value = settings.int;
        document.getElementById('luk').value = settings.luk;
        document.getElementById('pdd').value = settings.pdd;
        document.getElementById('m_level').value = settings.m_level;
        document.getElementById('m_pad').value = settings.m_pad;
    }
}
});

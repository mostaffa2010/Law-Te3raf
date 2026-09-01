// js/questions-engine.js - إدارة جلب الأسئلة من الشيت والنمط اللانهائي

function getActiveQuestionsBank() {
    if (window.questionsBank && window.questionsBank.length > 0) {
        return window.questionsBank;
    }
    const cached = localStorage.getItem('cached_questions_bank');
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.length > 0) {
                window.questionsBank = parsed;
                return parsed;
            }
        } catch (e) {
            console.error('Cache parse error:', e);
        }
    }
    return window.questionsBank || [];
}

function getEndlessQuestionQueue() {
    if (!userProgress.endlessSeenAt) userProgress.endlessSeenAt = {};

    const fullBank = getActiveQuestionsBank();
    const now = Date.now();

    Object.keys(userProgress.endlessSeenAt).forEach(id => {
        if (now - userProgress.endlessSeenAt[id] > ENDLESS_REPEAT_COOLDOWN_MS) {
            delete userProgress.endlessSeenAt[id];
        }
    });

    const fresh = fullBank.filter(q => !userProgress.endlessSeenAt[q.id]);
    const stale = fullBank
        .filter(q => userProgress.endlessSeenAt[q.id])
        .sort((a, b) => userProgress.endlessSeenAt[a.id] - userProgress.endlessSeenAt[b.id]);

    return [...shuffleArray(fresh), ...stale];
}

async function loadQuestionsFromPublishedSheet() {
    try {
        const freshUrl = `${SHEET_CSV_URL}&t=${Date.now()}`;
        const response = await fetch(freshUrl);
        if (!response.ok) return;

        const csvText = await response.text();
        const parsedQuestions = parseSheetCSV(csvText);

        if (parsedQuestions.length > 0) {
            window.questionsBank = parsedQuestions;
            localStorage.setItem('cached_questions_bank', JSON.stringify(parsedQuestions));
        }
    } catch (err) {
        const cached = localStorage.getItem('cached_questions_bank');
        if (cached) {
            window.questionsBank = JSON.parse(cached);
        }
    }
}

function parseSheetCSV(text) {
    const lines = text.split(/\r?\n/);
    const questions = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
        if (cols.length < 9 || !cols[3]) continue;

        questions.push({
            id: parseInt(cols[0]) || i,
            category: cols[1] || 'عام',
            difficulty: parseInt(cols[2]) || 1,
            question: cols[3],
            options: [cols[4] || '', cols[5] || '', cols[6] || '', cols[7] || ''],
            correct: parseInt(cols[8]) || 0,
            image: cols[9] ? cols[9].trim() : ''
        });
    }
    return questions;
}

function getSmartQuestions(count = 10, categoryFilter = null) {
    if (!userProgress.seenQuestions) userProgress.seenQuestions = [];

    const bank = getActiveQuestionsBank();
    let pool = categoryFilter 
        ? bank.filter(q => q.category === categoryFilter)
        : [...bank];

    let available = pool.filter(q => !userProgress.seenQuestions.includes(q.id));

    if (available.length < count) {
        const poolIds = pool.map(q => q.id);
        userProgress.seenQuestions = userProgress.seenQuestions.filter(id => !poolIds.includes(id));
        saveProgress();
        available = [...pool];
    }

    const shuffledAvailable = shuffleArray(available);
    const selected = shuffledAvailable.slice(0, count);

    selected.forEach(q => {
        if (!userProgress.seenQuestions.includes(q.id)) {
            userProgress.seenQuestions.push(q.id);
        }
    });
    saveProgress();

    return selected;
}

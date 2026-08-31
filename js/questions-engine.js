// js/questions-engine.js - محرك توليد المراحل، الأسئلة، والمزامنة السحابية

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

function mulberry32(seed) {
    return function () {
        seed |= 0; 
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function deterministicShuffle(arr, rand) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function assignQuestionsToTierLevels(questionsList, startLevelIndex, questionsPerLevel = 10) {
    if (!questionsList || questionsList.length === 0) return [];

    const numLevels = Math.floor(questionsList.length / questionsPerLevel);
    if (numLevels === 0) return [];

    const rand = mulberry32(LEVEL_BUILD_SEED);

    const catBuckets = {};
    questionsList.forEach(q => {
        const cat = q.category || 'معلومات عامة';
        if (!catBuckets[cat]) catBuckets[cat] = [];
        catBuckets[cat].push(q);
    });
    const sortedCategories = Object.keys(catBuckets).sort();
    sortedCategories.forEach(cat => {
        catBuckets[cat] = deterministicShuffle(catBuckets[cat], rand);
    });

    const used = new Set();
    const levels = Array.from({ length: numLevels }, () => []);
    let catIndex = 0;

    for (let lvl = 0; lvl < numLevels; lvl++) {
        const tier = LEVEL_DIFFICULTY_TIERS[(startLevelIndex + lvl) % LEVEL_DIFFICULTY_TIERS.length];
        let scanned = 0;
        while (levels[lvl].length < questionsPerLevel && scanned < sortedCategories.length) {
            const cat = sortedCategories[catIndex % sortedCategories.length];
            catIndex++;
            const match = catBuckets[cat].find(q =>
                !used.has(q.id) && (q.difficulty || 1) >= tier.min && (q.difficulty || 1) <= tier.max
            );
            if (match) {
                used.add(match.id);
                levels[lvl].push(match);
                scanned = 0;
            } else {
                scanned++;
            }
        }
    }

    const leftovers = deterministicShuffle(questionsList.filter(q => !used.has(q.id)), rand);
    let leftoverPtr = 0;
    for (let lvl = 0; lvl < numLevels && leftoverPtr < leftovers.length; lvl++) {
        while (levels[lvl].length < questionsPerLevel && leftoverPtr < leftovers.length) {
            const q = leftovers[leftoverPtr];
            if (!used.has(q.id)) {
                used.add(q.id);
                levels[lvl].push(q);
            }
            leftoverPtr++;
        }
    }

    return levels;
}

function buildDeterministicLevelsBank(questionsList, frozenSource, questionsPerLevel = 10) {
    if (!questionsList || questionsList.length === 0) return [];

    const questionsById = new Map();
    questionsList.forEach(q => questionsById.set(q.id, q));

    const source = Array.isArray(frozenSource) ? frozenSource : [];
    const frozenLevels = [];
    const usedIds = new Set();

    source.forEach(idList => {
        const levelQuestions = idList
            .map(id => questionsById.get(id))
            .filter(Boolean);
        idList.forEach(id => usedIds.add(id));
        frozenLevels.push(levelQuestions);
    });

    const newQuestions = questionsList.filter(q => !usedIds.has(q.id));
    const newLevels = assignQuestionsToTierLevels(newQuestions, frozenLevels.length, questionsPerLevel);

    return [...frozenLevels, ...newLevels];
}

async function syncLevelsBankWithCloud(liveQuestions, questionsPerLevel = 10) {
    const docRef = db.collection('system').doc('levelsBank');

    try {
        const snap = await docRef.get();
        const cloudFrozen = (snap.exists && Array.isArray(snap.data().levels)) ? snap.data().levels : [];

        const usedIds = new Set();
        cloudFrozen.forEach(idList => idList.forEach(id => usedIds.add(id)));
        const newQuestionsCount = liveQuestions.filter(q => !usedIds.has(q.id)).length;

        if (Math.floor(newQuestionsCount / questionsPerLevel) === 0) {
            localStorage.setItem('cached_levels_bank', JSON.stringify(cloudFrozen));
            return cloudFrozen;
        }

        const finalFrozen = await db.runTransaction(async (tx) => {
            const freshSnap = await tx.get(docRef);
            const freshFrozen = (freshSnap.exists && Array.isArray(freshSnap.data().levels)) ? freshSnap.data().levels : [];

            const freshUsedIds = new Set();
            freshFrozen.forEach(idList => idList.forEach(id => freshUsedIds.add(id)));

            const freshNewQuestions = liveQuestions.filter(q => !freshUsedIds.has(q.id));
            const newLevels = assignQuestionsToTierLevels(freshNewQuestions, freshFrozen.length, questionsPerLevel);

            if (newLevels.length === 0) return freshFrozen;

            const updated = [...freshFrozen, ...newLevels.map(lvl => lvl.map(q => q.id))];
            tx.set(docRef, { levels: updated, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
            return updated;
        });

        localStorage.setItem('cached_levels_bank', JSON.stringify(finalFrozen));
        return finalFrozen;
    } catch (err) {
        const cached = localStorage.getItem('cached_levels_bank');
        return cached ? JSON.parse(cached) : [];
    }
}

function getExactLevelQuestions(levelNumber) {
    const bank = getActiveQuestionsBank();
    if (!structuredLevelsBank || structuredLevelsBank.length === 0) {
        const cachedFrozen = JSON.parse(localStorage.getItem('cached_levels_bank') || '[]');
        structuredLevelsBank = buildDeterministicLevelsBank(bank, cachedFrozen);
    }

    const index = levelNumber - 1;
    if (structuredLevelsBank[index] && structuredLevelsBank[index].length > 0) {
        return structuredLevelsBank[index];
    }

    return getSmartQuestions(10);
}

function getTotalAvailableLevels() {
    const bank = getActiveQuestionsBank();
    if (!structuredLevelsBank || structuredLevelsBank.length === 0) {
        const cachedFrozen = JSON.parse(localStorage.getItem('cached_levels_bank') || '[]');
        structuredLevelsBank = buildDeterministicLevelsBank(bank, cachedFrozen);
    }
    return Math.max(1, structuredLevelsBank.length);
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

            const frozenBank = await syncLevelsBankWithCloud(parsedQuestions);
            structuredLevelsBank = buildDeterministicLevelsBank(parsedQuestions, frozenBank);
            
            if (gameState.currentScreen === 'levels-screen' || document.getElementById('levels-grid')) {
                renderLevelsGrid();
            }
        }
    } catch (err) {
        const cached = localStorage.getItem('cached_questions_bank');
        if (cached) {
            window.questionsBank = JSON.parse(cached);
            const cachedFrozen = JSON.parse(localStorage.getItem('cached_levels_bank') || '[]');
            structuredLevelsBank = buildDeterministicLevelsBank(window.questionsBank, cachedFrozen);
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

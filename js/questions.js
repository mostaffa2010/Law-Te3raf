// questions.js - بنك الأسئلة الاحتياطي للعمل بدون إنترنت (50 سؤال)

const questionsBank = [
  // --- إسلاميات ---
  {
    id: 1,
    category: "إسلاميات",
    difficulty: 1,
    question: "كم عدد سور القرآن الكريم؟",
    options: ["114", "110", "120", "112"],
    correct: 0
  },
  {
    id: 2,
    category: "إسلاميات",
    difficulty: 2,
    question: "من هو الصحابي الجليل الملقب بـ ذي النورين؟",
    options: ["علي بن أبي طالب", "عثمان بن عفان", "عمر بن الخطاب", "أبو بكر الصديق"],
    correct: 1
  },
  {
    id: 3,
    category: "إسلاميات",
    difficulty: 3,
    question: "في أي عام هجري فُتحت مكة المكرمة؟",
    options: ["6 هـ", "7 هـ", "8 هـ", "9 هـ"],
    correct: 2
  },
  {
    id: 4,
    category: "إسلاميات",
    difficulty: 4,
    question: "في أي سنة هجرية وقعت غزوة الخندق (الأحزاب)؟",
    options: ["3 هـ", "5 هـ", "7 هـ", "9 هـ"],
    correct: 1
  },
  {
    id: 5,
    category: "إسلاميات",
    difficulty: 5,
    question: "ما هي السورة القرآنية التي لا تبدأ بالبسملة؟",
    options: ["الأنفال", "التوبة", "يونس", "الكهف"],
    correct: 1
  },
  {
    id: 6,
    category: "إسلاميات",
    difficulty: 3,
    question: "كم عدد أركان الإسلام؟",
    options: ["4", "5", "6", "7"],
    correct: 1
  },

  // --- رياضة وكورة ---
  {
    id: 7,
    category: "رياضة وكورة",
    difficulty: 1,
    question: "ما هي الدولة الأكثر تتويجاً بلقب كأس العالم؟",
    options: ["ألمانيا", "إيطاليا", "البرازيل", "الأرجنتين"],
    correct: 2
  },
  {
    id: 8,
    category: "رياضة وكورة",
    difficulty: 2,
    question: "أي نادي هو الأكثر تتويجاً ببطولة دوري أبطال إفريقيا؟",
    options: ["الزمالك", "الأهلي", "الترجي", "الوداد"],
    correct: 1
  },
  {
    id: 9,
    category: "رياضة وكورة",
    difficulty: 3,
    question: "من هو الهداف التاريخي لبطولة دوري أبطال أوروبا؟",
    options: ["ميسي", "ليفاندوفسكي", "كريستيانو رونالدو", "بنزيما"],
    correct: 2
  },
  {
    id: 10,
    category: "رياضة وكورة",
    difficulty: 4,
    question: "من فاز بجائزة الكرة الذهبية لعام 2007؟",
    options: ["كريستيانو رونالدو", "ميسي", "كاكا", "رونالدينيو"],
    correct: 2
  },
  {
    id: 11,
    category: "رياضة وكورة",
    difficulty: 5,
    question: "من هو هداف منتخب مصر التاريخي في كأس أمم إفريقيا؟",
    options: ["محمد صلاح", "حسام حسن", "محمد أبو تريكة", "حسن الشاذلي"],
    correct: 3
  },
  {
    id: 12,
    category: "رياضة وكورة",
    difficulty: 2,
    question: "كم عدد لاعبي فريق كرة السلة داخل الملعب؟",
    options: ["5", "6", "7", "11"],
    correct: 0
  },

  // --- علوم وفضاء ---
  {
    id: 13,
    category: "علوم وفضاء",
    difficulty: 1,
    question: "ما هو أقرب كوكب إلى الشمس؟",
    options: ["الزهرة", "عطارد", "المريخ", "الأرض"],
    correct: 1
  },
  {
    id: 14,
    category: "علوم وفضاء",
    difficulty: 2,
    question: "ما هو الغاز الأكثر وفرة في الغلاف الجوي للأرض؟",
    options: ["الأكسجين", "النيتروجين", "ثاني أكسيد الكربون", "الهيدروجين"],
    correct: 1
  },
  {
    id: 15,
    category: "علوم وفضاء",
    difficulty: 3,
    question: "ما هو العنصر الكيميائي الذي يرمز له بالرمز Au؟",
    options: ["الفضة", "النحاس", "الذهب", "الألومنيوم"],
    correct: 2
  },
  {
    id: 16,
    category: "علوم وفضاء",
    difficulty: 4,
    question: "ما هو أكبر كوكب في مجموعتنا الشمسية؟",
    options: ["زحل", "المشتري", "نبتون", "أورانوس"],
    correct: 1
  },
  {
    id: 17,
    category: "علوم وفضاء",
    difficulty: 5,
    question: "ما هي الوحدة المستخدمة لقياس شدة التيار الكهربائي؟",
    options: ["الفولت", "الأوم", "الأمبير", "الواط"],
    correct: 2
  },
  {
    id: 18,
    category: "علوم وفضاء",
    difficulty: 2,
    question: "ما هو الكوكب الملقب بالكوكب الأحمر؟",
    options: ["المريخ", "عطارد", "المشتري", "الزهرة"],
    correct: 0
  },

  // --- تاريخ وحضارات ---
  {
    id: 19,
    category: "تاريخ",
    difficulty: 1,
    question: "من بنى الهرم الأكبر في الجيزة؟",
    options: ["خفرع", "خوفو", "منقرع", "زوسر"],
    correct: 1
  },
  {
    id: 20,
    category: "تاريخ",
    difficulty: 2,
    question: "من هو القائد المسلم الذي فتح الأندلس؟",
    options: ["طارق بن زياد", "خالد بن الوليد", "صلاح الدين الأيوبي", "عمرو بن العاص"],
    correct: 0
  },
  {
    id: 21,
    category: "تاريخ",
    difficulty: 3,
    question: "في أي عام وقعت معركة حطين الشهيرة؟",
    options: ["1187", "1258", "1099", "1260"],
    correct: 0
  },
  {
    id: 22,
    category: "تاريخ",
    difficulty: 4,
    question: "في أي عام اندلعت الحرب العالمية الأولى؟",
    options: ["1914", "1918", "1939", "1945"],
    correct: 0
  },
  {
    id: 23,
    category: "تاريخ",
    difficulty: 5,
    question: "ما هي المدينة التي كانت عاصمة الدولة الأموية؟",
    options: ["بغداد", "دمشق", "القاهرة", "الكوفة"],
    correct: 1
  },
  {
    id: 24,
    category: "تاريخ",
    difficulty: 3,
    question: "من هو مؤسس الدولة العثمانية؟",
    options: ["عثمان الأول", "محمد الفاتح", "سليمان القانوني", "سليم الأول"],
    correct: 0
  },

  // --- جغرافيا وعواصم ---
  {
    id: 25,
    category: "جغرافيا",
    difficulty: 1,
    question: "ما هي عاصمة جمهورية مصر العربية؟",
    options: ["الإسكندرية", "القاهرة", "الجيزة", "أسوان"],
    correct: 1
  },
  {
    id: 26,
    category: "جغرافيا",
    difficulty: 2,
    question: "ما هي عاصمة كندا؟",
    options: ["تورونتو", "مونتريال", "أوتاوا", "فانكوفر"],
    correct: 2
  },
  {
    id: 27,
    category: "جغرافيا",
    difficulty: 3,
    question: "ما هو أطول نهر في العالم؟",
    options: ["الأمازون", "النيل", "الميسيسيبي", "يانغتسي"],
    correct: 1
  },
  {
    id: 28,
    category: "جغرافيا",
    difficulty: 4,
    question: "أي دولة تملك أكبر مساحة جغرافية في العالم؟",
    options: ["كندا", "الصين", "روسيا", "أمريكا"],
    correct: 2
  },
  {
    id: 29,
    category: "جغرافيا",
    difficulty: 5,
    question: "ما هو المضيق الذي يفصل بين قارتي آسيا وإفريقيا؟",
    options: ["مضيق هرمز", "باب المندب", "مضيق جبل طارق", "مضيق البوسفور"],
    correct: 1
  },
  {
    id: 30,
    category: "جغرافيا",
    difficulty: 2,
    question: "ما هي عاصمة اليابان؟",
    options: ["طوكيو", "كيوتو", "أوساكا", "هيروشيما"],
    correct: 0
  },

  // --- سينما وفن ---
  {
    id: 31,
    category: "سينما وفن",
    difficulty: 1,
    question: "من هي المغنية المصرية الملقبة بـ كوكب الشرق؟",
    options: ["فيروز", "أم كلثوم", "شادية", "وردة"],
    correct: 1
  },
  {
    id: 32,
    category: "سينما وفن",
    difficulty: 2,
    question: "من هو الممثل المصري الملقب بـ الزعيم؟",
    options: ["أحمد زكي", "محمود عبد العزيز", "عادل إمام", "نور الشريف"],
    correct: 2
  },
  {
    id: 33,
    category: "سينما وفن",
    difficulty: 3,
    question: "من هو مؤلف ثلاثية القاهرة الأدبية الشهيرة؟",
    options: ["طه حسين", "نجيب محفوظ", "توفيق الحكيم", "يوسف إدريس"],
    correct: 1
  },
  {
    id: 34,
    category: "سينما وفن",
    difficulty: 4,
    question: "من هو مخرج ثلاثية أفلام The Dark Knight الشهيرة؟",
    options: ["سبيلبرغ", "كريستوفر نولان", "كاميرون", "تارانتينو"],
    correct: 1
  },
  {
    id: 35,
    category: "سينما وفن",
    difficulty: 5,
    question: "في أي عام تم إنتاج فيلم الأرض للمخرج يوسف شاهين؟",
    options: ["1965", "1970", "1975", "1980"],
    correct: 1
  },

  // --- عالم الطبيعة والحيوان ---
  {
    id: 36,
    category: "طبيعة وحيوانات",
    difficulty: 1,
    question: "ما هو أضخم كائن حي يعيش على كوكب الأرض حالياً؟",
    options: ["الفيل الإفريقي", "الحوت الأزرق", "القرش الأبيض", "الزرافة"],
    correct: 1
  },
  {
    id: 37,
    category: "طبيعة وحيوانات",
    difficulty: 2,
    question: "ما هو الطائر الوحيد الذي يستطيع الطيران إلى الخلف؟",
    options: ["الصقر", "الطنان", "النسر", "الببغاء"],
    correct: 1
  },
  {
    id: 38,
    category: "طبيعة وحيوانات",
    difficulty: 3,
    question: "ما هو أسرع حيوان بري في العالم؟",
    options: ["الفهد (الشيتا)", "الأسد", "الغزال", "النمر"],
    correct: 0
  },
  {
    id: 39,
    category: "طبيعة وحيوانات",
    difficulty: 4,
    question: "كم عدد قلوب الأخطبوط؟",
    options: ["قلب واحد", "قلبان", "3 قلوب", "4 قلوب"],
    correct: 2
  },
  {
    id: 40,
    category: "طبيعة وحيوانات",
    difficulty: 5,
    question: "ما هو الحيوان الذي لا يشرب الماء طوال حياته؟",
    options: ["الجمل", "فأر الكنغر", "الضفدع الشجري", "السلحفاة"],
    correct: 1
  },

  // --- معلومات عامة وشخصيات ---
  {
    id: 41,
    category: "معلومات عامة",
    difficulty: 1,
    question: "كم عدد قارات العالم المأهولة بالسكان؟",
    options: ["5", "6", "7", "8"],
    correct: 1
  },
  {
    id: 42,
    category: "معلومات عامة",
    difficulty: 2,
    question: "من هو مخترع المصباح الكهربائي العملي؟",
    options: ["تسلا", "توماس إديسون", "نيوتن", "أينشتاين"],
    correct: 1
  },
  {
    id: 43,
    category: "معلومات عامة",
    difficulty: 3,
    question: "كم عدد عظام الهيكل العظمي في جسم الإنسان البالغ؟",
    options: ["180", "206", "250", "300"],
    correct: 1
  },
  {
    id: 44,
    category: "معلومات عامة",
    difficulty: 4,
    question: "ما هي أصلب مادة طبيعية على وجه الأرض؟",
    options: ["الحديد", "الجرانيت", "الألماس", "التيتانيوم"],
    correct: 2
  },
  {
    id: 45,
    category: "معلومات عامة",
    difficulty: 5,
    question: "ما هي عملة دولة البرازيل الرسمية؟",
    options: ["البيزو", "الريال البرازيلي", "الدولار", "اليورو"],
    correct: 1
  },
  {
    id: 46,
    category: "معلومات عامة",
    difficulty: 3,
    question: "ما هي لغة البرازيل الرسمية؟",
    options: ["الإسبانية", "البرتغالية", "الإنجليزية", "الفرنسية"],
    correct: 1
  },
  {
    id: 47,
    category: "جغرافيا",
    difficulty: 3,
    question: "ما هي عاصمة أستراليا؟",
    options: ["سيدني", "ملبورن", "كانبرا", "بيرث"],
    correct: 2
  },
  {
    id: 48,
    category: "علوم وفضاء",
    difficulty: 3,
    question: "ما هو العنصر الكيميائي الأساسي في صناعة رقائق الكمبيوتر؟",
    options: ["الكربون", "السيليكون", "النحاس", "الفوسفور"],
    correct: 1
  },
  {
    id: 49,
    category: "تاريخ",
    difficulty: 4,
    question: "في أي عام سقطت القسطنطينية على يد العثمانيين؟",
    options: ["1453", "1492", "1517", "1258"],
    correct: 0
  },
  {
    id: 50,
    category: "إسلاميات",
    difficulty: 2,
    question: "من هي أول زوجات النبي محمد صلى الله عليه وسلم؟",
    options: ["عائشة بنت أبي بكر", "خديجة بنت خويلد", "حفصة بنت عمر", "سودة بنت زمعة"],
    correct: 1
  },

  // --- أسئلة مصورة تجريبية (Visual Questions) ---
  {
    id: 2402,
    category: "جغرافيا",
    difficulty: 2,
    question: "في أي دولة يقع هذا المعلم السياحي الشهير (برج إيفل)؟",
    options: ["إيطاليا", "فرنسا", "إسبانيا", "ألمانيا"],
    correct: 1,
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2403,
    category: "تاريخ",
    difficulty: 3,
    question: "ما اسم هذا الأثر التاريخي الشهير الموجود في روما بإيطاليا؟",
    options: ["الكولوسيوم", "البارثينون", "قصر الحمراء", "برج بيزا"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2404,
    category: "جغرافيا",
    difficulty: 2,
    question: "ما هي الدولة التي ينتمي إليها هذا العلم الوطني؟",
    options: ["الأرجنتين", "البرازيل", "كولومبيا", "المكسيك"],
    correct: 1,
    image: "https://flagcdn.com/w640/br.png"
  },
  {
    id: 2405,
    category: "تاريخ",
    difficulty: 3,
    question: "في أي مدينة هندية يقع ضريح (تاج محل) الشهير؟",
    options: ["نيودلهي", "مومباي", "أغرا", "كلكتا"],
    correct: 2,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2406,
    category: "سينما وفن",
    difficulty: 5,
    question: "من هو الرسام العالمي صاحب هذه اللوحة الشهيرة (الفتاة ذات القرط اللؤلؤي)؟",
    options: ["يوهانس فيرمير", "رامبرانت", "ليوناردو دا فينشي", "فان جوخ"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2407,
    category: "طبيعة وحيوانات",
    difficulty: 1,
    question: "ما اسم هذا الحيوان المميز الذي يعيش في غابات الخيزران في الصين؟",
    options: ["الباندا العملاق", "الكوالا", "الليمور", "الراكون"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2408,
    category: "رياضة وكورة",
    difficulty: 2,
    question: "من هو أسطورة كرة القدم الأرجنتينية الظاهر في هذه الصورة وهو يرفع كأس العالم 1986؟",
    options: ["دييغو مارادونا", "ليونيل ميسي", "ماريو كيمبس", "غابرييل باتيستوتا"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2409,
    category: "علوم وفضاء",
    difficulty: 2,
    question: "ما هو هذا الكوكب من كواكب المجموعة الشمسية الذي يشتهر بنظامه الحلقي البديع؟",
    options: ["المشتري", "زحل", "أورانوس", "نبتون"],
    correct: 1,
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2410,
    category: "جغرافيا",
    difficulty: 3,
    question: "ما اسم هذا الجسر المعلق الشهير بلونه البرتقالي في مدينة سان فرانسيسكو؟",
    options: ["جسر البوابة الذهبية (Golden Gate)", "جسر بروكلين", "جسر البرج", "جسر هاربر"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2411,
    category: "إسلاميات",
    difficulty: 2,
    question: "ما اسم هذا المسجد التاريخي ذو القبة الذهبية الواقع داخل الحرم القدسي الشريف؟",
    options: ["المسجد الإبراهيمي", "مسجد قبة الصخرة", "المسجد الأموي", "مسجد القبلتين"],
    correct: 1,
    image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=600&q=80"
  }

];

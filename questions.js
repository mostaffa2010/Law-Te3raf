// questions.js - بنك الأسئلة الاحتياطي للعمل بدون إنترنت (50 سؤال)

var questionsBank = window.questionsBank = [
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
  },
  {
    id: 2412,
    category: "جغرافيا",
    difficulty: 2,
    question: "ما اسم هذا البرج الشهير المائل الواقع في إيطاليا؟",
    options: ["برج بيزا المائل", "برج إيفل", "برج لندن", "برج خليفة"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2413,
    category: "جغرافيا",
    difficulty: 3,
    question: "إلى أي دولة ينتمي هذا العلم الذي يتوسطه رسم لأرزة خضراء؟",
    options: ["لبنان", "الأردن", "سوريا", "فلسطين"],
    correct: 0,
    image: "https://flagcdn.com/w640/lb.png"
  },
  {
    id: 2414,
    category: "جغرافيا",
    difficulty: 6,
    question: "هذا العلم الوطني المميز باللونين الأزرق والأصفر ينتمي إلى أي دولة أوروبية؟",
    options: ["السويد", "فنلندا", "أوكرانيا", "النرويج"],
    correct: 0,
    image: "https://flagcdn.com/w640/se.png"
  },
  {
    id: 2415,
    category: "جغرافيا",
    difficulty: 4,
    question: "في أي مدينة أمريكية يقع تمثال الحرية الشهير الظاهر في الصورة؟",
    options: ["واشنطن", "نيويورك", "لوس أنجلوس", "شيكاغو"],
    correct: 1,
    image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2416,
    category: "جغرافيا",
    difficulty: 5,
    question: "ما اسم هذه القلعة البيضاء الخيالية الشهيرة الواقعة في ولاية بافاريا بألمانيا؟",
    options: ["قلعة نويشفانشتاين", "قلعة وندسور", "قصر فرساي", "قصر الحمراء"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2417,
    category: "جغرافيا",
    difficulty: 7,
    question: "ما اسم هذا الجبل البركاني المخروطي الشهير والمقدس في اليابان؟",
    options: ["جبل إيفرست", "جبل فوجي", "جبل كيليمنجارو", "جبل تاي"],
    correct: 1,
    image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2418,
    category: "تاريخ",
    difficulty: 3,
    question: "في أي دولة تقع هذه الأهرامات الضخمة وتمثال أبو الهول؟",
    options: ["المكسيك", "مصر", "السودان", "بيرو"],
    correct: 1,
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2419,
    category: "تاريخ",
    difficulty: 5,
    question: "ما اسم هذا المعبد الإغريقي القديم المشيد فوق تل الأكروبوليس في أثينا؟",
    options: ["البارثينون", "الكولوسيوم", "البتراء", "أفسس"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2420,
    category: "تاريخ",
    difficulty: 4,
    question: "ما اسم هذا السور العظيم الذي يمتد لآلاف الكيلومترات في آسيا؟",
    options: ["سور برلين", "سور الصين العظيم", "سور القسطنطينية", "سور مجرى العيون"],
    correct: 1,
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2421,
    category: "تاريخ",
    difficulty: 6,
    question: "من هو العالم الفيزيائي صاحب النظرية النسبية الظاهر في هذه الصورة الشهيرة؟",
    options: ["إسحاق نيوتن", "ألبرت أينشتاين", "نيكولا تسلا", "ستيفن هوكينج"],
    correct: 1,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2422,
    category: "تاريخ",
    difficulty: 8,
    question: "ما اسم هذه المدينة الصخرية الوردية المنحوتة في الأردن؟",
    options: ["البتراء", "تدمر", "بابل", "جرش"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1579606032834-deaff9700c5b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2423,
    category: "تاريخ",
    difficulty: 9,
    question: "ما اسم هذه التماثيل الصخرية الضخمة الغامضة الموجودة في جزيرة الفصح (جزيرة إيستر)؟",
    options: ["تماثيل المواي (Moai)", "أبو الهول", "تماثيل عين غزال", "أعمدة هرقل"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2424,
    category: "علوم وفضاء",
    difficulty: 2,
    question: "ما هو هذا الكوكب ذو اللون الأحمر المميز في نظامنا الشمسي؟",
    options: ["المريخ", "الزهرة", "عطارد", "المشتري"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2425,
    category: "علوم وفضاء",
    difficulty: 5,
    question: "ما اسم هذه الظاهرة الفلكية الضوئية الساحرة التي تظهر في القطبين الشمالي والجنوبي؟",
    options: ["الشفق القطبي (الأورورا)", "كسوف الشمس", "خسوف القمر", "الانفجار النجمي"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2426,
    category: "علوم وفضاء",
    difficulty: 8,
    question: "ما اسم مجرتنا الحلزونية التي تضم مجموعتنا الشمسية والظاهرة في سماء الليل؟",
    options: ["درب التبانة", "مجرة أندروميدا", "مجرة المثلث", "مجرة السومبريرو"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2427,
    category: "طبيعة وحيوانات",
    difficulty: 1,
    question: "ما اسم هذا الطائر الذي يعيش في المناطق القطبية الجليدية ولا يطير بل يسبح بمهارة؟",
    options: ["البطريق", "البومة", "النسر", "البجع"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2428,
    category: "طبيعة وحيوانات",
    difficulty: 3,
    question: "ما اسم أطول حيوان ثديي في العالم الظاهر في الصورة؟",
    options: ["الفيل", "الزرافة", "الحصان", "الجمل"],
    correct: 1,
    image: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2429,
    category: "طبيعة وحيوانات",
    difficulty: 4,
    question: "ما اسم هذا الحيوان الأسترالي اللطيف الذي يتغذى فقط على أوراق شجر الكافور (الكينا)؟",
    options: ["الكوالا", "الكنغر", "الكسلان", "الأبوسوم"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2430,
    category: "طبيعة وحيوانات",
    difficulty: 7,
    question: "ما اسم هذا الحيوان البحري الذكي جداً والودود مع البشر؟",
    options: ["الدلفين", "القرش", "الحوت القاتل", "فقمة البحر"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1607153333879-c1a07d26572d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2431,
    category: "سينما وفن",
    difficulty: 2,
    question: "ما اسم أشهر لوحة في العالم رسمها الفنان الإيطالي ليوناردو دا فينشي؟",
    options: ["الموناليزا", "ليلة النجوم", "الصرخة", "خلق آدم"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2432,
    category: "سينما وفن",
    difficulty: 6,
    question: "هذه اللوحة الفنية التعبيرية الشهيرة (The Starry Night) تعود لأي رسام هولندي؟",
    options: ["فينسنت فان جوخ", "كلود مونيه", "بابلو بيكاسو", "سلفادور دالي"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2433,
    category: "سينما وفن",
    difficulty: 9,
    question: "ما اسم هذا التمثال الرخامي الأيقوني لعصر النهضة الذي نحته الفنان مايكل أنجلو؟",
    options: ["تمثال داود (David)", "تمثال المفكر", "تمثال فينوس", "أبوللو"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2434,
    category: "إسلاميات",
    difficulty: 2,
    question: "ما هو هذا البناء المقدس الذي يتجه نحوه المسلمون في صلواتهم ويقع بمكة المكرمة؟",
    options: ["الكعبة المشرفة", "المسجد النبوي", "المسجد الأقصى", "مسجد قباء"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2435,
    category: "إسلاميات",
    difficulty: 4,
    question: "ما اسم هذا المسجد الأثري الشهير الواقع في إسطنبول بتركيا بقبابه ومآذنه الست؟",
    options: ["مسجد السلطان أحمد (المسجد الأزرق)", "جامع الزيتونة", "مسجد القرويين", "المسجد الأموي"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2436,
    category: "رياضة وكورة",
    difficulty: 3,
    question: "من هو أسطورة كرة القدم البرتغالية الفائز بجائزة الكرة الذهبية 5 مرات الظاهر في الصورة؟",
    options: ["كريستيانو رونالدو", "لويس فيغو", "برونو فيرنانديز", "أوزيبيو"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2437,
    category: "رياضة وكورة",
    difficulty: 6,
    question: "ما اسم هذا الملعب الأسطوري الضخم في مدينة برشلونة الإسبانية؟",
    options: ["كامب نو (Camp Nou)", "سانتياغو برنابيو", "أليانز أرينا", "ويمبلي"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2438,
    category: "تكنولوجيا وألعاب",
    difficulty: 2,
    question: "هذا الشعار المضيء الشهير للتفاحة المقضومة يعود إلى أي شركة تكنولوجية؟",
    options: ["آبل (Apple)", "مايكروسوفت", "جوجل", "سامسونج"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2439,
    category: "تكنولوجيا وألعاب",
    difficulty: 5,
    question: "ما اسم هذا الجهاز الكلاسيكي المحمول الذي أطلقته شركة نينتندو عام 1989 وأحدث ثورة؟",
    options: ["جيم بوي (Game Boy)", "بلايستيشن بورتابل", "نينتندو دي إس", "سيجا جينيسيس"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2440,
    category: "سيارات ومحركات",
    difficulty: 4,
    question: "ما هي علامة السيارات الألمانية الفاخرة صاحبة هذا الشعار المكون من نجمة ثلاثية داخل دائرة؟",
    options: ["مرسيدس-بنز", "بي إم دبليو", "أودي", "بورشه"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2441,
    category: "سيارات ومحركات",
    difficulty: 7,
    question: "ما هي شركة السيارات الألمانية صاحبة شعار الدوائر الأربع المتداخلة؟",
    options: ["أودي (Audi)", "فولكس فاجن", "أوبل", "بورشه"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2442,
    category: "جغرافيا",
    difficulty: 2,
    question: "ما اسم برج الساعة التاريخي الشهير الواقع في العاصمة البريطانية لندن؟",
    options: ["ساعة بيغ بن", "برج إليزابيث", "برج لندن", "ساعة مكة"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2443,
    category: "جغرافيا",
    difficulty: 3,
    question: "ما اسم هذا المبنى المعماري الشهير بتصميمه الشراعي في أستراليا؟",
    options: ["دار أوبرا سيدني", "متحف اللوفر", "برج العرب", "متحف غوغنهايم"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1523428096881-5cb799f6990f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2444,
    category: "جغرافيا",
    difficulty: 1,
    question: "إلى أي دولة آسيوية ينتمي هذا العلم الذي يتوسطه قرص أحمر؟",
    options: ["الصين", "اليابان", "كوريا الجنوبية", "فيتنام"],
    correct: 1,
    image: "https://flagcdn.com/w640/jp.png"
  },
  {
    id: 2445,
    category: "جغرافيا",
    difficulty: 2,
    question: "هذا العلم المكون من ثلاثة ألوان أفقية (أسود، أحمر، ذهبي) هو علم أي دولة؟",
    options: ["بلجيكا", "ألمانيا", "النمسا", "هولندا"],
    correct: 1,
    image: "https://flagcdn.com/w640/de.png"
  },
  {
    id: 2446,
    category: "تاريخ",
    difficulty: 5,
    question: "ما اسم مدينة الإنكا التاريخية الضائعة المشيدة فوق قمم جبال الأنديز في بيرو؟",
    options: ["ماتشو بيتشو", "تشيتشن إيتزا", "تيوتيهواكان", "البتراء"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2447,
    category: "تاريخ",
    difficulty: 6,
    question: "ما اسم هرم حضارة المايا الشهير (إل كاستيو) الواقع في المكسيك؟",
    options: ["تشيتشن إيتزا", "هرم تيكال", "هرم سقارة", "معبد الشمس"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2448,
    category: "علوم وفضاء",
    difficulty: 1,
    question: "ما اسم الكوكب الأزرق الذي نعيش عليه كما يبدو من الفضاء الخارجي؟",
    options: ["الأرض", "نبتون", "أورانوس", "الزهرة"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2449,
    category: "علوم وفضاء",
    difficulty: 1,
    question: "ما هو هذا الجرم السماوي وهو التابع الطبيعي الوحيد لكوكب الأرض؟",
    options: ["القمر", "تيتان", "غانيميد", "فوبوس"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2450,
    category: "طبيعة وحيوانات",
    difficulty: 2,
    question: "ما اسم هذا السنور الكبير المخطط وهو أضخم أنواع فصيلة القطط؟",
    options: ["النمر (ببر)", "الأسد", "الفهد", "اليغور"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2451,
    category: "طبيعة وحيوانات",
    difficulty: 1,
    question: "ما هو هذا الحيوان الثديي وهو أضخم حيوان بري يعيش على اليابسة؟",
    options: ["الفيل الإفريقي", "فرس النهر", "وحيد القرن", "الزرافة"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2452,
    category: "طبيعة وحيوانات",
    difficulty: 2,
    question: "ما اسم هذا الزاحف الشهير بقدرته المذهلة على تغيير ألوان جلده للتمويه؟",
    options: ["الحرباء", "الضفدع الشجري", "الإغوانا", "البرص"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2453,
    category: "سينما وفن",
    difficulty: 4,
    question: "ما اسم هذه اللوحة التعبيرية العالمية الشهيرة للرسام النرويجي إدفارد مونك؟",
    options: ["الصرخة", "الموناليزا", "غرنيكا", "العشاء الأخير"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2454,
    category: "سينما وفن",
    difficulty: 5,
    question: "ما اسم هذا التمثال البرونزي الشهير للنحات الفرنسي أوغست رودان؟",
    options: ["تمثال المفكر", "تمثال داود", "تمثال أبو الهول", "تمثال فينوس"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2455,
    category: "إسلاميات",
    difficulty: 1,
    question: "في أي مدينة سعودية يقع المسجد النبوي الشريف ذو القبة الخضراء؟",
    options: ["المدينة المنورة", "مكة المكرمة", "الرياض", "جدة"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2456,
    category: "إسلاميات",
    difficulty: 3,
    question: "ما اسم هذا الصرح والجامع الإسلامي العريق الذي بني في العصر الفاطمي بالقاهرة؟",
    options: ["الجامع الأزهر", "جامع عمرو بن العاص", "جامع السلطان حسن", "قلعة قايتباي"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2457,
    category: "رياضة وكورة",
    difficulty: 1,
    question: "أي رياضة جماعية عالمية تُلعب باستخدام هذه الكرة داخل ملعب عشبي؟",
    options: ["كرة القدم", "كرة السلة", "كرة اليد", "الكرة الطائرة"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2458,
    category: "رياضة وكورة",
    difficulty: 2,
    question: "ما هي هذه اللعبة المضربية الفردية التي تُلعب على ملاعب ويمبلدون ورولان غاروس؟",
    options: ["كرة المضرب (التنس)", "تنس الطاولة", "الريشة الطائرة", "الاسكواش"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2459,
    category: "تكنولوجيا وألعاب",
    difficulty: 1,
    question: "ما اسم منصة الألعاب الشهيرة التابعة لشركة سوني (Sony) والتي تعود لها هذه الذراع؟",
    options: ["بلايستيشن (PlayStation)", "إكس بوكس (Xbox)", "نينتندو سويتش", "سيجا"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2460,
    category: "تكنولوجيا وألعاب",
    difficulty: 2,
    question: "ما اسم الحاسوب المحمول الأيقوني الذي تصنعه شركة آبل؟",
    options: ["ماك بوك (MacBook)", "ثينك باد", "سيرفس برو", "كروم بوك"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2461,
    category: "سيارات ومحركات",
    difficulty: 3,
    question: "ما هي شركة السيارات الخارقة الإيطالية الشهيرة صاحبة طرازات هوراكان وأفنتادور؟",
    options: ["لامبورغيني", "فيراري", "مازيراتي", "بورشه"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2462,
    category: "سيارات ومحركات",
    difficulty: 2,
    question: "هذا الشعار الدائري الأزرق والأبيض يعود لأي شركة سيارات ألمانية شهيرة؟",
    options: ["بي إم دبليو (BMW)", "مرسيدس-بنز", "أودي", "فولكس فاجن"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2463,
    category: "معلومات عامة",
    difficulty: 2,
    question: "ما اسم أول وأشهر عملة رقمية مشفرة في العالم ظهرت عام 2009؟",
    options: ["بيتكوين (Bitcoin)", "إيثريوم", "تيذر", "ريبل"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2464,
    category: "جغرافيا",
    difficulty: 3,
    question: "ما هي القارة الجليدية المتجمدة الواقعة في أقصى جنوب الكرة الأرضية؟",
    options: ["أنتاركتيكا (القارة القطبية الجنوبية)", "جرينلاند", "أيسلندا", "ألاسكا"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2465,
    category: "معلومات عامة",
    difficulty: 1,
    question: "ما هي هذه المادة الغذائية الأساسية المصنوعة من القمح والتي تعد قوام المخبوزات؟",
    options: ["الخبز", "الأرز", "الذرة", "الشوفان"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2466,
    category: "علوم وفضاء",
    difficulty: 6,
    question: "ما اسم هذا التجمع الهائل من النجوم والغازات والغبار الكوني في الفضاء؟",
    options: ["السديم (Nebula)", "المذنب", "الكويكب", "الثقب الأسود"],
    correct: 0,
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80"
  }
];

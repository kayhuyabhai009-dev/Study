/* ============================================================
   आधिकारिक SSC/RRB syllabus coverage expansion
   स्रोत-आधार: SSC CGL/CHSL Mathematical Abilities तथा RRB ALP/NTPC
   Mathematics syllabi — Statistics, Probability, DI, Ages, Calendar & Clock.
   ============================================================ */

function advancedFormula(name, rule, explain, example, trap, pyq, pyqAns) {
    return { name, rule, explain, example, trap, pyq, pyqAns };
}

FORMULA_BOOK.push(
    {
        id: 'statistics-di', name: 'सांख्यिकी व डेटा इंटरप्रिटेशन', icon: '📊', color: '#0369a1',
        desc: 'Mean-Median-Mode, standard deviation, tables, bar/pie charts, histogram और caselet DI',
        subtopics: ['केंद्रीय प्रवृत्ति', 'विचलन', 'तालिका व ग्राफ', 'Pie chart', 'Histogram व frequency polygon'],
        formulas: [
            advancedFormula('अंकगणितीय माध्य (Mean)', 'माध्य = Σx/n | आवृत्ति हो तो x̄ = Σfx/Σf', 'माध्य सभी मानों का संतुलन-बिंदु है। आवृत्ति बताती है कि कोई मान कितनी बार आया, इसलिए fx का योग वास्तविक कुल है।', 'मान 4, 6, 8, 12 का माध्य = 30/4 = 7.5', '⚠️ आवृत्ति-सारणी में n को पंक्तियों की संख्या न मानें; n = Σf होता है।', 'x: 10,20,30 तथा f: 2,3,5 हो तो माध्य?', '23 (Σfx=20+60+150=230, Σf=10)'),
            advancedFormula('Assumed Mean / विचलन विधि', 'x̄ = A + Σfd/Σf, जहाँ d=x−A', 'बड़े मानों में सुविधाजनक A चुनने से गुणा छोटा हो जाता है; कुल विचलन को कुल आवृत्ति से बाँटकर A में जोड़ते हैं।', '48, 52, 55, 45; A=50, d=−2,2,5,−5 → x̄=50+0/4=50', '⚠️ d का चिह्न न भूलें; A से छोटा मान ऋणात्मक होगा।', '72, 75, 78, 81, 84 का माध्य?', '78 (A=78 पर विचलनों का योग 0)'),
            advancedFormula('संयुक्त माध्य', 'Combined mean = (n₁x̄₁+n₂x̄₂)/(n₁+n₂)', 'दो समूह बराबर आकार के न हों तो माध्यों का सीधा औसत गलत है; समूह आकार weight का काम करता है।', '20 छात्रों का औसत 60 और 30 का 70 → (1200+2100)/50=66', '⚠️ (60+70)/2 केवल तब जब दोनों समूहों में सदस्य बराबर हों।', '40 पुरुषों का औसत 50, 60 महिलाओं का 40; संयुक्त औसत?', '44'),
            advancedFormula('Median — असमूहित डेटा', 'डेटा क्रम में रखें। n विषम: (n+1)/2वाँ पद; n सम: [n/2वाँ +(n/2+1)वाँ]/2', 'Median बीच का मान है, इसलिए पहले आरोही क्रम अनिवार्य है। यह बहुत बड़े/छोटे outlier से कम प्रभावित होता है।', '3, 9, 2, 7, 5 → क्रम 2,3,5,7,9 → median=5', '⚠️ बिना sort किए बीच का लिखा मान median नहीं होता।', '11, 4, 8, 15, 9, 6 का median?', '8.5 (क्रम 4,6,8,9,11,15)'),
            advancedFormula('Median — grouped data', 'Median = l + [(N/2−cf)/f]×h', 'N/2 जिस class में आता है वही median class है। l उसकी lower boundary, cf उससे पहले की cumulative frequency, f उसी class की frequency है।', 'Classes 0-10,10-20,20-30; f=5,9,6 → N/2=10, median class 10-20 → 10+(10−5)/9×10=15.56', '⚠️ inclusive classes को continuous boundary में बदले बिना सूत्र न लगाएँ।', 'l=20, N=50, cf=18, f=14, h=10; median?', '25'),
            advancedFormula('Mode और empirical relation', 'Mode = सर्वाधिक आवृत्ति वाला मान | grouped: l+[(f₁−f₀)/(2f₁−f₀−f₂)]h | Mode ≈ 3 Median − 2 Mean', 'Mode सबसे सामान्य मान है। मध्यम रूप से skewed distribution में mean-median-mode का empirical संबंध तेज़ उत्तर देता है।', 'Mean=24, Median=26 → Mode≈78−48=30', '⚠️ empirical relation exact universal identity नहीं; प्रश्न में संबंध माँगा हो तभी प्रयोग करें।', 'Mean 32 और mode 35 हो तो median?', '33 (35=3M−64)'),
            advancedFormula('Range, variance और standard deviation', 'Range=max−min | Variance σ²=Σ(x−x̄)²/n | SD σ=√variance', 'SD बताता है मान mean से औसतन कितने फैले हैं। हर deviation का square लेने से ऋण-धन रद्द नहीं होते।', '2,4,6: mean=4; variance=(4+0+4)/3=8/3; SD=√(8/3)', '⚠️ SD और variance अलग हैं; variance का square root लेना न भूलें।', 'सभी मानों में 5 जोड़ने पर SD पर क्या असर?', 'कोई असर नहीं'),
            advancedFormula('Scale और shift का SD पर प्रभाव', 'हर x में k जोड़/घटा दें → SD अपरिवर्तित | हर x को k से गुणा करें → नया SD=|k|σ', 'Shift से सभी दूरियाँ समान रहती हैं; scale से हर दूरी उसी अनुपात में बदलती है।', 'SD=6; हर मान को 3x−4 करें → नया SD=18', '⚠️ −4 को SD में घटाना गलत है।', 'Variance 25 है; सभी मान दोगुने हों तो नया variance?', '100 (variance k² से बदलता है)'),
            advancedFormula('Pie chart angle और value', 'Sector angle = value/total ×360° | value = angle/360° × total | प्रतिशत = angle/3.6', 'पूरा वृत्त 360° = 100%, इसलिए 1%=3.6°। अनुपात को angle में बदलना ही pie-chart का आधार है।', 'कुल 720 में 90° sector → 90/360×720=180', '⚠️ कोण को सीधे प्रतिशत न मानें; 72° = 20%, 72% नहीं।', '54° sector कुल का कितने प्रतिशत?', '15%'),
            advancedFormula('Bar/Table DI में प्रतिशत परिवर्तन', '% change = (new−old)/old ×100', 'तुलना का आधार हमेशा पुराना/मूल मान होता है। graph से values पढ़कर पहले अंतर, फिर पुराने मान से भाग करें।', 'उत्पादन 240 से 300 → वृद्धि=60/240×100=25%', '⚠️ denominator में नया मान रखने से 20% आएगा, जो गलत है।', 'बिक्री 500 से 425 हुई; प्रतिशत कमी?', '15%'),
            advancedFormula('Histogram और frequency polygon', 'Histogram: continuous classes, bar gaps नहीं | frequency polygon: class marks को frequencies से जोड़ें | class mark=(lower+upper)/2', 'Histogram क्षेत्र आवृत्ति दिखाता है। समान class-width पर ऊँचाई ही frequency है; polygon प्रत्येक class के मध्य-बिंदु से गुजरता है।', '20-30 class का class mark =25', '⚠️ histogram को bar graph न समझें; continuous intervals में bars जुड़े होते हैं।', '35-45 वर्ग का class mark?', '40'),
            advancedFormula('Caselet DI — weighted average', 'Weighted average = Σ(value×weight)/Σweight', 'Caselet में percentages, population या marks weights के रूप में छिपे रहते हैं। पहले units एक करें, फिर weighted total निकालें।', '60 kg @₹40 और 40 kg @₹55 → औसत ₹46/kg', '⚠️ कीमतों का सीधा औसत ₹47.5 गलत है क्योंकि quantities असमान हैं।', '30 units @20 और 70 units @40 का weighted average?', '34')
        ]
    },
    {
        id: 'probability-counting', name: 'प्रायिकता व गणना-विधि', icon: '🎲', color: '#7e22ce',
        desc: 'Probability, coins-dice-cards, complement, addition rule, permutation और combination की मजबूत नींव',
        subtopics: ['मूल प्रायिकता', 'सिक्का-पासा-ताश', 'पूरक घटना', 'क्रमचय', 'संचय'],
        formulas: [
            advancedFormula('मूल प्रायिकता', 'P(E)=अनुकूल परिणाम/कुल समान-संभावित परिणाम | 0≤P(E)≤1', 'Sample space सभी संभावित outcomes है। समान संभावना होने पर अनुकूल outcomes गिनकर कुल से भाग देते हैं।', 'पासे पर सम संख्या: {2,4,6} → 3/6=1/2', '⚠️ अनुकूल और कुल outcomes एक ही स्तर पर गिनें।', '52 पत्तों में एक ace आने की probability?', '4/52=1/13'),
            advancedFormula('पूरक घटना', 'P(not E)=1−P(E) | P(at least one)=1−P(none)', '“कम-से-कम एक” सीधे गिनना कठिन हो तो उसके उलट “एक भी नहीं” निकालना आसान होता है।', '2 सिक्कों में कम-से-कम एक head =1−P(TT)=1−1/4=3/4', '⚠️ at least one को exactly one न समझें।', '3 पासों में कम-से-कम एक 6?', '1−(5/6)³=91/216'),
            advancedFormula('Addition rule', 'P(A∪B)=P(A)+P(B)−P(A∩B) | mutually exclusive में intersection=0', 'दोनों घटनाओं में common outcomes दो बार जुड़ते हैं, इसलिए intersection एक बार घटाते हैं।', 'पत्ते में king या heart =4/52+13/52−1/52=4/13', '⚠️ “या” पर हमेशा सीधा जोड़ नहीं; overlap जाँचें।', 'पासे पर 2 का गुणज या 3 का गुणज?', '4/6=2/3 ({2,3,4,6})'),
            advancedFormula('Independent events', 'स्वतंत्र A,B: P(A∩B)=P(A)P(B)', 'एक घटना का परिणाम दूसरी की संभावना न बदले तो दोनों स्वतंत्र हैं; “और” के लिए probabilities multiply होती हैं।', 'दो सिक्कों पर दोनों head =1/2×1/2=1/4', '⚠️ बिना replacement ताश निकालना independent नहीं होता।', 'दो पासों पर दोनों में 6?', '1/36'),
            advancedFormula('दो पासों का sum', 'कुल ordered outcomes=36 | sums 2…12 की counts: 1,2,3,4,5,6,5,4,3,2,1', 'पहला और दूसरा पास अलग माने जाते हैं; (2,5) और (5,2) अलग outcomes हैं।', 'योग 7 के 6 outcomes → 6/36=1/6', '⚠️ sums को 11 समान outcomes मानना गलत है।', 'दो पासों का योग 9 होने की probability?', '4/36=1/9'),
            advancedFormula('ताश के पत्तों की master facts', 'कुल 52; 4 suits×13; red=26; face cards J,Q,K=12; aces=4; प्रत्येक suit में 3 face cards', 'Card questions facts की सही गिनती पर निर्भर हैं। red face cards hearts+diamonds में 3+3=6 हैं।', 'black queen =2 → probability 2/52=1/26', '⚠️ ace को face card न गिनें; standard face cards केवल J,Q,K हैं।', 'red king या black ace की probability?', '(2+2)/52=1/13'),
            advancedFormula('Fundamental counting principle', 'एक काम m तरीकों और अगला n तरीकों से → दोनों क्रमशः mn तरीकों से', 'हर पहले विकल्प के साथ दूसरे के सभी विकल्प जुड़ते हैं, इसलिए गुणा। वैकल्पिक अलग-अलग cases हों तो जोड़।', '3 shirts और 4 trousers → 12 outfits', '⚠️ “और” में गुणा, mutually exclusive “या” में जोड़ का संकेत पहचानें।', '2 routes A-B और 5 routes B-C; A से C कितने तरीके?', '10'),
            advancedFormula('Factorial', 'n!=n(n−1)…2·1 | 0!=1 | n!=n×(n−1)!', 'n अलग वस्तुओं को क्रम में लगाने के लिए पहली जगह n, अगली n−1… विकल्प देती है।', '5!=120', '⚠️ 0!=0 नहीं, 1 होता है।', '8!/6! का मान?', '8×7=56'),
            advancedFormula('Permutation', 'ⁿPᵣ=n!/(n−r)! | सभी n अलग वस्तुओं की व्यवस्था=n!', 'जहाँ order बदलने से outcome बदलता है वहाँ permutation। पद, rank, arrangement और code इसके संकेत हैं।', '5 में से president और secretary =5P2=20', '⚠️ committee selection में order नहीं होता; वहाँ combination लें।', '7 धावकों में gold-silver-bronze कितने तरीकों से?', '7P3=210'),
            advancedFormula('Combination', 'ⁿCᵣ=n!/[r!(n−r)!] | ⁿCᵣ=ⁿCₙ₋ᵣ', 'Selection में order irrelevant है। हर group permutation में r! बार गिना जाता, इसलिए r! से भाग।', '5 में से 2 सदस्य =5C2=10', '⚠️ AB और BA को अलग गिनना combination में duplicate है।', '10 में से 3 की committee?', '10C3=120'),
            advancedFormula('Repeated letters arrangement', 'n अक्षरों में repetitions p,q… हों → n!/(p!q!…)', 'समान अक्षरों की अदला-बदली नई व्यवस्था नहीं बनाती, इसलिए उनकी internal permutations से भाग देते हैं।', 'LEVEL: 5!/(2!2!)=30', '⚠️ हर repeated group का factorial अलग से denominator में आएगा।', 'BANANA के अक्षरों की arrangements?', '6!/(3!2!)=60'),
            advancedFormula('Circular permutation', 'n अलग व्यक्तियों की वृत्ताकार व्यवस्था=(n−1)! | necklace (reflection same)=(n−1)!/2', 'Circle घुमाने पर वही arrangement रहता है; एक व्यक्ति fix करके बाकी n−1 को arrange करते हैं।', '6 लोग गोल मेज पर =5!=120', '⚠️ row arrangement n! और circular (n−1)! को न मिलाएँ।', '8 लोग round table पर?', '7!=5040')
        ]
    },
    {
        id: 'ages-calendar-clock', name: 'आयु, कैलेंडर व घड़ी', icon: '🗓️', color: '#be123c',
        desc: 'RRB/ALP/Technician के age calculations, odd days, leap year और clock-angle प्रश्न',
        subtopics: ['आयु समीकरण', 'अनुपात आधारित आयु', 'Odd days', 'Leap year', 'घड़ी कोण व coincidence'],
        formulas: [
            advancedFormula('आयु का time-shift नियम', 'x वर्ष बाद: हर आयु में +x | x वर्ष पहले: हर आयु में −x | आयु-अंतर हमेशा स्थिर', 'समय सभी व्यक्तियों पर बराबर गुजरता है। इसलिए ratio बदलता है लेकिन difference कभी नहीं बदलता।', 'पिता 40, पुत्र 15 → अंतर 25; 10 वर्ष बाद 50 और 25, अंतर फिर 25', '⚠️ वर्षों को ratio में जोड़ना गलत; वास्तविक ages में जोड़ें।', 'A, B से 8 वर्ष बड़ा है। 5 वर्ष बाद अंतर?', '8 वर्ष'),
            advancedFormula('वर्तमान आयु अनुपात', 'आयु m:n और अंतर d → एक ratio-unit=d/(m−n); आयु = unit×ratio', 'Ratio parts का अंतर वास्तविक age difference के बराबर रखा जाता है।', 'A:B=7:4, अंतर 15 → unit=5 → ages 35,20', '⚠️ d को m+n से भाग न दें; अंतर के लिए m−n।', 'पिता-पुत्र 9:4, अंतर 30; पुत्र की आयु?', '24 वर्ष'),
            advancedFormula('Past/Future ratio equation', '(A±t)/(B±t)=m/n → cross multiplication', 'पहले वर्तमान ages variables में रखें, फिर दोनों में समान t जोड़/घटा कर ratio equation बनाएँ।', 'A:B=3:2; 8 साल बाद 5:4 → (3x+8)/(2x+8)=5/4 → x=4 → ages 12,8', '⚠️ केवल एक व्यक्ति में t जोड़ना सबसे आम गलती है।', 'A:B=5:3; 10 वर्ष पहले 3:1; वर्तमान B?', '15 वर्ष'),
            advancedFormula('औसत आयु में नया सदस्य', 'पुराना total=n×old avg | नया total=(n±1)×new avg | नई/हटी आयु = totals का अंतर', 'Average को व्यक्ति-संख्या से गुणा करके total age बनाना ही सुरक्षित तरीका है।', '5 का avg 20; नया सदस्य आने पर avg 22 → नई आयु=6×22−5×20=32', '⚠️ averages का अंतर ही नई आयु नहीं होता।', '8 लोगों का avg 25; एक गया तो avg 24; जाने वाले की आयु?', '32 वर्ष'),
            advancedFormula('Leap year', 'वर्ष 4 से divisible → leap; century year केवल 400 से divisible होने पर leap', 'पृथ्वी-वर्ष लगभग 365.242 दिन है; 4-year adjustment होता है, पर centuries में 400-rule correction देता है।', '2000 leap, 1900 not leap, 2024 leap', '⚠️ हर 100-divisible year को leap न मानें।', '2100 leap year है?', 'नहीं (400 से विभाज्य नहीं)'),
            advancedFormula('Odd days', 'साधारण वर्ष=1 odd day | leap year=2 | 100 वर्ष=5 | 200=3 | 300=1 | 400=0', 'पूर्ण सप्ताह दिन नहीं बदलते; 7 से भाग का remainder odd days है। 365 mod 7=1 और 366 mod 7=2।', '2 साधारण +1 leap year → 1+1+2=4 odd days', '⚠️ leap day उस तारीख से पहले आया है या नहीं, date questions में जाँचें।', '800 वर्षों में odd days?', '0'),
            advancedFormula('महीनों के odd days', '31 दिन→3 odd; 30→2; Feb 28→0, leap Feb 29→1', 'दिनों को 7 से भाग देने पर remainder weekday shift देता है।', 'April के 30 दिन → 2 odd days', '⚠️ January/February के बाद leap-year adjustment भूलना नहीं।', 'Jan+Feb 2024 के odd days?', '3+1=4'),
            advancedFormula('Same calendar', 'Calendar वही जब total odd days=0 और दोनों years का leap-status compatible हो', 'सप्ताह-दिन cycle तथा February की संरचना दोनों match होनी चाहिए। सामान्यतः 6, 11 या 28 वर्ष बाद repeat मिल सकता है।', '2017 (normal) का calendar 2023 (normal) से मेल: बीच shift 0 mod 7', '⚠️ सिर्फ odd days 0 देखकर leap/non-leap mismatch न छोड़ें।', 'एक leap year calendar के exact repetition की निश्चित बड़ी cycle?', '28 वर्ष'),
            advancedFormula('घड़ी की सुइयों की चाल', 'Minute hand=6°/min | Hour hand=0.5°/min | relative speed=5.5°/min', 'Minute hand 60 मिनट में 360° और hour hand 12 घंटे में 360° चलती है।', '20 मिनट में minute=120°, hour ने अतिरिक्त 10° चला', '⚠️ hour hand को घंटे के अंक पर स्थिर न मानें।', '3:20 पर hour hand का 12 से angle?', '100°'),
            advancedFormula('घड़ी का कोण', 'h:m पर angle = |30h−5.5m|; छोटा कोण = min(θ,360−θ)', 'Hour position 30h+0.5m और minute position 6m; अंतर |30h−5.5m|।', '4:20 → |120−110|=10°', '⚠️ प्राप्त angle 180° से बड़ा हो तो 360° से घटाएँ।', '7:20 पर छोटा कोण?', '100°'),
            advancedFormula('सुइयाँ कब मिलेंगी', 'h बजे के बाद coincidence time = 60h/11 मिनट | 12 घंटे में 11 बार', 'Minute hand hour hand को 5.5°/min की relative speed से पकड़ती है; शुरुआती gap 30h° है।', '3 बजे के बाद: 180/11=16 4/11 मिनट', '⚠️ 12 घंटे में 12 बार नहीं, 11 बार मिलती हैं।', '5 बजे के बाद कब मिलेंगी?', '27 3/11 मिनट बाद'),
            advancedFormula('समकोण और विपरीत दिशा', '|30h−5.5m|=90° (या 270°) | विपरीत के लिए =180°', 'दिए interval में equation के valid minute solutions चुनें; 0≤m<60 होना चाहिए।', '3 बजे ठीक 90°; 6 बजे ठीक 180°', '⚠️ equation से निकला m अगले घंटे में हो तो reject करें।', '2 और 3 बजे के बीच सुइयाँ कब विपरीत होंगी?', '43 7/11 मिनट past 2')
        ]
    }
);

LEARN_TOPICS.push(
    { id: 'statistics-di', name: 'सांख्यिकी व डेटा इंटरप्रिटेशन', icon: '📊', color: '#0369a1', chapter: 'statistics-di', desc: 'SSC Tier-II का mean-median-mode, SD तथा tables/graphs का पूरा mastery module', tags: ['Mean-Median-Mode', 'SD', 'Pie/Bar DI'] },
    { id: 'probability-counting', name: 'प्रायिकता व गणना-विधि', icon: '🎲', color: '#7e22ce', chapter: 'probability-counting', desc: 'Coins, dice, cards, complement और P&C — basic से exam level तक', tags: ['Probability', 'P&C', 'Cards-Dice'] },
    { id: 'ages-calendar-clock', name: 'आयु, कैलेंडर व घड़ी', icon: '🗓️', color: '#be123c', chapter: 'ages-calendar-clock', desc: 'RRB के age calculations, odd-days, leap-year और clock-angle mastery', tags: ['Ages', 'Odd Days', 'Clock'] }
);

TOPIC_GUIDES.push(
    {
        id: 'statistics-di', exams: { cgl1: '1-2', cgl2: '3-5', chsl: '1-3', ntpc: '2-4', groupd: '1-2' },
        syllabus: ['Arithmetic mean', 'Median और mode', 'Grouped data', 'Variance व standard deviation', 'Tables', 'Bar diagram', 'Pie chart', 'Histogram', 'Frequency polygon', 'Caselet DI'],
        types: [
            { t: 'Missing value from mean', p: 'औसत दिया और एक value गायब', e: 'Total=n×mean; ज्ञात योग घटाएँ' },
            { t: 'Combined average', p: 'दो समूह और अलग sizes', e: 'Weighted totals जोड़ें' },
            { t: 'Median/mode', p: 'क्रम या frequency', e: 'पहले sort/cumulative frequency' },
            { t: 'SD transformation', p: 'हर value में +a या ×k', e: 'shift no effect; scale by |k|' },
            { t: 'Pie chart', p: 'sector angle/percentage', e: '1%=3.6°' },
            { t: 'Table/bar comparison', p: 'वर्षों/श्रेणियों की तुलना', e: 'units और denominator जाँचें' }
        ],
        traps: ['Σf को observations की संख्या मानें', 'Median से पहले sort करें', 'SD और variance न मिलाएँ', 'Pie angle को प्रतिशत न समझें', 'Percentage change का base पुराना value रखें'],
        plan: ['दिन 1: mean + assumed mean, 40 सवाल', 'दिन 2: median/mode + grouped data, 35 सवाल', 'दिन 3: variance/SD, 30 सवाल', 'दिन 4: table/bar/pie DI, 8 timed sets', 'दिन 5: histogram + mixed mock और error review'],
        books: 'Official SSC Mathematical Abilities syllabus + PYQ chart patterns', target: 'Single calculation ≤45 sec; 5-question DI set ≤5 min'
    },
    {
        id: 'probability-counting', exams: { cgl1: '0-1', cgl2: '1-3', chsl: '0-1', ntpc: '0-1', groupd: '0-1' },
        syllabus: ['Sample space', 'Complement', 'Addition rule', 'Independent events', 'Coins', 'Dice', 'Cards', 'Counting principle', 'Factorial', 'Permutation', 'Combination', 'Circular arrangement'],
        types: [
            { t: 'Direct probability', p: 'अनुकूल/कुल outcome', e: 'Sample space साफ लिखें' },
            { t: 'At least one', p: 'कम-से-कम शब्द', e: '1−none' },
            { t: 'A or B', p: 'overlapping events', e: 'P(A)+P(B)−P(A∩B)' },
            { t: 'Dice sum', p: 'दो पासों का योग', e: '36 ordered pairs' },
            { t: 'Rank/arrangement', p: 'क्रम महत्वपूर्ण', e: 'nPr' },
            { t: 'Committee/selection', p: 'क्रम महत्वहीन', e: 'nCr' }
        ],
        traps: ['At least one को exactly one न मानें', 'Without replacement स्वतंत्र नहीं', 'Ace face card नहीं', 'Selection में nPr न लगाएँ', 'Repeated letters के factorial से भाग करें'],
        plan: ['दिन 1: sample space + complement, 35 सवाल', 'दिन 2: coins/dice, 40 सवाल', 'दिन 3: cards + addition rule, 40 सवाल', 'दिन 4: factorial, nPr, nCr, 40 सवाल', 'दिन 5: mixed timed test + error log'],
        books: 'SSC Tier-II simple probability scope; counting foundation for broad exam coverage', target: 'Probability tree/sample space बिना गलती; P या C पहचान ≤5 sec'
    },
    {
        id: 'ages-calendar-clock', exams: { cgl1: '0-1', cgl2: '0-1', chsl: '0-1', ntpc: '1-3', groupd: '1-2' },
        syllabus: ['Present/past/future ages', 'Age ratio', 'Average ages', 'Leap year', 'Odd days', 'Day of week', 'Same calendar', 'Clock angle', 'Coincidence', 'Right/opposite angles'],
        types: [
            { t: 'Age ratio + difference', p: 'm:n और वर्षों का अंतर', e: 'unit=d/(m−n)' },
            { t: 'Future/past ratio', p: 'x साल बाद/पहले', e: 'दोनों ages में ±x' },
            { t: 'Day of week', p: 'पुरानी/आने वाली date', e: 'total odd days mod 7' },
            { t: 'Leap count', p: 'date range', e: '÷4−÷100+÷400' },
            { t: 'Clock angle', p: 'h:m पर angle', e: '|30h−5.5m|' },
            { t: 'Hands meet', p: 'कब साथ आएँगी', e: '60h/11 min' }
        ],
        traps: ['Age difference हमेशा स्थिर', 'Century leap only ÷400', 'Date range endpoints जाँचें', 'Hour hand चलता रहता है', 'Angle >180 हो तो 360−θ'],
        plan: ['दिन 1: basic age equations, 40 सवाल', 'दिन 2: ratio/average ages, 35 सवाल', 'दिन 3: leap year + odd days, 40 सवाल', 'दिन 4: calendar repetition + day finding, 30 सवाल', 'दिन 5: clock angles/coincidence, 45 सवाल'],
        books: 'Official RRB ALP/Technician mathematics syllabus topics', target: 'Age equation ≤35 sec; calendar ≤60 sec; clock angle ≤20 sec'
    }
);

const ADVANCED_DAILY_QUESTIONS = [
    { q:'5, 8, 12, 15, 20 का माध्य?', options:['10','11','12','13'], ans:2, explain:'योग 60, n=5 → 12', topic:'सांख्यिकी व डेटा इंटरप्रिटेशन', difficulty:'आसान' },
    { q:'20 छात्रों का avg 45 और 30 का avg 55। संयुक्त avg?', options:['48','50','51','52'], ans:2, explain:'(900+1650)/50=51', topic:'सांख्यिकी व डेटा इंटरप्रिटेशन', difficulty:'मध्यम' },
    { q:'3,9,4,11,7,6 का median?', options:['6','6.5','7','7.5'], ans:1, explain:'क्रम 3,4,6,7,9,11 → (6+7)/2', topic:'सांख्यिकी व डेटा इंटरप्रिटेशन', difficulty:'आसान' },
    { q:'Mean=18, median=20; empirical mode?', options:['20','22','24','26'], ans:2, explain:'3×20−2×18=24', topic:'सांख्यिकी व डेटा इंटरप्रिटेशन', difficulty:'मध्यम' },
    { q:'SD=7; हर मान में 12 जोड़ें। नया SD?', options:['7','12','19','84'], ans:0, explain:'Shift से SD नहीं बदलता', topic:'सांख्यिकी व डेटा इंटरप्रिटेशन', difficulty:'आसान' },
    { q:'Variance=16; हर मान को 3 से गुणा करें। नया variance?', options:['48','96','144','256'], ans:2, explain:'Variance k² से बदलता: 16×9', topic:'सांख्यिकी व डेटा इंटरप्रिटेशन', difficulty:'मध्यम' },
    { q:'Pie chart में 72° sector कितना प्रतिशत?', options:['18%','20%','25%','30%'], ans:1, explain:'72/360×100=20%', topic:'सांख्यिकी व डेटा इंटरप्रिटेशन', difficulty:'आसान' },
    { q:'कुल 900 में 40° sector का value?', options:['80','90','100','120'], ans:2, explain:'40/360×900=100', topic:'सांख्यिकी व डेटा इंटरप्रिटेशन', difficulty:'मध्यम' },
    { q:'उत्पादन 400 से 460; प्रतिशत वृद्धि?', options:['12%','15%','18%','20%'], ans:1, explain:'60/400×100=15%', topic:'सांख्यिकी व डेटा इंटरप्रिटेशन', difficulty:'आसान' },
    { q:'25-35 class का class mark?', options:['25','30','35','60'], ans:1, explain:'(25+35)/2=30', topic:'सांख्यिकी व डेटा इंटरप्रिटेशन', difficulty:'आसान' },
    { q:'Range of 8,19,3,25,11?', options:['19','20','22','28'], ans:2, explain:'25−3=22', topic:'सांख्यिकी व डेटा इंटरप्रिटेशन', difficulty:'आसान' },
    { q:'50 kg @₹30 और 30 kg @₹50 का weighted price?', options:['₹35','₹37.5','₹40','₹42.5'], ans:1, explain:'(1500+1500)/80=37.5', topic:'सांख्यिकी व डेटा इंटरप्रिटेशन', difficulty:'मध्यम' },
    { q:'एक पासे पर prime आने की probability?', options:['1/3','1/2','2/3','5/6'], ans:1, explain:'2,3,5 → 3/6', topic:'प्रायिकता व गणना-विधि', difficulty:'आसान' },
    { q:'दो सिक्कों में कम-से-कम एक head?', options:['1/4','1/2','3/4','1'], ans:2, explain:'1−P(TT)=3/4', topic:'प्रायिकता व गणना-विधि', difficulty:'आसान' },
    { q:'दो पासों का योग 7?', options:['1/12','1/9','1/6','1/3'], ans:2, explain:'6 outcomes/36', topic:'प्रायिकता व गणना-विधि', difficulty:'आसान' },
    { q:'52 cards से face card?', options:['3/13','1/4','4/13','1/13'], ans:0, explain:'12/52=3/13', topic:'प्रायिकता व गणना-विधि', difficulty:'आसान' },
    { q:'Card king या heart होने की probability?', options:['3/13','4/13','5/13','17/52'], ans:1, explain:'4+13−1=16; 16/52=4/13', topic:'प्रायिकता व गणना-विधि', difficulty:'मध्यम' },
    { q:'3 सिक्कों में exactly 2 heads?', options:['1/8','1/4','3/8','1/2'], ans:2, explain:'HHT,HTH,THH =3/8', topic:'प्रायिकता व गणना-विधि', difficulty:'मध्यम' },
    { q:'6! का मान?', options:['120','360','720','840'], ans:2, explain:'6×5×4×3×2=720', topic:'प्रायिकता व गणना-विधि', difficulty:'आसान' },
    { q:'8P2?', options:['16','28','56','64'], ans:2, explain:'8×7=56', topic:'प्रायिकता व गणना-विधि', difficulty:'आसान' },
    { q:'8C2?', options:['16','28','56','64'], ans:1, explain:'8×7/2=28', topic:'प्रायिकता व गणना-विधि', difficulty:'आसान' },
    { q:'5 लोग गोल मेज पर कितने तरीकों से?', options:['24','60','120','720'], ans:0, explain:'(5−1)!=24', topic:'प्रायिकता व गणना-विधि', difficulty:'मध्यम' },
    { q:'MOM के अक्षरों की arrangements?', options:['2','3','6','9'], ans:1, explain:'3!/2!=3', topic:'प्रायिकता व गणना-विधि', difficulty:'आसान' },
    { q:'3 shirts, 5 trousers से outfits?', options:['8','10','15','30'], ans:2, explain:'3×5=15', topic:'प्रायिकता व गणना-विधि', difficulty:'आसान' },
    { q:'A:B आयु 7:5, अंतर 10। A?', options:['25','30','35','40'], ans:2, explain:'2 units=10 → A=35', topic:'आयु, कैलेंडर व घड़ी', difficulty:'आसान' },
    { q:'पिता पुत्र से 28 वर्ष बड़े। 12 वर्ष बाद अंतर?', options:['16','28','40','52'], ans:1, explain:'आयु अंतर स्थिर', topic:'आयु, कैलेंडर व घड़ी', difficulty:'आसान' },
    { q:'4 लोगों की avg age 20; नया आने पर avg 22। नए की age?', options:['22','25','28','30'], ans:3, explain:'5×22−4×20=30', topic:'आयु, कैलेंडर व घड़ी', difficulty:'मध्यम' },
    { q:'इनमें leap year कौन?', options:['1900','2100','2000','2200'], ans:2, explain:'Century केवल 400 से divisible होने पर leap', topic:'आयु, कैलेंडर व घड़ी', difficulty:'आसान' },
    { q:'साधारण वर्ष में odd days?', options:['0','1','2','3'], ans:1, explain:'365 mod 7=1', topic:'आयु, कैलेंडर व घड़ी', difficulty:'आसान' },
    { q:'Leap year में odd days?', options:['0','1','2','3'], ans:2, explain:'366 mod 7=2', topic:'आयु, कैलेंडर व घड़ी', difficulty:'आसान' },
    { q:'400 वर्षों में odd days?', options:['0','1','2','5'], ans:0, explain:'Gregorian 400-year cycle पूर्ण सप्ताह', topic:'आयु, कैलेंडर व घड़ी', difficulty:'मध्यम' },
    { q:'5:20 पर सुइयों का छोटा angle?', options:['30°','40°','50°','60°'], ans:1, explain:'|150−110|=40°', topic:'आयु, कैलेंडर व घड़ी', difficulty:'आसान' },
    { q:'Minute hand की चाल?', options:['0.5°/min','5.5°/min','6°/min','30°/min'], ans:2, explain:'360/60=6°/min', topic:'आयु, कैलेंडर व घड़ी', difficulty:'आसान' },
    { q:'Hour hand की चाल?', options:['0.5°/min','5°/min','6°/min','30°/min'], ans:0, explain:'30° per hour =0.5°/min', topic:'आयु, कैलेंडर व घड़ी', difficulty:'आसान' },
    { q:'12 घंटे में सुइयाँ कितनी बार मिलती हैं?', options:['10','11','12','13'], ans:1, explain:'Relative cycle में 11 coincidences', topic:'आयु, कैलेंडर व घड़ी', difficulty:'मध्यम' },
    { q:'6:00 पर angle?', options:['90°','120°','150°','180°'], ans:3, explain:'|180−0|=180°', topic:'आयु, कैलेंडर व घड़ी', difficulty:'आसान' }
];
DAILY_BANK.push(...ADVANCED_DAILY_QUESTIONS);

STUDY_NOTES.push(
    { id:'statistics-di', name:'सांख्यिकी व DI — Master Notes', minutes:'55 मिनट', lang:'hi', sections:[
        { h:'1. Data पढ़ने की 6-step विधि', b:['Title, unit, legend और time-period पहले पढ़ें।','पूछे गए rows/columns ही mark करें; पूरी table calculate न करें।','Absolute difference और percentage difference अलग रखें।','Approximation तभी जब options दूर हों।'], f:['% change=(new−old)/old×100','Pie value=angle/360×total'], ex:['400→460 =15% वृद्धि; reverse कमी 60/460=13.04%, समान नहीं।'] },
        { h:'2. Mean–Median–Mode', b:['Mean total balance है, median positional middle और mode highest frequency।','Outliers mean को ज्यादा प्रभावित करते हैं।'], f:['x̄=Σfx/Σf','Mode≈3Median−2Mean'], ex:['Mean 18, median 20 → mode≈24।'] },
        { h:'3. Dispersion', b:['Range केवल extremes देखता है; SD हर observation देखता है।','Shift SD नहीं बदलता, scale बदलता है।'], f:['σ=√[Σ(x−x̄)²/n]'], ex:['SD 4; values 2x+9 → नया SD 8।'] }
    ]},
    { id:'probability-counting', name:'Probability & Counting — Master Notes', minutes:'50 मिनट', lang:'hi', sections:[
        { h:'1. Sample-space discipline', b:['Coin, dice और card के outcomes पहले लिखें।','At least one में complement सबसे तेज़ है।'], f:['P(E)=favourable/total','P(at least one)=1−P(none)'], ex:['3 coins: कम-से-कम एक H =1−1/8=7/8।'] },
        { h:'2. OR बनाम AND', b:['Independent AND में multiply; overlapping OR में intersection घटाएँ।','Without replacement में denominator और probability बदलती है।'], f:['P(A∪B)=P(A)+P(B)−P(A∩B)'], ex:['King या heart=(4+13−1)/52=4/13।'] },
        { h:'3. P या C पहचान', b:['Rank, seat, code, arrangement → order matters → P।','Team, committee, selection → order नहीं → C।'], f:['nPr=n!/(n−r)!','nCr=n!/[r!(n−r)!]'], ex:['8 से captain+vice captain=8P2=56; 2-member team=8C2=28।'] }
    ]},
    { id:'ages-calendar-clock', name:'Ages, Calendar & Clock — Master Notes', minutes:'50 मिनट', lang:'hi', sections:[
        { h:'1. Age equation map', b:['वर्तमान age को variable मानें; past/future में दोनों व्यक्तियों पर समान shift।','Age difference permanent invariant है।'], f:['ratio m:n, difference d → unit=d/(m−n)'], ex:['9:5, अंतर 24 → unit 6 → ages 54,30।'] },
        { h:'2. Calendar engine', b:['हर अवधि के total days को mod 7 करें।','Century leap-year rule 400 है।'], f:['Leap count=⌊y/4⌋−⌊y/100⌋+⌊y/400⌋'], ex:['2000 leap; 1900 सामान्य।'] },
        { h:'3. Clock engine', b:['Hour hand minute के साथ 0.5° प्रति मिनट चलती है।','हर angle answer में smaller/reflex wording देखें।'], f:['θ=|30h−5.5m|','coincidence after h=60h/11 min'], ex:['8:20 → |240−110|=130°।'] }
    ]}
);

PATTERNS.push(
    { id:'di-base', name:'DI denominator पैटर्न', type:'सांख्यिकी व DI', signal:'प्रतिशत वृद्धि/कमी या तुलना', concept:'जिस value से यात्रा शुरू हुई वही denominator', formula:'% change=(new−old)/old×100', pyqExamples:['400→500=25% वृद्धि','500→400=20% कमी'], variants:['Profit growth','Population decline'], trap:'Forward और reverse प्रतिशत समान मानना' },
    { id:'sd-transform', name:'SD transformation पैटर्न', type:'सांख्यिकी', signal:'हर observation में constant जोड़ना या scale करना', concept:'Shift distances नहीं बदलता; scale बदलता है', formula:'SD(ax+b)=|a|SD(x)', pyqExamples:['SD 5, 3x+7 →15'], variants:['Variance a² से','Mean ax+b से'], trap:'b को SD में जोड़ना' },
    { id:'at-least-one', name:'At least one complement', type:'प्रायिकता', signal:'कम-से-कम एक / one or more', concept:'उलटी घटना none अक्सर एक ही case है', formula:'P(≥1)=1−P(0)', pyqExamples:['2 coins ≥1H=3/4','3 dice ≥1 six=91/216'], variants:['Defective items','Success trials'], trap:'Exactly one निकाल देना' },
    { id:'p-or-c', name:'Permutation या Combination पहचान', type:'गणना-विधि', signal:'arrange/rank बनाम select/team', concept:'Order बदले तो नया outcome?', formula:'Order yes→nPr; no→nCr', pyqExamples:['President-secretary=Permutation','Committee=Combination'], variants:['Codes','Seating'], trap:'हर selection में nPr लगाना' },
    { id:'age-difference', name:'Age invariant पैटर्न', type:'आयु', signal:'वर्ष बाद/पहले और दो लोग', concept:'दोनों ages पर समान समय, इसलिए अंतर स्थिर', formula:'(A+t)−(B+t)=A−B', pyqExamples:['आज अंतर 20 तो 10 साल बाद भी 20'], variants:['Ratio changes','Average age'], trap:'Difference में years जोड़ना' },
    { id:'clock-angle', name:'Clock 30h−5.5m पैटर्न', type:'घड़ी', signal:'h:m पर सुइयों का angle', concept:'hour=30h+0.5m, minute=6m', formula:'θ=|30h−5.5m|', pyqExamples:['4:20=10°','7:20=100°'], variants:['Right angle','Opposite'], trap:'Hour hand को fixed रखना' }
);

TRAPS.push(
    { id:'trap-di-base', type:'DI ट्रैप', title:'Percentage change में गलत base', example:'400→500 को 100/500=20% लिखना', why:'नया value आँख के सामने रहता है', detection:'वृद्धि और reverse कमी समान दिख रही', prevention:'FROM value को denominator में box करें' },
    { id:'trap-median-sort', type:'Statistics ट्रैप', title:'Median से पहले sort न करना', example:'9,2,5 का middle-written 2 मानना', why:'Position और written order मिल जाते हैं', detection:'Data ascending नहीं है', prevention:'पहला step हमेशा ascending arrangement' },
    { id:'trap-sd-shift', type:'Statistics ट्रैप', title:'SD में constant जोड़ना', example:'SD 5; x+10 का SD 15 लिखना', why:'Mean transformation rule SD पर लगा दिया', detection:'सभी values समान shift हुए', prevention:'Shift affects mean, not spread' },
    { id:'trap-atleast', type:'Probability ट्रैप', title:'At least one = exactly one', example:'2 coins में ≥1H को HT,TH तक सीमित करना', why:'HH भूल जाता है', detection:'“कम-से-कम” लिखा है', prevention:'1−none अपनाएँ' },
    { id:'trap-card-face', type:'Probability ट्रैप', title:'Ace को face card गिनना', example:'Face cards 16 लिखना', why:'Ace विशेष card है पर face नहीं', detection:'J,Q,K list लिखी नहीं', prevention:'Face=J,Q,K केवल 12' },
    { id:'trap-pc-order', type:'Counting ट्रैप', title:'Selection और arrangement मिलाना', example:'5 में से 2-member team=20 लिखना', why:'AB और BA duplicate हैं', detection:'Roles/order दिए नहीं', prevention:'Order-change test करें; नहीं बदले तो C' },
    { id:'trap-age-shift', type:'Age ट्रैप', title:'Future years केवल एक age में जोड़ना', example:'5 साल बाद ratio में (A+5)/B', why:'दूसरे व्यक्ति पर समय भूल गए', detection:'Equation में ±t एक ही तरफ', prevention:'Timeline बनाकर हर जीवित व्यक्ति में समान shift' },
    { id:'trap-century-leap', type:'Calendar ट्रैप', title:'हर century को leap मानना', example:'1900 leap लिखना', why:'÷4 rule अकेला याद है', detection:'वर्ष 00 पर खत्म', prevention:'Century पर ÷400 test अनिवार्य' },
    { id:'trap-hour-fixed', type:'Clock ट्रैप', title:'Hour hand को अंक पर स्थिर मानना', example:'3:20 पर hour angle 90° रखना', why:'छोटी चाल दिखती नहीं', detection:'0.5m term गायब', prevention:'Hour angle=30h+0.5m हमेशा लिखें' }
);

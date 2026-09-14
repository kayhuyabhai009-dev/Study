/* Additional official-syllabus exam profiles. Dates are deliberately notice-led:
   candidates must verify the current notice instead of relying on predictions. */
EXAMS.push(
    {
        id:'ssc-selection-post', name:'SSC Selection Post', badge:'SSC',
        short:'Matric, 10+2 और Graduate level के अलग-अलग पद — level-wise Quant syllabus',
        tags:['25 Quant questions','50 Quant marks','0.50 negative','तीन qualification levels'],
        overview:'Selection Post में अलग-अलग मंत्रालयों/विभागों के पद आते हैं। परीक्षा स्तर पद की essential qualification—Matriculation, Higher Secondary या Graduation—से तय होता है।',
        structure:[{title:'Computer Based Examination',note:'चारों sections समान weight रखते हैं; level के अनुसार question standard बदलता है।',table:{head:['विषय','प्रश्न','अंक'],rows:[['General Intelligence','25','50'],['General Awareness','25','50'],['Quantitative Aptitude','25','50'],['English Language','25','50'],['कुल','100','200']]},marking:'हर गलत उत्तर पर −0.50; समय latest notice के अनुसार जाँचें।'}],
        mathsWeightage:'Arithmetic foundation सबसे महत्वपूर्ण: percentage, ratio, average, interest, profit-loss, time-work-distance और tables/graphs। Higher levels में algebra, geometry, mensuration, trigonometry और statistical charts भी आते हैं।',
        syllabus:['Whole numbers, decimals, fractions और number relationships','Percentage, ratio-proportion, square roots, averages','SI-CI, profit-loss, discount, partnership, mixture-alligation','Time-distance और time-work','Algebra, geometry, mensuration, trigonometry','Tables, histogram, frequency polygon, bar और pie chart'],
        dates:['भर्ती phase-wise notification से चलती है; current phase की application/exam dates केवल ssc.gov.in notice से सत्यापित करें।'],
        strategy:'पहले qualification level पहचानें। 25-question Quant mini-mock को 15-18 मिनट में 85%+ accuracy से करने का लक्ष्य रखें।'
    },
    {
        id:'ssc-stenographer', name:'SSC Stenographer Grade C & D', badge:'SSC',
        short:'CBT में अलग Quant section नहीं — Maths की जगह Reasoning, GA और English',
        tags:['Maths section नहीं','Skill Test आवश्यक','200 CBT questions'],
        overview:'यह profile इसलिए शामिल है ताकि विद्यार्थी गलत syllabus न पढ़े। Stenographer CBT में Quantitative Aptitude का अलग paper नहीं होता; selection में stenography skill test निर्णायक qualifying stage है।',
        structure:[{title:'Computer Based Examination',table:{head:['विषय','प्रश्न','अंक'],rows:[['General Intelligence & Reasoning','50','50'],['General Awareness','50','50'],['English Language & Comprehension','100','100'],['कुल','200','200']]},marking:'Objective CBT के बाद stenography skill test; latest notice में negative marking और timings verify करें।'}],
        mathsWeightage:'अलग Mathematics/Quant section: 0। Reasoning में basic numerical operations आ सकते हैं, पर SSC Quant syllabus लागू नहीं समझें।',
        syllabus:['General Intelligence & Reasoning','General Awareness','English Language & Comprehension','Stenography Skill Test'],
        dates:['Current cycle की dates और skill-test standards official SSC notice से देखें।'],
        strategy:'इस परीक्षा के लिए Quant पर disproportionate समय न दें। English vocabulary/grammar, reasoning और daily shorthand dictation पर focus करें।'
    },
    {
        id:'rrb-technician', name:'RRB Technician Grade I Signal / Grade III', badge:'RRB',
        short:'Grade I में advanced school maths; Grade III में core Railway arithmetic',
        tags:['Grade-wise syllabus','100 questions','1/3 negative','Statistics + Probability'],
        overview:'Technician categories का mathematics syllabus grade के अनुसार अलग है। Grade I Signal में quadratic equation, AP, coordinate geometry, sets, dispersion और probability तक; Grade III में core arithmetic और elementary maths आती है।',
        structure:[{title:'CBT — Technician Grade III (indicative distribution)',table:{head:['विषय','प्रश्न','अंक'],rows:[['Mathematics','25','25'],['General Intelligence & Reasoning','25','25'],['General Science','40','40'],['General Awareness','10','10'],['कुल','100','100']]},marking:'गलत उत्तर पर सामान्यतः 1/3 mark deduction; अपने CEN में confirm करें।'},{title:'Grade I Signal',note:'Maths scope में rational/irrational numbers, quadratic equations, AP, coordinate geometry, trigonometry, sets, grouped/ungrouped statistics और probability शामिल हैं।'}],
        mathsWeightage:'Grade III: लगभग 25 maths questions। Grade I का subject mix अलग है और algebra/statistics depth अधिक है।',
        syllabus:['Number system, BODMAS, decimals, fractions, LCM-HCF','Ratio, percentage, mensuration, time-work-distance','SI-CI, profit-loss, algebra, geometry, trigonometry','Age, calendar-clock, pipes-cistern','Grade I: quadratic equations, AP, coordinate geometry, sets','Grade I: range, mean deviation, variance, SD और probability'],
        dates:['CEN 02/2025 और बाद के corrigenda/current schedules official regional RRB website से verify करें।'],
        strategy:'पहले अपना grade syllabus lock करें। Grade III के लिए arithmetic speed; Grade I के लिए formula derivation + statistics/probability test sets जोड़ें।'
    },
    {
        id:'rpf-constable', name:'RPF Constable', badge:'RRB',
        short:'10th-level CBT — Arithmetic के 35 marks, speed और accuracy प्रधान',
        tags:['Arithmetic: 35','90 मिनट','1/3 negative','PET/PMT'],
        overview:'RPF Constable recruitment में CBT के बाद PET/PMT और document verification होते हैं। Mathematics section का नाम Arithmetic है और standard सामान्यतः 10वीं स्तर का है।',
        structure:[{title:'Computer Based Test',table:{head:['विषय','प्रश्न/अंक'],rows:[['Basic Arithmetic','35'],['General Intelligence & Reasoning','35'],['General Awareness','50'],['कुल','120']]},marking:'कुल 90 मिनट; गलत उत्तर पर 1/3 mark deduction (current CEN verify करें)।'}],
        mathsWeightage:'35/120 marks: number system, whole numbers, decimals/fractions, arithmetic operations, percentage, ratio, average, interest, profit-loss, discount, tables/graphs, mensuration और time-distance।',
        syllabus:['Number system, whole numbers, decimals और fractions','Fundamental operations, percentage, ratio-proportion','Average, SI-CI, profit-loss और discount','Tables और graphs','Mensuration और time-distance'],
        dates:['Current RPF CEN, CBT/PET schedule और standards official RRB/RPF notice से verify करें।'],
        strategy:'35 arithmetic questions के लिए 25 मिनट ceiling रखें। पहले one-step arithmetic, फिर DI/mensuration; blind guessing से बचें क्योंकि 1/3 negative है।'
    },
    {
        id:'rrb-je', name:'RRB Junior Engineer (JE)', badge:'RRB',
        short:'CBT-1 में 30 Mathematics questions; CBT-2 में technical focus',
        tags:['CBT-1 Maths: 30','100 questions','90 मिनट','Technical CBT-2'],
        overview:'RRB JE diploma/engineering candidates के लिए है। CBT-1 screening में Mathematics महत्वपूर्ण है; CBT-2 का मुख्य भार technical abilities पर होता है।',
        structure:[{title:'CBT-1',table:{head:['विषय','प्रश्न'],rows:[['Mathematics','30'],['General Intelligence & Reasoning','25'],['General Awareness','15'],['General Science','30'],['कुल','100']]},marking:'90 मिनट; सामान्य RRB pattern में गलत उत्तर पर 1/3 deduction—current CEN verify करें।'},{title:'CBT-2',note:'General Awareness, Physics-Chemistry, Computers, Environment और Technical Abilities; branch-specific technical syllabus official annexure से पढ़ें।'}],
        mathsWeightage:'30/100 in CBT-1. Core arithmetic के साथ algebra, geometry, trigonometry, statistics, age, calendar-clock और pipes-cistern उपयोगी हैं।',
        syllabus:['Number systems, BODMAS, decimals/fractions, LCM-HCF','Ratio, percentage, mensuration, time-work-distance','SI-CI, profit-loss, algebra','Geometry, trigonometry, elementary statistics','Age calculations, calendar-clock, pipes-cistern'],
        dates:['JE recruitment cycle और branch-wise technical syllabus latest official CEN से verify करें।'],
        strategy:'CBT-1 में maths+reasoning को scoring engine बनाएँ। 30 questions/25 minutes का timed target और 90% accuracy रखें; CBT-2 technical preparation parallel चलाएँ।'
    }
);

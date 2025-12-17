// ========== STATE MANAGEMENT ==========
let currentSection = 'home';
let currentTest = null;
let currentQuestion = 0;
let userAnswers = [];
let soundEnabled = true;
let darkMode = false;

// ========== PERSISTENT STATE ==========
let userProgress = {
    tests: {}, // { 'c1': 85, 'c2': 100 }
    finalExam: null,
    medals: [],
    startTime: Date.now()
};

// Load progress
const savedProgress = localStorage.getItem('userProgress');
if (savedProgress) {
    userProgress = JSON.parse(savedProgress);
}

function saveProgress() {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
}

// ========== CHAPTERS DATA ==========
const chapters = [
    { id: 'c1', icon: '📊', title: '1. Noțiuni Fundamentale', desc: 'Teoria măsurătorilor, SI, erori', hours: '3T + 6IP' },
    { id: 'c2', icon: '🎯', title: '2. Precizia Prelucrării', desc: 'Toleranțe, ajustaje, rugozitate', hours: '2T + 4IP' },
    { id: 'c3-1', icon: '📏', title: '3.1 Dimensiuni Liniare', desc: 'Șublere, micrometre, comparatoare', hours: '4T + 14IP' },
    { id: 'c3-2', icon: '📐', title: '3.2 Unghiuri', desc: 'Goniometre, echere, raportoare', hours: '2T + 4IP' },
    { id: 'c3-3', icon: '🔲', title: '3.3 Suprafețe', desc: 'Planitate, drepte de referință', hours: '1T + 4IP' },
    { id: 'c3-4', icon: '⚙️', title: '3.4 Mărimi Mecanice', desc: 'Forțe, mase, presiuni, viteze', hours: '5T + 16IP' },
    { id: 'c3-5', icon: '🌡️', title: '3.5 Temperatură', desc: 'Termometre, termocuple, termorezistențe', hours: '2T + 8IP' },
    { id: 'c3-6', icon: '🔩', title: '3.6 Filete', desc: 'Calibre, micrometru filete', hours: '5T + 16IP' },
    { id: 'c3-7', icon: '⚙️', title: '3.7 Roți Dințate', desc: 'Șubler roți dințate, șabloane', hours: '4T + 12IP' },
    { id: 'c3-8', icon: '⚡', title: '3.8 Mărimi Electrice', desc: 'Multimetre, ampermetre, voltmetre', hours: '8T + 28IP' }
];

// ========== CONTENT FOR EACH CHAPTER ==========
const content = {
    'c1': {
        title: '1. Noțiuni Fundamentale din Teoria Măsurătorilor',
        intro: 'Măsurarea reprezintă procesul de comparare a unei mărimi fizice cu o unitate de măsură acceptată convențional. Este fundamentul controlului calității în industrie.',
        sections: [
            {
                title: '📊 Mărimi fizice și unități de măsură',
                text: 'Mărimile fizice pot fi împărțite în două categorii principale:',
                items: [
                    'Mărimi fundamentale: lungime (metru), masă (kilogram), timp (secundă), intensitate curent (amper), temperatură (kelvin), cantitate substanță (mol), intensitate luminoasă (candela)',
                    'Mărimi derivate: suprafață (m²), volum (m³), viteză (m/s), accelerație (m/s²), forță (N), presiune (Pa), energie (J), putere (W)',
                    'Sistemul Internațional (SI): adoptat în 1960, asigură uniformitate globală în măsurători'
                ]
            },
            {
                title: '🔢 Multiplii și submultiplii',
                text: 'Pentru exprimarea valorilor foarte mari sau foarte mici folosim prefixe standardizate:',
                items: [
                    'Multipli: deca (da=10), hecto (h=10²), kilo (k=10³), mega (M=10⁶), giga (G=10⁹), tera (T=10¹²)',
                    'Submultipli: deci (d=10⁻¹), centi (c=10⁻²), mili (m=10⁻³), micro (μ=10⁻⁶), nano (n=10⁻⁹), pico (p=10⁻¹²)',
                    'Exemplu: 1 km = 1000 m = 10³ m; 1 mm = 0.001 m = 10⁻³ m'
                ]
            },
            {
                title: '🎯 Procesul de măsurare',
                text: 'Măsurarea implică mai multe componente esențiale:',
                items: [
                    'Obiectul măsurat: piesa, materialul sau fenomenul fizic',
                    'Mijlocul de măsurare: instrumentul sau aparatul utilizat',
                    'Metoda de măsurare: procedura aplicată (directă, indirectă, de comparație)',
                    'Operatorul: persoana care efectuează măsurarea',
                    'Condițiile de mediu: temperatură (standard 20°C), umiditate, vibrații'
                ]
            },
            {
                title: '🔧 Mijloace de măsurare - Clasificare',
                text: 'Instrumentele de măsurare se clasifică după mai multe criterii:',
                items: [
                    'După destinație: Măsuri (etaloane fixe), Aparate de măsurat (indică valoarea), Instrumente de control (verifică limitele)',
                    'După principiul fizic: Mecanice, optice, electrice, pneumatice, hidraulice',
                    'După precizie: Clasa 0 (etaloane), Clasa 1 (laboratoare), Clasa 2 (producție curentă), Clasa 3 (măsurări grosiere)',
                    'După citire: Analogice (cu ac indicator), Digitale (afișaj numeric)'
                ]
            },
            {
                title: '📏 Metode de măsurare',
                text: 'Există trei metode principale de măsurare:',
                items: [
                    'Măsurare directă: valoarea se citește direct de pe instrument (ex: șubler, micrometru). Simplă, rapidă, dar poate fi mai puțin precisă',
                    'Măsurare indirectă: valoarea se calculează matematic din alte mărimi măsurate direct (ex: suprafața unui cerc din diametru)',
                    'Măsurare prin comparație: se compară piesa cu un etalon folosind un comparator. Cea mai precisă metodă pentru producția de serie'
                ]
            },
            {
                title: '❌ Erori de măsurare',
                text: 'Nici o măsurătoare nu este perfectă. Erorile pot fi:',
                items: [
                    'Erori sistematice: se repetă constant, au cauză identificabilă (instrument necalibrat, temperatură diferită de 20°C, deformare elastică). Pot fi corectate prin calibrare',
                    'Erori întâmplătoare (accidentale): variații aleatorii, imposibil de prevăzut (fluctuații citire, vibrații). Se reduc prin măsurători repetate și calcul statistic',
                    'Erori grosolane (blundere): greșeli umane (citire greșită, calcul greșit). Se elimină prin atenție și verificare',
                    'Eroare absolută: Δ = V_măsurat - V_real (în unități de măsură)',
                    'Eroare relativă: ε = (Δ/V_real) × 100% (procent sau ‰)'
                ]
            }
        ],
        nssm: '⚠️ NSSM: Manipulare atentă a instrumentelor (evitați șocurile), păstrare în etui protector, verificare calibrare periodică, curățare după utilizare, lucru la temperatură standard (20°C ± 2°C), iluminare adecvată (min 500 lux pentru citiri precise).'
    },

    'c2': {
        title: '2. Precizia Prelucrării și Asamblării Pieselor',
        intro: 'Precizia defineşte gradul de apropiere între dimensiunile reale ale piesei şi cele nominale din desen tehnic. Este crucială pentru funcţionarea corectă a ansamblurilor mecanice.',
        sections: [
            {
                title: '📏 Dimensiuni, abateri, toleranțe',
                text: 'Concepte fundamentale în controlul dimensional:',
                items: [
                    'Dimensiune nominală (Dn): valoarea ideală din desen tehnic, comună pentru alezaj și arbore într-o îmbinare',
                    'Dimensiune reală (Dr): valoarea măsurată efectiv pe piesă, diferă mereu de Dn datorită imperfecțiunilor de prelucrare',
                    'Abatere: diferența între dimensiunea reală și nominală',
                    'Abaterea superioară (ES/es): diferența maximă admisă peste Dn',
                    'Abaterea inferioară (EI/ei): diferența maximă admisă sub Dn',
                    'Toleranță (T): diferența dintre abaterile limită: T = |ES - EI| = |es - ei|',
                    'Exemplu: Dn=50mm, ES=+0.025mm, EI=0mm → Dmax=50.025mm, Dmin=50mm, T=0.025mm'
                ]
            },
            {
                title: '🔩 Asamblarea alezajelor cu arborii - Ajustaje',
                text: 'Ajustajul defineşte relaţia dimensională între piesele care se îmbină:',
                items: [
                    'Ajustaj cu joc (J): alezajul mai mare decât arborele, piesele se pot mișca relativ. Utilizat la lagăre, ghidaje glisante',
                    'Ajustaj cu strângere (S): arborele mai mare decât alezajul, îmbinare fixă prin presare. Utilizat la roți pe arbori, bucșe',
                    'Ajustaj intermediar (incert): poate rezulta fie joc mic, fie strângere mică, depinde de toleranțele efective',
                    'Joc maxim: Jmax = Amax - amin',
                    'Strângere maximă: Smax = amax - Amin',
                    'Sistemul alezaj unic (preferabil): alezaj constant (H), arbore variabil',
                    'Sistemul arbore unic: arbore constant (h), alezaj variabil'
                ]
            },
            {
                title: '📐 Precizia formei geometrice',
                text: 'Suprafețele reale prezintă abateri de la forma geometrică ideală:',
                items: [
                    'Abaterea de rotunjime: secțiunea cilindrului nu este cerc perfect (ovalitate, forma de poligon)',
                    'Abaterea de cilindricitate: suprafața cilindrică nu este perfect cilindrică (forma butoi, forma diabolo)',
                    'Abaterea de planeitate: suprafața plană prezintă micro-ondulații, concavitate sau convexitate',
                    'Abaterea de dreptețe: linia dreaptă prezintă curbură sau frângeri',
                    'Măsurare: cu comparatoare pe mese de măsurare, mașini de măsurat tridimensionale (CMM)'
                ]
            },
            {
                title: '📍 Precizia poziției suprafețelor',
                text: 'Pozițiile relative ale suprafețelor trebuie respectate:',
                items: [
                    'Paralelism: două plane sau axe trebuie paralele în limite specificate',
                    'Perpendicularitate: unghi de 90° între plane sau axe, toleranță ± minute unghiulare',
                    'Coaxialitate: două cilindri trebuie să aibă aceeași axă (important la arbori lungi)',
                    'Simetrie: elementele trebuie simetrice față de un plan median',
                    'Bătaie radială/axială: abaterea unui element în rotație față de axa de referință',
                    'Verificare: cu comparatoare montate pe suport magnetic, mese de control'
                ]
            },
            {
                title: '🌊 Rugozitatea suprafețelor',
                text: 'Calitatea suprafeței influențează fric\u021biunea, uzura și aspectul:',
                items: [
                    'Ra (rugozitate medie aritmetică): media abaterilor absolute de la linia medie, 0.025-12.5 μm tipic',
                    'Rz (înălțimea medie a neregularităților): media celor mai mari vârfuri și văi pe lungime măsurată',
                    'Clase de rugozitate: Ra 0.025 (superpolitură - suprafețe de etanșare), Ra 0.4-0.8 (polit - arbori în lagăre), Ra 3.2-6.3 (strunjit fin), Ra 12.5-25 (strunjit grosier)',
                    'Indicare pe desen: simbol √ cu valoare Ra în μm',
                    'Măsurare: cu rugozimetre (palpator cu vârf de diamant 2-10 μm), comparare vizuală cu mostre etalon'
                ]
            }
        ],
        nssm: '⚠️ NSSM: Suprafețe de măsurare curate (fără ulei, așchii), mânuire cu mănuși pentru piese prelucrate fin (amprentele oxidează), așezare pe suprafețe moi (postav, cauciuc), verificare vizuală înainte de măsurare (bavuri pot deteriora instrumentul).'
    },

    'c3-1': {
        title: '3.1 Măsurarea și Controlul Dimensiunilor Liniare',
        intro: 'Măsurarea dimensiunilor liniare este cea mai frecventă operație în controlul calității. Precizia necesară variază de la ±0.01mm (producție curentă) până la ±0.001mm (mecanică fină).',
        sections: [
            {
                title: '📐 Unități de măsură pentru dimensiuni liniare',
                text: 'Sistemul metric și subdiviziunile sale:',
                items: [
                    'Unitatea de bază SI: metrul (m) - definit prin viteza luminii în vid',
                    'Multipli: kilometru (km=1000m), decametru (dam=10m)',
                    'Submultipli folosiți în atelier: milimetru (mm=0.001m), micrometru (μm=0.000001m=10⁻⁶m)',
                    'Conversii: 1m=1000mm=1.000.000μm; 1mm=1000μm',
                    'În mecanică fină: precizie până la 1μm (o miime de milimetru)',
                    'Unități vechi (nefolosite în prezent): țol inch (1"=25.4mm), linie (1 linie=2.25mm)'
                ]
            },
            {
                title: '📏 Șublere',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Vernier_caliper_scales.jpg/640px-Vernier_caliper_scales.jpg',
                text: 'Cel mai răspândit instrument de măsurare în ateliere:',
                items: [
                    'Construcție: riglă gradată + cursor mobil cu vernier (nonii)',
                    'Principiul vernierului: 10 diviziuni pe cursor = 9mm (diferență 0.1mm între diviziuni riglă și cursor)',
                    'Precizia: 0.1mm (vernier cu 10 diviziuni), 0.05mm (vernier cu 20 diviziuni)',
                    'Gamă măsurare: 150mm, 200mm, 250mm, 300mm, 500mm, 1000mm (șublere speciale)',
                    'Tipuri: Cu vernier (citire manuală), Cu cadran (citire directă pe cadran), Digitale (afișaj electronic, conversie mm/inch, zero floating)',
                    'Măsurători posibile: Dimensiuni exterioare (cu fălci mari), Dimensiuni interioare (cu fălci mici), Adâncimi (cu tijă de adâncime), Trepte (combinație fălci)',
                    'Exemple citire cu vernier: Riglă=45mm, Vernier diviziunea 3 coincide → 45mm + 3×0.1mm = 45.3mm'
                ]
            },
            {
                title: '🎯 Micrometre',
                image: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Micrometer_0-25mm.jpg',
                text: 'Instrumente de precizie pentru măsurători exacte:',
                items: [
                    'Principiu: șurub micrometric (0.5mm/rotație pentru pas metric), tambur gradat 50 diviziuni → 0.01mm/diviziune',
                    'Precizia: 0.01mm (standard), 0.001mm (cu vernier suplimentar pe tub fix)',
                    'Micrometru exterior: măsurare diametre, grosimi, 0-25mm, 25-50mm, 50-75mm, 75-100mm (seturi)',
                    'Micrometru interior: măsurare alezaje, 50-175mm (cu tije prelungitoare), precizie 0.01mm',
                    'Micrometru de adâncime: măsurare adâncimi canale, scobituri, 0-25mm, 0-50mm',
                    'Citire: tub fix (gradații 0.5mm) + tambur rotativ (50 diviziuni × 0.01mm)',
                    'Exemplu citire: Tub fix=12.5mm, Tambur diviziunea 23 → 12.5mm + 0.23mm = 12.73mm',
                    'Verificare zero: înainte de măsurare, verificați că la închidere indică 0.00mm',
                    'Clichet de presiune: asigură forță constantă (evită deformarea piesei sau a instrumentului)'
                ]
            },
            {
                title: '⚙️ Comparatoare mecanice',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Dial_Indicator_Gauge.jpg/320px-Dial_Indicator_Gauge.jpg',
                text: 'Instrumente de măsurare prin comparație cu etalon:',
                items: [
                    'Comparator cu cadran: ac indicator pe cadran gradat, precizie 0.01mm sau 0.001mm',
                    'Principiu: palpator→ pinioane→ cremalieră→ ac indicator (amplificare mecanică 100-1000×)',
                    'Gamă măsurare: ±0.5mm, ±1mm, ±5mm, ±10mm',
                    'Utilizare: montare pe suport magnetic sau stativ, aducere ac pe 0 cu etalonul, măsurare diferențe față de etalon',
                    'Avantaje: precizie mare, citire rapidă, ideal pentru producție serie',
                    'Comparator de interior (minitester, alezometru): verificare alezaje cu precizie 0.01mm',
                    'Pasametre: verificare adâncimi, trepte, folosind comparator cu cadran',
                    'Minimetre: micrometru combinat cu comparator pentru verificare rapidă în serie'
                ]
            },
            {
                title: '🔬 Aparate cu amplificare optică',
                text: 'Pentru măsurări de foarte mare precizie:',
                items: [
                    'Optimetru: amplificare optică prin leviere, precizie 0.001mm (1μm)',
                    'Utilizare: control dimensiuni mici cu toleranțe strânse, calibrare micrometre, verificare calibre',
                    'Proiectoare de profil: proiectează conturul piesei mărit 10× - 100×, verificare profil filete, roți dințate',
                    'Microscoape de atelier: măsurare dimensiuni mici (sub 10mm) cu precizie 0.005mm, vizualizare detalii structură',
                    'Microscoape universale: masă de măsurare cu deplasări micrometrice pe 2 axe (X, Y), măsurare coordonate, unghiuri, precizie 0.002mm',
                    'Avantaje: precizie extremă, măsurare piese mici, verificare forme complexe',
                    'Dezavantaje: costisitoare, manipulare delicată, timp măsurare mai lung'
                ]
            }
        ],
        nssm: '⚠️ NSSM: Nu lăsați instrumentele pe mașini în funcțiune (vibrații deteriorează precizia). Curățați suprafețele de măsurare înainte și după utilizare. Verificați calibrarea periodică (minim anual). Păstrați în etui protector. Evitați șocurile termice (trecere rapidă de la rece la cald). La micrometre folosiți clichetul, nu strângeți forțat!'
    },

    'c3-2': {
        title: '3.2 Măsurarea și Controlul Unghiurilor',
        intro: 'Precizia unghiulară este esențială pentru piese conice, șanfrenuri, scule așchietoare. Erorile unghiulare se măsoară în grade, minute (1°=60\'),  secunde (1\'=60").',
        sections: [
            {
                title: '📐 Unități de măsură unghiuri',
                text: 'Două sisteme de măsurare sunt utilizate:',
                items: [
                    'Sistem sexagesimal: grad (°), minut(\'), secundă("). 1 rotație completă = 360°, 1° = 60\', 1\' = 60"',
                    'Sistem circular (radiani): 1 radian = 57.3°, 2π radiani = 360° ',
                    'Conversii: 1° = 0.01745 radiani, 1 radian = 57.296°',
                    'Precizie tipică: ±5\' - ±15\' pentru conuri, ±30" pentru piese de precizie'
                ]
            },
            {
                title: '🎯 Goniometre',
                text: 'Instrumente pentru măsurare precisă a unghiurilor:',
                items: [
                    'Goniometru universal: riglă principală + riglă mobilă cu disc gradat, precizie 5-10\' (cu vernier)',
                    'Citire: disc principal (grade întregi 0-360°) + vernier (minute 0-60\')',
                    'Goniometru digital: citire electronică, precizie 0.01°, conversie automate grade/radiani'
                ]
            }
        ],
        nssm: '⚠️ NSSM: Manipulare cu grijă (dezaliniere gradații). Păstrare în cutii protectoare. Verificare periodică pe etaloane unghiulare.'
    },

    'c3-3': {
        title: '3.3 Măsurarea și Controlul Suprafețelor',
        intro: 'Calitatea suprafețelor influențează etanșeitatea, uzura, aspectul vizual.',
        sections: [
            {
                title: '📏 Drepte de referință și plane de măsurare',
                text: 'Etaloane pentru verificare formă:',
                items: [
                    'Rigle de control: verificare dreptețe muchii, precizie 0.002-0.01mm/m',
                    'Mese de control: fontă sau granit, planitate 0.005-0.02mm/m²',
                    'Vopsire prussian blue: evidențiază neplanitate'
                ]
            }
        ],
        nssm: '⚠️ NSSM: Mese  de control nu se lovesc. Curățare după utilizare. Acoperire când nu sunt folosite.'
    },

    'c3-4': {
        title: '3.4 Măsurarea Mărimilor Mecanice',
        intro: 'Măsurarea forțelor (N), mase (kg), presiuni (Pa), viteze (m/s), turaţii (rot/min), debite (l/min).',
        sections: [
            {
                title: '⚖️ Măsurarea forțelor',
                text: 'Forța măsurată în Newton (N):',
                items: [
                    'Dinamometre cu resort: precizie 1-2%, domeniu 1N-100kN',
                    'Celule de sarcină: precizie 0.05-0.1%, domeniu 10N-5MN',
                    'Aplicații: mașini încercare materiale, presă, chei dinamometrice'
                ]
            },
            {
                title: '⚖️ Măsurarea maselor și presiunilor',
                text: 'Masa (kg) și presiunea (Pa, bar):',
                items: [
                    'Cântare electronice: precizie 0.01-0.1%, domeniu 0.1kg-200kg',
                    'Manometre Bourdon: domeniu 0.6-1000bar, precizie 0.5-2%',
                    'Manometre digitale: precizie 0.1-0.5%, înregistrare date'
                ]
            }
        ],
        nssm: '⚠️ NSSM: Manometre >10bar certificate, verificate anual. Nu depășiți niciodată presiunea maximă.'
    },

    'c3-5': {
        title: '3.5 Măsurarea Temperaturii',
        intro: 'Temperatura influențează dimensiunile (dilatare), proprietățile materialelor.',
        sections: [
            {
                title: '🌡️ Scări de temperatură',
                text: 'Trei scări principale:',
                items: [
                    'Celsius (°C): 0°C=îngheț apă, 100°C=fierbere apă',
                    'Kelvin (K): T(K)=T(°C)+273.15',
                    'Fahrenheit (°F): T(°F)=T(°C)×1.8+32'
                ]
            },
            {
                title: '🔴 Termometre',
                text: 'Tipuri de termometre:',
                items: [
                    'Cu lichid: mercur (-38 până +350°C), alcool (-80 până +70°C)',
                    'Pt100: domeniu -200°C până +850°C, precizie 0.1-0.5°C',
                    'Termocuple: Tip K (-200 până +1200°C), Tip S (0 până +1600°C)',
                    'IR (pirometre): -50°C până +2000°C, fără contact'
                ]
            }
        ],
        nssm: '⚠️ NSSM: Termometre cu mercur: în caz de spargere evacuați, ventilaţi, colectați mercurul în recipient sigilat!'
    },

    'c3-6': {
        title: '3.6 Măsurarea și Controlul Filetelor',
        intro: 'Controlul corect asigură montaj fără probleme și rezistență mecanică.',
        sections: [
            {
                title: '🔩 Elementele filetelor',
                text: 'Parametrii care definesc un filet:',
                items: [
                    'Diametrul exterior (D/d): pe vârfuri filet',
                    'Diametrul mediu (D2/d2): cel mai important pentru îmbinare',
                    'Pasul (P): distanța între vârfuri consecutive',
                    'Unghi profil: 60° metric, 55° Whitworth, 29° trapezoidal'
                ]
            },
            {
                title: '✅ Calibre filetate',
                text: 'Verificare GO/NO-GO:',
                items: [
                    'Calibrul TRECE: trebuie să treacă ușor pe toată lungimea',
                    'Calibrul NU TRECE: nu trebuie să treacă (maxim 2-3 spire)',
                    'Avantaje: verificare rapidă (5-10s), ideal producție serie'
                ]
            },
            {
                title: '📏 Măsurarea diametrului mediu',
                text: 'Cu micrometru de filete sau metoda 3 sârme:',
                items: [
                    'Micrometru filete: vârfuri profilate 60°, măsoară direct d2',
                    'Metoda 3 sârme: calcul d2 din măsurare peste sârme calibrate',
                    'Precizie: 0.01mm, pentru calibrare calibre'
                ]
            }
        ],
        nssm: '⚠️ NSSM: Filete se curăță înainte de măsurare. Calibre se înșurubă manual ușor. Nu folosiți calibre uzate.'
    },

    'c3-7': {
        title: '3.7 Măsurarea și Controlul Roților Dințate',
        intro: 'Precizia execuției influențează zgomotul, randamentul și durata de viață.',
        sections: [
            {
                title: '⚙️ Elementele roților dințate',
                text: 'Parametrii fundamentali:',
                items: [
                    'Modul (m): standardizat 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10mm',
                    'Număr dinți (z): minim 12-14',
                    'D_divizare = m×z, D_cap = m×(z+2), D_bază = m×(z-2.5)',
                    'Pas: P = π×m, Înălțime dinte: h = 2.25×m'
                ]
            },
            {
                title: '📏 Șubler de roți dințate',
                text: 'Instrument specific:',
                items: [
                    'Măsurare grosime dinte pe cerc divizare: s_teor=πm/2 = 1.571×m',
                    'Toleranță: ±0.05mm pentru m≤3, ±0.1mm pentru m>3'
                ]
            },
            {
                title: '📐 Șabloane modului',
                text: 'Verificare rapidă profil:',
                items: [
                    'Set șabloane pentru m=1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10mm',
                    'Verificare vizuală potrivire (nu trece lumină)',
                    'Utilizare: identificare roți fără documentație'
                ]
            }
        ],
        nssm: '⚠️ NSSM: Dinții sunt ascuțiți - manipulare cu mănuși. Curățare roți înainte de măsurare.'
    },

    'c3-8': {
        title: '3.8 Măsurarea Mărimilor Electrice',
        intro: 'Mărimile electrice (intensitate, tensiune, rezistență, putere) necesită cunoștințe de siguranță obligatorii.',
        sections: [
            {
                title: '📊 Aparate analogice vs digitale',
                text: 'Două tehnologii:',
                items: [
                    'Analogice: ac indicator, simboluri: ⎓ DC, ~ AC, poziție ⊥ / —, clasa 1.0/1.5/2.5',
                    'Digitale: citire directă LCD/LED, precizie 0.1-0.5%, memorare valori',
                    'Clase precizie: 0.1-0.2 (etaloane), 0.5-1 (portabile), 1.5-2.5 (panouri)'
                ]
            },
            {
                title: '⚡ Multimetre - instrumentul universal',
                text: 'Funcții multiple:',
                items: [
                    'Analogic (AVO-metru): comutator funcții, ac indicator',
                    'Digital (DMM): afișaj 3½-4½ cifre, autorange',
                    'Funcții: V⎓, V~, A⎓, A~, Ω, continuitate, capacitate, frecvență',
                    'Categorii siguranță: CAT I (electronice), CAT II (prize 230V), CAT III (tablouri), CAT IV (linii exterior)',
                    '⚠️ Regulă de aur: Verificați setare înainte de conectare!'
                ]
            },
            {
                title: '🔌  Măsurarea intensității (A)',
                text: 'Montaj ÎN SERIE:',
                items: [
                    'Ampermetru se conectează ÎN SERIE (circuit se întrerupe)',
                    '⚠️ Conectare în paralel = SCURTCIRCUIT!',
                    'Clești ampermetrici: măsurare fără întrerupere, 1A-1000A'
                ]
            },
            {
                title: '🔋 Măsurarea tensiunii (V)',
                text: 'Montaj ÎN PARALEL:',
                items: [
                    'Voltmetru se conectează ÎN PARALEL',
                    'Rezistență internă foarte mare (1-10MΩ)',
                    'Multiplicatori: extind domeniul'
                ]
            },
            {
                title: '🔌 Măsurarea rezistenței (Ω)',
                text: 'Dezactivați tensiunea circuitului!',
                items: [
                    '⚠️ Deconectați alimentarea înainte!',
                    'Ohmmetru: baterie internă, măsoară curent→R=U/I',
                    'Megaohmmetre: măsurare izolație >1MΩ, tensiune 50V-5000V',
                    'Punte Wheatstone: precizie 0.1-0.01%'
                ]
            },
            {
                title: '⚡ Măsurarea puterii (W) și energiei (kWh)',
                text: 'Putere și energie:',
                items: [
                    'Wattmetru: P=U×I (DC), P=U×I×cosφ (AC)',
                    'Contoare energie: inductiv (disc rotativ) sau electronic',
                    'Citire: index final - index inițial = kWh consumat'
                ]
            },
            {
                title: '⚠️⚠️⚠️ NSSM ELECTRICE SPECIFICE - OBLIGATORII!',
                text: 'REGULI DE SIGURANȚĂ VITALE:',
                items: ['🚫 NICIODATĂ tensiune cu multimetru pe A!',
                    '🔌 ÎNTOTDEAUNA deconectați sursa pentru măsurare Ω',
                    '⚡ Tensiuni >50V AC sau >120V DC = PERICOL DE MOARTE!',
                    '👁️ Verificați starea cordoanelor',
                    '🔴 Start pe domeniul MAX, apoi reduceți',
                    '👤 >1000V doar personal autorizat',
                    '🔒 Respectați "cele 5 reguli de aur"',
                    '🌩️ Măsurări doar cu vreme bună',
                    '💾 Calibrare anuală obligatorie'
                ]
            }
        ],
        nssm: '⚠️⚠️⚠️ PERICOL DE MOARTE! Curentul >30mA poate fi FATAL! Respectați ÎNTOTDEAUNA NSSM. Dacă nu sunteți sigur, NU măsurați! Solicitați personal autorizat. NICIODATĂ nu lucrați singur la >1000V. OBLIGATORIU verificare absență tensiune înainte de intervenție!'
    }
};

// ========== GLOSSARY DATA ==========
const glossaryData = [
    { term: 'Abatere (A, a)', def: 'Diferența algebrică între o dimensiune măsurată sau limită și dimensiunea nominală corespunzătoare. Poate fi superioară (As, as) sau inferioară (Ai, ai).' },
    { term: 'Abatere de formă', def: 'Diferența dintre suprafața reală a piesei și forma geometrică ideală (ex: abatere de la circularitate, cilindricitate, planitate).' },
    { term: 'Abatere de poziție', def: 'Diferența dintre poziția reală a unei suprafețe/axe și poziția sa teoretică (ex: abatere de la coaxialitate, perpendicularitate).' },
    { term: 'Alezaj', def: 'Termen general utilizat pentru a desemna suprafața interioară (gaură), de obicei cilindrică, a unei piese, precum și dimensiunile acesteia.' },
    { term: 'Ajustaj (Fit)', def: 'Relația rezultată din diferența dimensiunilor înainte de asamblare a două piese (arbore și alezaj) care urmează a fi montate una în alta. Poate fi: cu joc, cu strângere sau intermediar.' },
    { term: 'Ampermetru', def: 'Instrument de măsură a intensității curentului electric (I), conectat întotdeauna în serie în circuit.' },
    { term: 'Arbore', def: 'Termen general utilizat pentru a desemna suprafața exterioară, de obicei cilindrică, a unei piese, precum și dimensiunile acesteia.' },
    { term: 'Calibru', def: 'Măsură materializată, fără scară gradată, utilizată pentru verificarea limitelor dimensionale sau a formei pieselor (ex: calibru tampon, calibru potcoavă).' },
    { term: 'Calibrare', def: 'Ansamblul operațiilor care stabilesc, în condiții specificate, relația dintre valorile indicate de un aparat de măsură și valorile corespunzătoare realizate de etaloane.' },
    { term: 'Clasă de precizie', def: 'Cifră sau simbol care indică limita erorii tolerate pentru un instrument de măsură. O clasă mai mică indică o precizie mai mare (ex: clasa 0.5 e mai precisă decât 1.5).' },
    { term: 'Comparator', def: 'Instrument de măsurare prin comparație, care indică diferența (abaterea) dintre dimensiunea piesei măsurate și cea a unui etalon (bloc de calibrare).' },
    { term: 'Dimensiune efectivă (De, de)', def: 'Dimensiunea măsurată concret pe o piesă finită, cu o anumită precizie.' },
    { term: 'Dimensiune limită', def: 'Cele două dimensiuni extreme permise (maximă și minimă) între care trebuie să se afle dimensiunea efectivă pentru ca piesa să fie acceptată.' },
    { term: 'Dimensiune nominală (N, Dn)', def: 'Dimensiunea de bază înscrisă pe desenul tehnic, față de care se definesc abaterile și dimensiunile limită.' },
    { term: 'Echer', def: 'Instrument simplu utilizat pentru verificarea sau trasarea unghiurilor de 90° (perpendicularitate) sau alte unghiuri fixe.' },
    { term: 'Eroare absolută', def: 'Diferența algebrică dintre valoarea măsurată (Xm) și valoarea reală (Xr) a măsurandului: E = Xm - Xr.' },
    { term: 'Eroare relativă', def: 'Raportul dintre eroarea absolută și valoarea reală, exprimat adesea în procente, oferind o imagine mai clară a preciziei măsurătorii.' },
    { term: 'Eroare sistematică', def: 'Eroare care rămâne constantă sau variază într-un mod previzibil la măsurători repetate (ex: decalajul de zero al unui aparat).' },
    { term: 'Etalon', def: 'Măsură materializată, aparat sau sistem de măsurare destinat să definească, să realizeze, să conserve sau să reproducă o unitate de măsură.' },
    { term: 'Filet', def: 'Nervură elicoidală prelucrată pe o suprafață cilindrică (exterioară - șurub, sau interioară - piuliță).' },
    { term: 'Goniometru', def: 'Instrument mecanic sau optic utilizat pentru măsurarea precisă a unghiurilor.' },
    { term: 'Incertitudine de măsurare', def: 'Parametru asociat rezultatului măsurării, care caracterizează dispersia valorilor care ar putea fi atribuite în mod rezonabil măsurandului.' },
    { term: 'Joc (Clearance)', def: 'Diferența pozitivă între dimensiunea alezajului și cea a arborelui înainte de asamblare (alezajul este mai mare decât arborele).' },
    { term: 'Lanț de dimensiuni', def: 'Ansamblu de dimensiuni (cote) care formează un contur închis și care sunt legate funcțional între ele.' },
    { term: 'Manometru', def: 'Instrument destinat măsurării presiunii fluidelor (lichide sau gaze) într-un spațiu închis.' },
    { term: 'Măsurand', def: 'Mărimea fizică particulară supusă măsurării (ex: lungimea unei bare, temperatura într-un cuptor).' },
    { term: 'Metru', def: 'Unitatea fundamentală de măsură a lungimii în Sistemul Internațional (SI).' },
    { term: 'Micrometru', def: 'Instrument de măsurare de precizie ridicată (uzual 0.01 mm), bazat pe transformarea mișcării de rotație a unui șurub micrometric în mișcare de translație.' },
    { term: 'Mijloc de măsurare (MdM)', def: 'Termen generic pentru instrumente, aparate, masuri materializate și instalații utilizate la măsurare.' },
    { term: 'Modul (m)', def: 'La roți dințate, raportul dintre diametrul de divizare și numărul de dinți. Este mărimea principală de standardizare și calcul a angrenajelor.' },
    { term: 'Multimetru', def: 'Aparat electronic complex care poate măsura mai multe mărimi electrice: tensiune (V), curent (A), rezistență (Ω), continuitate etc.' },
    { term: 'NSSM', def: 'Norme Specifice de Securitate și Sănătate în Muncă - ansamblul de reguli obligatorii pentru prevenirea accidentelor și bolilor profesionale.' },
    { term: 'Ohmetru', def: 'Instrument pentru măsurarea rezistenței electrice, care necesită întotdeauna ca circuitul să fie scos de sub tensiune.' },
    { term: 'Pas (P)', def: 'Distanța dintre două puncte omoloage consecutive de pe profilul unui filet sau al unei roți dințate, măsurată paralel cu axa.' },
    { term: 'Planitate', def: 'Proprietatea unei suprafețe de a conține doar linii drepte în orice direcție; abaterea se verifică cu rigla de control sau placa de planitate.' },
    { term: 'Precizie', def: 'Gradul de concordanță între rezultatul măsurării și valoarea reală (sau convențional adevărată) a măsurandului.' },
    { term: 'Raportor', def: 'Instrument simplu, gradat în grade sexagesimale, utilizat pentru măsurarea și trasarea unghiurilor (precizie redusă).' },
    { term: 'Rezoluție', def: 'Cea mai mică variație a mărimii măsurate care poate fi sesizată/afișată de un instrument de măsură (ex: 0.1 mm la șubler, 0.001 mm la micrometru digital).' },
    { term: 'Rugozitate (Ra)', def: 'Ansamblul neregularităților (asperităților) de pe o suprafață prelucrată, care formează relieful acesteia (microgeometria).' },
    { term: 'Sistem ISO de toleranțe', def: 'Sistem standardizat internațional care codifică abaterile și ajustajele folosind litere (poziția câmpului) și cifre (treapta de precizie, ex: H7/g6).' },
    { term: 'Strângere (Interference)', def: 'Diferența negativă dintre dimensiunea alezajului și cea a arborelui înainte de asamblare (alezajul este mai mic decât arborele), necesară pentru asamblări presate.' },
    { term: 'Șubler', def: 'Cel mai răspândit instrument de măsurare a lungimilor în atelier, prevăzut cu vernier pentru citirea preciziei (0.1, 0.05 sau 0.02 mm).' },
    { term: 'Tahometru', def: 'Instrument utilizat pentru măsurarea turației (vitezei unghiulare) a pieselor în mișcare de rotație (ex: la mașini-unelte).' },
    { term: 'Toleranță (T)', def: 'Zona (intervalul) dintre dimensiunea maximă admisă și dimensiunea minimă admisă. T = Dmax - Dmin. Reprezintă imprecizia de execuție permisă.' },
    { term: 'Trasare', def: 'Operația de transpunere pe semifabricat a conturului și a liniilor importante ale piesei conform desenului, înainte de prelucrare.' },
    { term: 'Unitate de măsură', def: 'Mărime particulară, definită și adoptată prin convenție, cu care sunt comparate alte mărimi de aceeași natură.' },
    { term: 'Verificare', def: 'Operația de a stabili dacă o mărime măsurată se încadrează în limitele prescrise (toleranțe), soldată cu decizia ADMIS sau RESPINS.' },
    { term: 'Vernier', def: 'Scară gradată secundară (ajutătoare) a șublerului sau goniometrului, care permite citirea fracțiunilor de diviziune de pe scara principală.' },
    { term: 'Voltmetru', def: 'Instrument pentru măsurarea tensiunii electrice (diferenței de potențial), conectat întotdeauna în paralel cu circuitul sau componenta măsurată.' },
    { term: 'Zero absolut', def: 'Temperatura la care mișcarea termică a particulelor încetează teoretic (0 Kelvin sau -273.15 grade Celsius).' }
];

// ========== QUIZ DATA FOR EACH CHAPTER ==========
const tests = {
    'c1': {
        title: 'Test: Noțiuni Fundamentale', questions: [
            { q: 'Ce este Sistemul Internațional de Unități (SI)?', a: ['Un sistem metric vechi', 'Sistem standardizat global de unități de măsură adoptat în 1960', 'Sistem folosit doar în Europa', 'Sistem imperial'], c: 1 },
            { q: 'Care dintre următoarele NU este o mărime fundamentală SI?', a: ['Lungimea', 'Masa', 'Forța', 'Temperatura'], c: 2 },
            { q: 'Ce reprezintă multiplul "kilo" (k)?', a: ['10²', '10³', '10⁶', '10⁻³'], c: 1 },
            { q: 'Ce înseamnă micrometrul (μm)?', a: ['10⁻³ m', '10⁻⁶ m', '10⁻⁹ m', '10⁻¹² m'], c: 1 },
            { q: 'Care este temperatura standard de calibrare pentru măsurători dimensionale?', a: ['0°C', '15°C', '20°C', '25°C'], c: 2 },
            { q: 'Erorile sistematice se caracterizează prin:', a: ['Variații aleatorii', 'Repetabilitate constantă cu cauză identificabilă', 'Greșeli umane grosolane', 'Imposibilitate de corecție'], c: 1 },
            { q: 'Metoda de măsurare prin comparație presupune:', a: ['Citire directă valoare pe instrument', 'Calcul matematic din alte mărimi', 'Comparare cu etalon folosind comparator', 'Estimare vizuală'], c: 2 },
            { q: 'Eroarea relativă se exprimă în:', a: ['Milimetri', 'Procente sau ‰', 'Metri', 'Unități arbitrare'], c: 1 }
        ]
    },
    'c2': {
        title: 'Test: Precizia Prelucrării', questions: [
            { q: 'Ce reprezintă toleranța (T)?', a: ['=ES-EI sau es-ei', 'Diferența Dn-Dr', 'Suma ES+EI', 'Valoarea nominală'], c: 0 },
            { q: 'La ajustajul cu joc:', a: ['Arborele > Alezajul', 'Alezajul > Arborele', 'Alezaj = Arbore', 'Depinde de temperatură'], c: 1 },
            { q: 'Sistemul de ajustaj preferabil în industrie este:', a: ['Arbore unic', 'Alezaj unic (H)', 'Intermediar', 'Nici unul'], c: 1 },
            { q: 'Rugozitatea Ra se măsoară în:', a: ['mm', 'μm', 'nm', 'cm'], c: 1 },
            { q: 'Pentru un filet M50×2.5, ES=+0.025mm, EI=0mm, toleranța T este:', a: ['50mm', '0.025mm', '2.5mm', '0mm'], c: 1 }
        ]
    },
    'c3-1': {
        title: 'Test: Dimensiuni Liniare', questions: [
            { q: 'Precizia unui șubler cu vernier 10 diviziuni este:', a: ['1mm', '0.1mm', '0.01mm', '0.001mm'], c: 1 },
            { q: 'Principiul micrometrului se bazează pe:', a: ['Vernier', 'Șurub micrometric', 'Comparație', 'Optică'], c: 1 },
            { q: 'La micrometru standard, o rotație completă a tamburului reprezintă:', a: ['1mm', '0.5mm', '0.1mm', '0.01mm'], c: 1 },
            { q: 'Precizia standard a micrometrului este:', a: ['0.1mm', '0.05mm', '0.01mm', '0.001mm'], c: 2 },
            { q: 'Comparatorul cu cadran măsoară:', a: ['Valori absolute', 'Diferențe față de etalon', 'Unghiuri', 'Temperaturi'], c: 1 },
            { q: 'Pentru măsurători de foarte mare precizie (0.001mm) folosim:', a: ['Șubler', 'Micrometru', 'Optimetru', 'Riglă'], c: 2 }
        ]
    },
    'c3-2': {
        title: 'Test: Unghiuri', questions: [
            { q: 'Un grad (1°) este egal cu:', a: ['10 minute', '60 minute', '100 minute', '180 minute'], c: 1 },
            { q: 'Precizia tipică a goniometrului universal cu vernier este:', a: ['1°', '5-10 minute', '30"', '0.01°'], c: 1 },
            { q: 'Pentru verificare rapidă perpendiculară (90°) folosim:', a: ['Goniometru', 'Echer', 'Microscopșubler', 'Comparator'], c: 1 }
        ]
    },
    'c3-3': {
        title: 'Test: Suprafețe', questions: [
            { q: 'Precizia riglei de control este:', a: ['1mm/m', '0.1mm/m', '0.002-0.01mm/m', '0.0001mm/m'], c: 2 },
            { q: 'Pentru evidențiere neplanitate suprafețe folosim:', a: ['Ulei', 'Prussian blue (albastru Prusia)', 'Apă', 'Cerneală'], c: 1 },
            { q: 'Mesele de control pot fi din:', a: ['Lemn', 'Plastic', 'Fontă sau granit', 'Aluminiu'], c: 2 }
        ]
    },
    'c3-4': {
        title: 'Test: Mărimi Mecanice', questions: [
            { q: '1 Newton (N) reprezintă forța care accelerează:', a: ['1g cu 1m/s²', '1kg cu 1m/s²', '1kg cu 10m/s²', '10kg cu 1m/s²'], c: 1 },
            { q: 'Ce tip de manometru se folosește pentru presiuni 0.6-1000 bar?', a: ['Cu membrană', 'Cu tub Bourdon', 'Digital', 'Cu coloană lichid'], c: 1 },
            { q: 'Cântarele electronice au precizia:', a: ['10%', '1-5%', '0.01-0.1%', '0.001%'], c: 2 }
        ]
    },
    'c3-5': {
        title: 'Test: Temperatură', questions: [
            { q: 'Temperatura de 0°C este egală cu:', a: ['0K', '273.15K', '100K', '212K'], c: 1 },
            { q: 'Domeniul de măsurare al termometrului cu mercur este:', a: ['-80 până +70°C', '-38 până +350°C', '0 până +100°C', '-200 până +850°C'], c: 1 },
            { q: 'Termorezistența Pt100 are la 0°C:', a: ['0Ω', '100Ω', '1000Ω', '10000Ω'], c: 1 },
            { q: 'Pirometrul IR măsoară temperatura:', a: ['Prin contact', 'Fără contact (radiație)', 'Prin imersie', 'Prin conductivitate'], c: 1 }
        ]
    },
    'c3-6': {
        title: 'Test: Filete', questions: [
            { q: 'Unghiul profilului pentru filetul metric este:', a: ['29°', '55°', '60°', '90°'], c: 2 },
            { q: 'Cel mai important diametru pentru îmbinarea filetată este:', a: ['Diametrul exterior', 'Diametrul mediu', 'Diametrul interior', 'Pasul'], c: 1 },
            { q: 'Calibrul TRECE verifică:', a: ['Dimensiuni minime', 'Dimensiuni maxime admise', 'Pasul', 'Unghiul'], c: 1 },
            { q: 'Metoda celor 3 sârme servește la măsurarea:', a: ['Pasului', 'Diametrului mediu', 'Unghiului profilului', 'Lungimii filetului'], c: 1 }
        ]
    },
    'c3-7': {
        title: 'Test: Roți Dințate', questions: [
            { q: 'Modulul (m) unei roți dințate reprezintă:', a: ['Număr dinți', 'Raport P/π', 'Diametrul roții', 'Lățimea dintelui'], c: 1 },
            { q: 'Formula diametrului de divizare este:', a: ['D=m+z', 'D=m×z', 'D=m²×z', 'D=z/m'], c: 1 },
            { q: 'Numărul minim de dinți pentru evitarea interferenței este:', a: ['6-8', '10-12', '12-14', '20-25'], c: 2 }
        ]
    },
    'c3-8': {
        title: 'Test: Mărimi Electrice', questions: [
            { q: 'Ampermetrul se conectează:', a: ['În paralel', 'În serie', 'Oriunde', 'La pământ'], c: 1 },
            { q: 'Voltmetrul se conectează:', a: ['În serie', 'În paralel', 'La masă', 'Nu contează'], c: 1 },
            { q: 'Înainte de măsurare rezistență cu ohmmetru, trebuie:', a: ['Să crești tensiunea', 'Să deconectezi alimentarea', 'Să încălzești circuitul', 'Să verifici curentul'], c: 1 },
            { q: 'Curentul peste ce valoare poate fi FATAL?', a: ['>10mA', '>30mA', '>100mA', '>1A'], c: 1 },
            { q: 'Categoria siguranță CAT II corespunde:', a: ['Electronice joasă tensiune', 'Prize 230V casnice', 'Tablouri industriale', 'Linii HT'], c: 1 },
            { q: 'Formula puterii în curent continuu este:', a: ['P=U/I', 'P=U+I', 'P=U×I', 'P=U-I'], c: 2 },
            { q: 'Simbolul ~ pe un aparat electric indică:', a: ['Curent continuu', 'Curent alternativ', 'Pământ', 'Pericol'], c: 1 }
        ]
    }
};

// ========== UI RENDERING FUNCTIONS ==========

function showSection(sectionId) {
    currentSection = sectionId;
    const main = document.getElementById('mainContent');
    closeMenu();

    if (sectionId === 'home') {
        main.innerHTML = `
      <div class="hero">
        <div class="hero-badge">📏 Modul M1 - Măsurări Tehnice</div>
        <h1>Măsurători Tehnice</h1>
        <p class="hero-subtitle">Platformă educațională interactivă pentru învățarea tehnicilor de măsurare în industrie. Include 10 capitole complete, teste interactive și certificat de absolvire.</p>
        <div class="hero-stats">
          <div class="stat-item"><div class="stat-number">10</div><div class="stat-label">Capitole</div></div>
          <div class="stat-item"><div class="stat-number">196</div><div class="stat-label">Ore/an</div></div>
          <div class="stat-item"><div class="stat-number">50+</div><div class="stat-label">Instrumente</div></div>
        </div>
        <div style="margin-top:2rem">
            <button class="btn btn-secondary" onclick="showWorksheets()">📄 Fișe de Lucru</button>
        </div>
      </div>
      <div class="container">
        <h2>📚 Capitole Disponibile</h2>
        <div class="section-grid">
          ${chapters.map(ch => `
            <div class="card" onclick="showSection('${ch.id}')">
              <div class="card-icon">${ch.icon}</div>
              <h3 class="card-title">${ch.title}</h3>
              <p class="card-description">${ch.desc}</p>
              <div class="card-meta">
                <span class="card-hours">${ch.hours}</span>
                <button class="btn btn-primary" onclick="event.stopPropagation(); startTest('${ch.id}')">📝 Test</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    } else if (sectionId === 'tests') {
        main.innerHTML = `
      <div class="container">
        <h2>📝 Toate Testele</h2>
        <div class="section-grid">
          ${chapters.map(ch => `
            <div class="card" onclick="startTest('${ch.id}')">
              <div class="card-icon">${ch.icon}</div>
              <h3 class="card-title">${ch.title}</h3>
              <p class="card-description">Test evaluare cunoștințe</p>
              <div class="card-meta">
                <span>${tests[ch.id]?.questions.length || 0} întrebări</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    } else if (content[sectionId]) {
        const chap = content[sectionId];
        // Construct full text for TTS
        let fullText = `${chap.title}. ${chap.intro}. `;
        chap.sections.forEach(sec => {
            fullText += `${sec.title}. ${sec.text}. `;
            if (sec.items && sec.items.length > 0) {
                fullText += `Elemente: ${sec.items.join(', ')}. `;
            }
        });
        // Escape for JS string
        const safeText = fullText.replace(/'/g, "\\'").replace(/\n/g, " ").replace(/"/g, '\\"');

        main.innerHTML = `
      <div class="container">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:1rem">
             <h2>${chap.title}</h2>
             <button class="tts-btn" onclick="toggleTTS('${safeText}', this)">🔈 Ascultă Tot Capitolul</button>
        </div>
        <p style="font-size:1.1rem;margin-bottom:2rem;color:var(--text-secondary)">${chap.intro}</p>
        ${chap.sections.map((sec, idx) => `
          <div class="content-card">
            <h3>${sec.title}</h3>
            ${sec.image ? `<div style="text-align:center;margin:1rem 0"><img src="${sec.image}" style="max-width:100%;border-radius:8px;box-shadow:var(--shadow-md)" alt="${sec.title}"></div>` : ''}
            <p>${sec.text}</p>
            <ul>${sec.items.map(item => `<li>${item}</li>`).join('')}</ul>
          </div>
        `).join('')}
        <div class="info-box warning">
          <h4>⚠️ Norme NSSM</h4>
          <p>${chap.nssm}</p>
        </div>
        <div class="text-center" style="margin-top:2rem">
          <button class="btn btn-primary btn-lg" onclick="startTest('${sectionId}')">📝 Începe Testul</button>
        </div>
      </div>
    `;
    }
}

let testTimer = null;
let testTimeLeft = 0;

function startTest(chapterId) {
    if (!tests[chapterId]) {
        alert('Test indisponibil pentru acest capitol.');
        return;
    }
    currentTest = chapterId;
    currentQuestion = 0;
    userAnswers = [];

    // Timer Setup (e.g., 10 minutes for standard tests, except Quick/Duel which have their own rules)
    if (chapterId === 'quick' || chapterId === 'duel') {
        // Handled separately
    } else {
        testTimeLeft = 600; // 10 minutes
        if (testTimer) clearInterval(testTimer);
        testTimer = setInterval(() => {
            testTimeLeft--;
            const el = document.getElementById('testTimerDisplay');
            if (el) {
                const m = Math.floor(testTimeLeft / 60);
                const s = testTimeLeft % 60;
                el.innerText = `⏱️ ${m}:${s < 10 ? '0' + s : s}`;
                if (testTimeLeft <= 60) el.style.color = 'var(--danger)';
            }
            if (testTimeLeft <= 0) {
                clearInterval(testTimer);
                showResults(true); // true = forced end
            }
        }, 1000);
    }

    showQuestion();
}

function showQuestion() {
    const test = tests[currentTest];
    const q = test.questions[currentQuestion];
    const main = document.getElementById('mainContent');

    main.innerHTML = `
    <div class="container">
      <div style="display:flex;justify-content:space-between;align-items:center">
          <h2>${test.title}</h2>
          <div id="testTimerDisplay" style="font-weight:bold;font-size:1.2rem;color:var(--primary)">⏱️ 10:00</div>
      </div>
      <div class="test-progress">
        <div class="test-progress-bar" style="width:${((currentQuestion + 1) / test.questions.length * 100)}%"></div>
      </div>
      <div class="question-card">
        <div class="question-number">Întrebarea ${currentQuestion + 1} din ${test.questions.length}</div>
        <p class="question-text">${q.q}</p>
        <div class="options-list">
          ${q.a.map((answer, idx) => `
            <div class="option" onclick="selectAnswer(${idx})">
              <div class="option-marker">${String.fromCharCode(65 + idx)}</div>
              <div>${answer}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="test-navigation">
        ${currentQuestion > 0 ? '<button class="btn btn-secondary" onclick="prevQuestion()">← Înapoi</button>' : '<div></div>'}
        <button class="btn btn-primary" id="nextBtn" onclick="nextQuestion()" disabled>Următoarea →</button>
      </div>
    </div>
  `;
}

function selectAnswer(idx) {
    document.querySelectorAll('.option').forEach((opt, i) => {
        opt.classList.toggle('selected', i === idx);
    });
    userAnswers[currentQuestion] = idx;
    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    if (currentQuestion < tests[currentTest].questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResults();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function showResults(forced = false) {
    if (testTimer) clearInterval(testTimer);

    const test = tests[currentTest];
    let score = 0;
    test.questions.forEach((q, i) => {
        if (userAnswers[i] === q.c) score++;
    });
    const percentage = Math.round((score / test.questions.length) * 100);

    // Save Result
    if (!userProgress.tests[currentTest] || percentage > userProgress.tests[currentTest]) {
        userProgress.tests[currentTest] = percentage;
        saveProgress();
        checkMedals();
    }

    const main = document.getElementById('mainContent');
    main.innerHTML = `
    <div class="container text-center">
      <h2>🎉 Test Finalizat!</h2>
      <div class="result-score">${percentage}%</div>
      <div class="result-message">${percentage >= 80 ? '✅ Felicitări! Ai promovat!' : '❌ Mai învață și încearcă din nou!'}</div>
      <div class="result-details">
        <div class="result-stat">
          <div class="result-stat-number correct">${score}</div>
          <div class="result-stat-label">Corecte</div>
        </div>
        <div class="result-stat">
          <div class="result-stat-number incorrect">${test.questions.length - score}</div>
          <div class="result-stat-label">Greșite</div>
        </div>
      </div>
      <div style="margin-top:2rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="startTest('${currentTest}')">🔄 Încearcă din nou</button>
        <button class="btn btn-secondary" onclick="showSection('${currentTest}')">📖 Revizuiește lectia</button>
        <button class="btn btn-secondary" onclick="showSection('home')">🏠 Acasă</button>
      </div>
    </div>
  `;
}

function toggleMenu() {
    const menu = document.getElementById('mobileNav');
    const toggle = document.getElementById('menuToggle');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
}

function closeMenu() {
    document.getElementById('mobileNav').classList.remove('active');
    document.getElementById('menuToggle').classList.remove('active');
}

function toggleTheme() {
    darkMode = !darkMode;
    document.body.dataset.theme = darkMode ? 'dark' : '';
    localStorage.setItem('darkMode', darkMode);
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById('soundBtn').textContent = soundEnabled ? '🔊 Sunet: Pornit' : '🔇 Sunet: Oprit';
}



// ========== NEW FEATURES IMPLEMENTATION ==========

function showModal(title, contentHTML) {
    const main = document.getElementById('mainContent');
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="btn-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">${contentHTML}</div>
        </div>
    `;
    document.body.appendChild(modal);
}

function showGlossary() {
    closeMenu();
    const list = glossaryData.map(item => `
        <div class="glossary-item">
            <strong>${item.term}</strong>
            <p>${item.def}</p>
        </div>
    `).join('');
    showModal('📖 Glosar Termeni', `<div class="glossary-list">${list}</div>`);
}

function openSearch() {
    closeMenu();
    showModal('🔍 Căutare', `
        <input type="text" id="searchInput" placeholder="Caută termeni, capitole..." class="search-input" onkeyup="performSearch()">
        <div id="searchResults" class="search-results"></div>
    `);
    setTimeout(() => document.getElementById('searchInput').focus(), 100);
}

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('searchResults');

    if (query.length < 3) {
        resultsDiv.innerHTML = '<p class="text-muted">Introduceți minim 3 litere...</p>';
        return;
    }

    let hits = [];

    // Search in Glossary
    glossaryData.forEach(g => {
        if (g.term.toLowerCase().includes(query) || g.def.toLowerCase().includes(query)) {
            hits.push({ type: '📖 Glosar', title: g.term, subtitle: g.def, action: `showGlossary()` }); // Simplified action
        }
    });

    // Search in Chapters
    chapters.forEach(ch => {
        if (ch.title.toLowerCase().includes(query) || ch.desc.toLowerCase().includes(query)) {
            hits.push({ type: '📚 Capitol', title: ch.title, subtitle: ch.desc, action: `showSection('${ch.id}'); document.querySelector('.modal-overlay').remove()` });
        }
    });

    if (hits.length === 0) {
        resultsDiv.innerHTML = '<p>Niciun rezultat găsit.</p>';
    } else {
        resultsDiv.innerHTML = hits.map(hit => `
            <div class="search-hit" onclick="${hit.action}">
                <span class="hit-type">${hit.type}</span>
                <div class="hit-title">${hit.title}</div>
                <div class="hit-subtitle">${hit.subtitle}</div>
            </div>
        `).join('');
    }
}

function checkMedals() {
    const newMedals = [];
    const passedTests = Object.values(userProgress.tests).filter(s => s >= 80).length;
    const totalChapters = chapters.length;

    if (passedTests >= 1 && !userProgress.medals.includes('bronze')) newMedals.push('bronze');
    if (passedTests >= 5 && !userProgress.medals.includes('silver')) newMedals.push('silver');
    if (passedTests === totalChapters && !userProgress.medals.includes('gold')) newMedals.push('gold');
    if (userProgress.finalExam >= 80 && !userProgress.medals.includes('platinum')) newMedals.push('platinum');

    if (newMedals.length > 0) {
        userProgress.medals.push(...newMedals);
        saveProgress();
        // Optional: Show prompt "New Medal Unlocked!"
        alert(`🎉 Felicitări! Ai deblocat o medalie nouă!`);
    }
}

function showMedals() {
    closeMenu();
    const medalsConfig = {
        'bronze': { icon: '🥉', title: 'Începător', desc: 'Promovează primul test' },
        'silver': { icon: '🥈', title: 'Avansat', desc: 'Promovează 5 teste' },
        'gold': { icon: '🥇', title: 'Expert', desc: 'Promovează toate cele 10 teste' },
        'platinum': { icon: '🏆', title: 'Maestru', desc: 'Promovează examenul final' }
    };

    const grid = Object.entries(medalsConfig).map(([key, info]) => {
        const unlocked = userProgress.medals.includes(key);
        return `
            <div class="medal-card ${unlocked ? 'unlocked' : 'locked'}">
                <div class="medal-icon">${info.icon}</div>
                <div class="medal-title">${info.title}</div>
                <div class="medal-desc">${info.desc}</div>
                ${unlocked ? '<span class="status-badge">Deblocat</span>' : '<span class="status-badge locked">Blocat</span>'}
            </div>
        `;
    }).join('');

    showModal('🏅 Medalii & Realizări', `<div class="medals-grid">${grid}</div>`);
}

function showStats() {
    closeMenu();
    const passedTests = Object.values(userProgress.tests).filter(s => s >= 80).length;
    const totalScore = Object.values(userProgress.tests).reduce((a, b) => a + b, 0);
    const avgScore = passedTests > 0 ? Math.round(totalScore / Object.keys(userProgress.tests).length) : 0;

    showModal('📊 Statistici Progres', `
        <div class="stats-container">
            <div class="stat-big">
                <div class="stat-val">${passedTests} / 10</div>
                <div class="stat-lbl">Capitole Promovate</div>
            </div>
            <div class="stat-row">
                <div class="stat-item">
                    <b>${avgScore}%</b> Medie Scor
                </div>
                <div class="stat-item">
                    <b>${userProgress.medals.length}</b> Medalii
                </div>
            </div>
            <hr>
            <h4>Detaliu pe Capitole:</h4>
            <div class="chapters-progress-list">
                ${chapters.map(ch => {
        const score = userProgress.tests[ch.id] || 0;
        return `
                        <div class="prog-row">
                            <span>${ch.id.toUpperCase()}</span>
                            <div class="prog-bar-bg"><div class="prog-bar-fill" style="width:${score}%"></div></div>
                            <span>${score}%</span>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `);
}

// ========== ADVANCED FEATURES ==========

function startQuickQuiz() {
    closeMenu();
    // Gather all questions
    const allQuestions = [];
    Object.values(tests).forEach(t => allQuestions.push(...t.questions));

    // Shuffle and pick 10
    const selected = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);

    // Create virtual test
    tests['quick'] = {
        title: '⚡ Quiz Rapid',
        questions: selected
    };

    startTest('quick');
}

function startFinalExam() {
    closeMenu();
    // Gather 3 questions from each chapter
    const examQuestions = [];
    Object.values(tests).forEach(t => {
        if (t.title.includes('Quiz') || t.title.includes('Examen')) return; // Skip virtual tests
        const chapterQs = [...t.questions].sort(() => 0.5 - Math.random()).slice(0, 3);
        examQuestions.push(...chapterQs);
    });

    // Shuffle final set
    examQuestions.sort(() => 0.5 - Math.random());

    tests['final'] = {
        title: '🎓 Examen Final',
        questions: examQuestions
    };

    startTest('final');
}

function generateCertificate() {
    closeMenu();
    // Check requirements
    const chaptersPassed = Object.values(userProgress.tests).filter(s => s >= 80).length;
    const finalExamScore = userProgress.tests['final'] || 0;

    if (chaptersPassed < 10 || finalExamScore < 80) { // Requirement: 10 chapters + Final Exam
        alert('Pentru a genera certificatul trebuie să promovezi toate capitolele și examenul final (min 80%)!');
        return;
    }

    const date = new Date().toLocaleDateString('ro-RO');
    const name = prompt("Introduceți numele complet pentru certificat:", "Elev");
    if (!name) return;

    showModal('📜 Certificat de Absolvire', `
        <div class="certificate-container" id="printableCertificate">
            <div class="cert-header">CERTIFICAT DE ABSOLVIRE</div>
            <p>Se acordă elevului/elevei</p>
            <h2 class="cert-name">${name}</h2>
            <p>Pentru promovarea cu succes a modulului</p>
            <h3 class="cert-course">M1 - Măsurări Tehnice</h3>
            <p>Calificarea: Sudor</p>
            <div class="cert-details">
                <span>Data: ${date}</span>
                <span>Calificativ: Excelent</span>
            </div>
            <div class="cert-footer">
                <div>Profesor<br>Ing. Popescu Romulus</div>
                <div>Director<br>Prof. Ing. Silviana Ciupercă</div>
            </div>
            <div class="cert-stamp">Liceul Tehnologic "Aurel Vlaicu" Galați</div>
        </div>
        <button class="btn btn-primary" onclick="window.print()" style="margin-top:1rem; width:100%">🖨️ Printează Certificatul</button>
    `);
}

function showTeacherDashboard() {
    closeMenu();
    const pin = prompt("Introduceți PIN Profesor:");
    if (pin !== "profesor2025") {
        alert("PIN Incorect!");
        return;
    }

    const passedTests = Object.values(userProgress.tests).filter(s => s >= 80).length;
    const totalChapters = chapters.length; // 10
    const avgScore = Object.values(userProgress.tests).length ? Math.round(Object.values(userProgress.tests).reduce((a, b) => a + b, 0) / Object.values(userProgress.tests).length) : 0;

    showModal('🔐 Panou Profesor - Administrare', `
        <div class="teacher-dashboard">
            <div class="stat-row" style="margin-bottom:2rem">
                <div class="stat-item">
                    <b>${passedTests}/${totalChapters}</b> Capitole
                </div>
                <div class="stat-item">
                    <b>${avgScore}%</b> Medie Generală
                </div>
                <div class="stat-item">
                    <b>${userProgress.medals.length}</b> Medalii
                </div>
            </div>

            <h4>📋 Catalog Virtual (Date Locale)</h4>
            <div style="overflow-x:auto; margin-bottom:2rem">
                <table style="width:100%; text-align:left; border-collapse: collapse; min-width:500px">
                    <tr style="background:var(--surface-hover)">
                        <th style="padding:0.5rem">Elev</th>
                        <th style="padding:0.5rem">C1</th>
                        <th style="padding:0.5rem">C2</th>
                        <th style="padding:0.5rem">C3.1</th>
                        <th style="padding:0.5rem">Final</th>
                        <th style="padding:0.5rem">Acțiuni</th>
                    </tr>
                    <tr>
                        <td style="padding:0.5rem">Utilizator Curent</td>
                        <td style="padding:0.5rem">${userProgress.tests['c1'] || '-'}%</td>
                        <td style="padding:0.5rem">${userProgress.tests['c2'] || '-'}%</td>
                        <td style="padding:0.5rem">${userProgress.tests['c3-1'] || '-'}%</td>
                        <td style="padding:0.5rem"><b>${userProgress.tests['final'] || '-'}%</b></td>
                        <td style="padding:0.5rem">
                            <button class="btn btn-danger btn-sm" onclick="resetProgress()">Reset</button>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem">
                <button class="btn btn-primary" onclick="exportResultsToCSV()">📥 Export Catalog CSV (Excel)</button>
                <button class="btn btn-secondary" onclick="exportData()">💾 Backup Date (JSON)</button>
            </div>
        </div>
    `);
}

function resetProgress() {
    if (confirm('ATENȚIE: Această acțiune va șterge TOATE datele elevului curent! Continuăm?')) {
        localStorage.removeItem('userProgress');
        location.reload();
    }
}

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userProgress));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "backup_masurari_tehnice.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function exportResultsToCSV() {
    // Basic CSV structure mimicking a class export
    const headers = ['Nume Elev', 'Data', 'Capitole Promovate', 'Medie', 'C1', 'C2', 'C3.1', 'C3.2', 'C3.3', 'C3.4', 'C3.5', 'C3.6', 'C3.7', 'C3.8', 'Examen Final'];

    // Calculate data
    const passed = Object.values(userProgress.tests).filter(s => s >= 80).length;
    const total = Object.values(userProgress.tests).reduce((a, b) => a + b, 0);
    const count = Object.values(userProgress.tests).length;
    const avg = count ? Math.round(total / count) : 0;

    const row = [
        'Utilizator Curent',
        new Date().toLocaleDateString('ro-RO'),
        `${passed}/10`,
        `${avg}%`,
        userProgress.tests['c1'] || 0,
        userProgress.tests['c2'] || 0,
        userProgress.tests['c3-1'] || 0,
        userProgress.tests['c3-2'] || 0,
        userProgress.tests['c3-3'] || 0,
        userProgress.tests['c3-4'] || 0,
        userProgress.tests['c3-5'] || 0,
        userProgress.tests['c3-6'] || 0,
        userProgress.tests['c3-7'] || 0,
        userProgress.tests['c3-8'] || 0,
        userProgress.tests['final'] || 0
    ];

    const csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + row.join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "catalog_masurari_tehnice.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Load dark mode preference
    darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) document.body.dataset.theme = 'dark';

    // Show home page
    showSection('home');

    // Initial check for loading saved state is done globally

    window.addEventListener('online', () => {
        document.getElementById('offlineStatus').innerHTML = '🟢 Online';
    });
    window.addEventListener('offline', () => {
        document.getElementById('offlineStatus').innerHTML = '🔴 Offline';
    });
});

// ========== CHATBOT IMPLEMENTATION ==========
const chatBotData = {
    keywords: {
        'subler': 'Șublerul este principalul instrument de măsurare a lungimilor. Are o precizie de 0.1, 0.05 sau 0.02 mm. Se citește valoarea de pe riglă + valoarea de pe vernier.',
        'micrometru': 'Micrometrul este un instrument de precizie (0.01 mm). Se bazează pe șurubul micrometric. Citirea se face pe tubul fix (mm și 0.5mm) și tambur (sutimi).',
        'comparator': 'Comparatorul măsoară abaterile față de un etalon. Are un cadran gradat și un palpator. Fiecare diviziune este de obicei 0.01 mm.',
        'nssm': 'Siguranța muncii este vitală! Purtați EIP, nu măsurați piese în mișcare, curățați instrumentele și verificați calibrarea periodic.',
        'temperatura': 'Temperatura standard de măsurare este 20°C. Variațiile duc la dilatări/contractări termice care falsifică rezultatul.',
        'eroare': 'Eroarea este diferența dintre valoarea măsurată și cea reală. Poate fi sistematică (constantă) sau întâmplătoare (variabilă).',
        'filet': 'Filetele se verifică cu calibre (Trece/Nu Trece) sau se măsoară diametrul mediu cu micrometrul de filete.',
        'rugozitate': 'Rugozitatea (Ra) reprezintă neregularitățile suprafeței. Se măsoară în micrometri (μm) cu rugozimetrul.',
        'electric': 'Multimetrul măsoară U (volți - paralel), I (amperi - serie), R (ohmi - fără tensiune). Atenție la electrocutare!',
        'promovare': 'Pentru a promova ai nevoie de minim 80% la fiecare test și la examenul final. Vei primi un certificat PDF.'
    },
    default: 'Sunt asistentul tău virtual pentru Măsurări Tehnice. Întreabă-mă despre șublere, micrometre, toleranțe, formule sau siguranță (NSSM).'
};

function showChatBot() {
    closeMenu();
    showModal('🤖 Asistent Virtual', `
        <div class="chatbot-container">
            <div class="chatbot-messages" id="chatMessages">
                <div class="chat-message bot">Salut! Sunt asistentul tău tehnic. Cu ce te pot ajuta azi?</div>
                <div class="chat-suggestions">
                    <div class="chat-suggestion" onclick="sendQuery('Cum citesc șublerul?')">Șubler?</div>
                    <div class="chat-suggestion" onclick="sendQuery('Ce este NSSM?')">NSSM?</div>
                    <div class="chat-suggestion" onclick="sendQuery('Erori de măsurare')">Erori?</div>
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" id="chatInput" class="chat-input" placeholder="Scrie întrebarea ta..." onkeypress="if(event.key==='Enter') sendMessage()">
                <button class="chat-send-btn" onclick="sendMessage()">➤</button>
            </div>
        </div>
    `);
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    appendMessage(msg, 'user');
    input.value = '';

    // Simulate thinking
    setTimeout(() => {
        const response = generateBotResponse(msg);
        appendMessage(response, 'bot');
    }, 500);
}

function sendQuery(text) {
    appendMessage(text, 'user');
    setTimeout(() => {
        const response = generateBotResponse(text);
        appendMessage(response, 'bot');
    }, 500);
}

function appendMessage(text, type) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `chat-message ${type}`;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function generateBotResponse(input) {
    input = input.toLowerCase();

    for (const [key, value] of Object.entries(chatBotData.keywords)) {
        if (input.includes(key)) return value;
    }
    return chatBotData.default;
}

// ========== TEXT-TO-SPEECH IMPLEMENTATION ==========
let ttsUtterance = null;
let currentTTSBtn = null;

function toggleTTS(text, btn) {
    const synth = window.speechSynthesis;

    // If clicking a different button, stop current and start new
    if (currentTTSBtn && currentTTSBtn !== btn) {
        stopTTS();
    }

    // Initialize or Resume/Pause
    if (!ttsUtterance || currentTTSBtn !== btn) {
        // Start new speech
        stopTTS(); // Ensure clean slate
        ttsUtterance = new SpeechSynthesisUtterance(text);
        ttsUtterance.lang = 'ro-RO';
        ttsUtterance.rate = 1.0;

        ttsUtterance.onend = () => {
            btn.innerHTML = '🔈 Ascultă Lecția';
            btn.classList.remove('active', 'paused');
            currentTTSBtn = null;
            ttsUtterance = null;
        };

        ttsUtterance.onerror = () => {
            btn.innerHTML = '🔈 Ascultă Lecția';
            btn.classList.remove('active', 'paused');
        };

        synth.speak(ttsUtterance);
        currentTTSBtn = btn;
        btn.innerHTML = '⏸️ Pauză';
        btn.classList.add('active');

        // Inject Stop Button if not exists
        let stopBtn = btn.nextElementSibling;
        if (!stopBtn || !stopBtn.classList.contains('tts-stop-btn')) {
            stopBtn = document.createElement('button');
            stopBtn.className = 'btn btn-secondary btn-sm tts-stop-btn';
            stopBtn.innerText = '⏹️ Stop';
            stopBtn.style.marginLeft = '0.5rem';
            stopBtn.onclick = () => stopTTS();
            btn.parentNode.insertBefore(stopBtn, btn.nextSibling);
        }
        stopBtn.style.display = 'inline-block';

    } else {
        // Toggle Pause/Resume on same button
        if (synth.paused) {
            synth.resume();
            btn.innerHTML = '⏸️ Pauză';
            btn.classList.remove('paused');
        } else {
            synth.pause();
            btn.innerHTML = '▶️ Continuă';
            btn.classList.add('paused');
        }
    }
}

function stopTTS() {
    const synth = window.speechSynthesis;
    synth.cancel();
    ttsUtterance = null;

    // Reset UI
    if (currentTTSBtn) {
        currentTTSBtn.innerHTML = '🔈 Ascultă Lecția';
        currentTTSBtn.classList.remove('active', 'paused');

        const stopBtn = currentTTSBtn.nextElementSibling;
        if (stopBtn && stopBtn.classList.contains('tts-stop-btn')) {
            stopBtn.style.display = 'none';
        }
        currentTTSBtn = null;
    }

    // Safety cleanup for all buttons
    document.querySelectorAll('.tts-btn').forEach(b => {
        b.innerHTML = '🔈 Ascultă Lecția';
        b.classList.remove('active', 'paused');
    });
    document.querySelectorAll('.tts-stop-btn').forEach(b => b.remove());
}

// ========== GAMIFICATION IMPLEMENTATION ==========

// --- DUEL MODE ---
let duelScore = { p1: 0, p2: 0 };
let duelQuestions = [];
let duelCurrentQ = 0;

function showDuelSetup() {
    closeMenu();
    showModal('⚔️ Mod Duel', `
        <div class="duel-setup">
            <p>Provoacă un coleg sau joacă împotriva calculatorului!</p>
            <div class="duel-avatar-select">
                <div class="avatar-option selected" onclick="selectAvatar(this, 1)">👨‍🎓</div>
                <div class="avatar-option" onclick="selectAvatar(this, 2)">👩‍🎓</div>
                <div class="avatar-option" onclick="selectAvatar(this, 3)">🤖</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:1rem; max-width:300px; margin:0 auto">
                <button class="btn btn-primary" onclick="startDuel('bot')">🤖 vs Bot (Antrenament)</button>
                <button class="btn btn-secondary" onclick="startDuel('local')">👥 vs Coleg (Local)</button>
            </div>
        </div>
    `);
}

function selectAvatar(el, id) {
    document.querySelectorAll('.avatar-option').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
}

function startDuel(mode) {
    // Setup Duel
    duelScore = { p1: 0, p2: 0 };
    duelCurrentQ = 0;

    // Get random 5 questions
    const allQs = [];
    Object.values(tests).forEach(t => allQs.push(...t.questions));
    duelQuestions = allQs.sort(() => 0.5 - Math.random()).slice(0, 5);

    showDuelQuestion(mode);
}

function showDuelQuestion(mode) {
    if (duelCurrentQ >= duelQuestions.length) {
        showDuelResults(mode);
        return;
    }

    const q = duelQuestions[duelCurrentQ];

    showModal(`⚔️ Duel - Întrebarea ${duelCurrentQ + 1}/5`, `
        <div class="duel-arena">
            <div class="duel-player">
                <span class="player-avatar">You</span>
                <span class="player-score" id="scoreP1">${duelScore.p1}</span>
            </div>
            <div class="vs-badge">VS</div>
            <div class="duel-player">
                <span class="player-avatar">${mode === 'bot' ? '🤖' : 'P2'}</span>
                <span class="player-score" id="scoreP2">${duelScore.p2}</span>
            </div>
        </div>
        <div class="question-card">
            <p class="question-text">${q.q}</p>
            <div class="options-list">
                ${q.a.map((ans, idx) => `
                    <div class="option" onclick="handleDuelAnswer(${idx}, ${q.c}, '${mode}')">
                        <div class="option-marker">${String.fromCharCode(65 + idx)}</div>
                        <div>${ans}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `);
}

function handleDuelAnswer(idx, correct, mode) {
    // Player 1 Logic
    if (idx === correct) duelScore.p1 += 100;

    // Opponent Logic
    if (mode === 'bot') {
        // Bot has 70% accuracy
        if (Math.random() > 0.3) duelScore.p2 += 100;
    } else {
        // Local multiplayer
        if (Math.random() > 0.5) duelScore.p2 += 100;
    }

    duelCurrentQ++;
    setTimeout(() => showDuelQuestion(mode), 500);
}

function showDuelResults(mode) {
    const win = duelScore.p1 > duelScore.p2;
    const tie = duelScore.p1 === duelScore.p2;
    let msg = win ? '🎉 Ai Câștigat!' : (tie ? '🤝 Egalitate!' : '😔 Ai Pierdut!');

    showModal('🏁 Rezultat Duel', `
        <div class="text-center">
            <h2>${msg}</h2>
            <div class="duel-arena" style="justify-content:center; gap:2rem">
                <div class="duel-player">
                    <span class="player-avatar">You</span>
                    <span class="player-score">${duelScore.p1}</span>
                </div>
                <div class="duel-player">
                    <span class="player-avatar">${mode === 'bot' ? '🤖' : 'P2'}</span>
                    <span class="player-score">${duelScore.p2}</span>
                </div>
            </div>
            <button class="btn btn-primary" onclick="showDuelSetup()">🔄 Joacă din nou</button>
        </div>
    `);
}

// --- DAILY CHALLENGE ---
function showDailyChallenge() {
    closeMenu();

    // Deterministic random based on date
    const dateStr = new Date().toDateString();
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) seed += dateStr.charCodeAt(i);

    const allQs = [];
    Object.values(tests).forEach(t => allQs.push(...t.questions));
    const dayQ = allQs[seed % allQs.length];

    showModal('📅 Provocarea Zilei', `
        <div class="text-center">
            <div class="daily-challenge-badge">XP Dublu!</div>
            <h3>${dayQ.q}</h3>
            <div class="options-list text-left" style="margin-top:1.5rem">
                ${dayQ.a.map((ans, idx) => `
                    <div class="option" onclick="${idx === dayQ.c ? 'alert(\'🎉 Corect! +200 XP\'); this.classList.add(\'correct\')' : 'alert(\'❌ Greșit!\'); this.classList.add(\'incorrect\')'}">
                        <div class="option-marker">${String.fromCharCode(65 + idx)}</div>
                        <div>${ans}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `);
}

// --- SPEED TEST ---
let speedTimer = null;
let speedTimeLeft = 60;
let speedScore = 0;

function startSpeedTest() {
    closeMenu();
    speedTimeLeft = 60;
    speedScore = 0;

    // Get 20 random questions
    const allQs = [];
    Object.values(tests).forEach(t => allQs.push(...t.questions));
    const speedQs = allQs.sort(() => 0.5 - Math.random()).slice(0, 20);

    runSpeedQuestion(speedQs, 0);
}

function runSpeedQuestion(qs, idx) {
    if (idx >= qs.length || speedTimeLeft <= 0) {
        endSpeedTest();
        return;
    }

    if (idx === 0) {
        // Start Timer
        speedTimer = setInterval(() => {
            speedTimeLeft--;
            const el = document.getElementById('speedTimerDisplay');
            if (el) el.innerText = speedTimeLeft;
            if (speedTimeLeft <= 0) {
                clearInterval(speedTimer);
                endSpeedTest();
            }
        }, 1000);
    }

    const q = qs[idx];
    showModal(`⚡ Speed Test (${idx + 1}/${qs.length})`, `
        <div class="speed-test-timer" id="speedTimerDisplay">${speedTimeLeft}</div>
        <p class="question-text">${q.q}</p>
        <div class="options-list">
            ${q.a.map((ans, aIdx) => `
                <div class="option" onclick="handleSpeedAnswer(${aIdx}, ${q.c}, ${idx}, '${qs.map(x => x.q).join('|').replace(/'/g, "\\'")}')">
                    <div class="option-marker">${String.fromCharCode(65 + aIdx)}</div>
                    <div>${ans}</div>
                </div>
            `).join('')}
        </div>
    `);

    // Re-bind click to avoid serialization issues
    window.currentSpeedQs = qs;
    window.currentSpeedIdx = idx;
}

window.handleSpeedAnswer = function (aIdx, correct) {
    if (aIdx === correct) speedScore++;
    window.currentSpeedIdx++;
    runSpeedQuestion(window.currentSpeedQs, window.currentSpeedIdx);
};

function endSpeedTest() {
    clearInterval(speedTimer);
    showModal('⚡ Rezultat Speed Test', `
        <div class="text-center">
            <h2>Timp Expirat!</h2>
            <div class="result-score">${speedScore}</div>
            <p>Răspunsuri corecte într-un minut.</p>
            <button class="btn btn-primary" onclick="startSpeedTest()">🔄 Încearcă din nou</button>
        </div>
    `);
}

// ========== WORKSHEETS IMPLEMENTATION ==========
function showWorksheets() {
    closeMenu();
    showModal('📄 Fișe de Lucru Precompilate', `
        <div class="worksheets-container">
            <p style="margin-bottom:1rem;color:var(--text-secondary)">Fișe gata de printat pentru activități în atelier:</p>
            
            <div class="worksheet-card" onclick="openWorksheet('W1')">
                <div class="ws-icon">📏</div>
                <div class="ws-info">
                    <h4>Fișa 1: Citirea Șublerului</h4>
                    <p>Exerciții de citire 0.1mm și 0.05mm</p>
                </div>
                <div class="ws-action">🖨️</div>
            </div>

            <div class="worksheet-card" onclick="openWorksheet('W2')">
                <div class="ws-icon">🎯</div>
                <div class="ws-info">
                    <h4>Fișa 2: Citirea Micrometrului</h4>
                    <p>Exerciții de citire 0.01mm</p>
                </div>
                <div class="ws-action">🖨️</div>
            </div>
            
            <div class="worksheet-card" onclick="openWorksheet('W3')">
                <div class="ws-icon">⚠️</div>
                <div class="ws-info">
                    <h4>Fișa 3: Audit NSSM</h4>
                    <p>Checklist verificare siguranța muncii</p>
                </div>
                <div class="ws-action">🖨️</div>
            </div>
        </div>
    `);
}

function openWorksheet(id) {
    let content = '';
    let title = '';

    if (id === 'W1') {
        title = 'Fișa de Lucru nr. 1 - Șublerul';
        content = `
            <div class="print-paper">
                <div class="print-header">
                    <h2>FIȘA DE LUCRU NR. 1</h2>
                    <p>Măsurarea cu Șublerul de Exterior/Interior</p>
                    <div style="display:flex;justify-content:space-between;margin-top:1rem;border-bottom:2px solid #000">
                        <span>Nume elev: ............................</span>
                        <span>Data: ...................</span>
                        <span>Nota: .....</span>
                    </div>
                </div>
                <div class="print-body">
                    <h3>1. Identificați părțile componente:</h3>
                    <div style="height:100px;border:1px dashed #ccc;margin:1rem 0;display:flex;align-items:center;justify-content:center;color:#999">[Loc pentru desen șubler]</div>
                    <p>a) ........................................ b) ........................................</p>
                    
                    <h3>2. Citiți valorile indicate:</h3>
                    <p>Sarcina A: Măsurați diametrul exterior al piesei nr. 1.</p>
                    <p>Valoarea citită: ................. mm</p>
                    
                    <h3>3. Aplicație practică:</h3>
                    <p>Realizați 5 măsurători consecutive pe aceeași piesă și calculați media.</p>
                    <table class="print-table">
                        <tr><th>M1</th><th>M2</th><th>M3</th><th>M4</th><th>M5</th><th>Media</th></tr>
                        <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
                    </table>
                </div>
                <div class="print-footer">
                    <p>Profesor: Popescu Romulus | Liceul Tehnologic "Aurel Vlaicu"</p>
                </div>
            </div>
            <div class="no-print" style="margin-top:1rem;display:flex;gap:1rem">
                <button class="btn btn-primary" onclick="window.print()" style="flex:1">🖨️ Printează Fișa</button>
                <button class="btn btn-secondary" onclick="window.close()" style="flex:1;background:#64748b">❌ Închide Fereastra</button>
            </div>
        `;
    } else if (id === 'W2') {
        title = 'Fișa de Lucru nr. 2 - Micrometrul';
        content = `
            <div class="print-paper">
                <div class="print-header">
                    <h2>FIȘA DE LUCRU NR. 2</h2>
                    <p>Măsurarea de Precizie cu Micrometrul</p>
                    <div style="display:flex;justify-content:space-between;margin-top:1rem;border-bottom:2px solid #000">
                        <span>Nume elev: ............................</span>
                        <span>Data: ...................</span>
                    </div>
                </div>
                <div class="print-body">
                    <h3>1. Reguli de utilizare:</h3>
                    <p>Enumerați 3 reguli de protecție a micrometrului:</p>
                    <ol>
                        <li>................................................................</li>
                        <li>................................................................</li>
                        <li>................................................................</li>
                    </ol>
                    
                    <h3>2. Exercițiu citire (0.01mm):</h3>
                    <p>Tub fix: 15.5mm | Tambur: diviziunea 32. Valoarea = .................</p>
                </div>
            </div>
            <div class="no-print" style="margin-top:1rem;display:flex;gap:1rem">
                <button class="btn btn-primary" onclick="window.print()" style="flex:1">🖨️ Printează Fișa</button>
                <button class="btn btn-secondary" onclick="window.close()" style="flex:1;background:#64748b">❌ Închide Fereastra</button>
            </div>
         `;
    } else {
        title = 'Fișa de Lucru nr. 3 - NSSM';
        content = `
             <div class="print-paper">
                <h2>Checklist Audit NSSM</h2>
                <ul class="checklist">
                    <li>[ ] Echipament de protecție purtat corect</li>
                    <li>[ ] Instrumente curate și calibrate</li>
                    <li>[ ] Iluminare corespunzătoare la bancul de lucru</li>
                    <li>[ ] Nu există piese în mișcare neprotejate</li>
                </ul>
             </div>
             <div class="no-print" style="margin-top:1rem;display:flex;gap:1rem">
                <button class="btn btn-primary" onclick="window.print()" style="flex:1">🖨️ Printează Fișa</button>
                <button class="btn btn-secondary" onclick="window.close()" style="flex:1;background:#64748b">❌ Închide Fereastra</button>
            </div>
        `;
    }

    // Open in new window for printing
    const w = window.open('', '_blank');
    w.document.write(`
        <html>
        <head>
            <title>${title}</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: #f0f0f0; padding: 2rem; }
                .print-paper { background: white; padding: 2cm; max-width: 21cm; margin: 0 auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); border-radius: 4px; }
                .print-header { text-align: center; margin-bottom: 2rem; }
                .print-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                .print-table th, .print-table td { border: 1px solid black; padding: 0.5rem; text-align: center; }
                .btn { display: block; padding: 1rem; background: #4f46e5; color: white; text-align: center; border: none; border-radius: 8px; cursor: pointer; text-decoration: none; font-size: 1.1rem; }
                @media print {
                    body { background: white; padding: 0; }
                    .print-paper { box-shadow: none; padding: 0; margin: 0; width: 100%; max-width: none; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>${content}</body>
        </html>
    `);
    w.document.close();
}

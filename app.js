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
    { id: 'c3-5', icon: '🌡️', title: '3.5 Temperatură', desc: 'Termometre, termocuple, termor', hours: '2T + 8IP' },
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
                title: '📏 Șublere (Șubiere)',
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
                text: 'Instrumente de măsurare prin comparație cu etalon:',
                items: [
                    'Comparator cu cadran: ac indicator pe cadran gradat, precizie 0.01mm sau 0.001mm',
                    'Principiu: palpator→ pinioane→ cremalieră→ ac indicator (amplificare mecanică 100-1000×)',
                    'Gameă măsurare: ±0.5mm, ±1mm, ±5mm, ±10mm',
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
                    'Avantaje: precizie extr emă, măsurare piese mici, verificare forme complexe',
                    'Dezavantaje: costisitoare, manipulare delicată, timp măsurare mai lung'
                ]
            }
        ],
        nssm: '⚠️ NSSM: Nu lăsați instrumentele pe mașini în funcțiune (vibrații deteriorează precizia). Curățați suprafețele de măsurare înainte și după utilizare. Verificați calibrarea periodică (minim anual). Păstrați în etui protector. Evitați șocurile termice (trecere rapidă de la rece la cald). La micrometre folosiți clichetul, nu strângeți forțat!'
    },

    'c3-2': {
        title: '3.2 Măsurarea și Controlul Unghiurilor',
        intro: 'Precizia unghiulară este esențială pentru piese conice, șanfrenuri, scule așch ietoare. Erorile unghiulare se măsoară în grade, minute (1°=60\'),  secunde (1\'=60").',
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
                    'Precizie: 0.01mm, pentru călibrare calibre'
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
                title: '⚠️⚠️⚠️ NSSM ELECTRONI SPECIFICE - OBLIGATORII!',
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
    { term: 'Abatere', def: 'Diferența algebrică între o dimensiune (reală sau limită) și dimensiunea nominală corespunzătoare.' },
    { term: 'Alezaj', def: 'Termen general pentru suprafața interioară (gaura) a unei piese, de obicei cilindrică.' },
    { term: 'Ajustaj', def: 'Relația rezultată din diferența dimensiunilor înainte de asamblare a două piese (arbore și alezaj).' },
    { term: 'Arbore', def: 'Termen general pentru suprafața exterioară a unei piese, de obicei cilindrică.' },
    { term: 'Calibrare', def: 'Ansamblul operațiilor care stabilesc legătura dintre valorile indicate de un aparat și valorile etalon.' },
    { term: 'Comparator', def: 'Instrument care măsoară abaterile dimensiunilor față de un etalon, nu dimensiunea absolută.' },
    { term: 'Dimensiune nominală (Dn)', def: 'Dimensiunea față de care se definesc dimensiunile limită (din desenul tehnic).' },
    { term: 'Eroare absolută', def: 'Diferența dintre valoarea măsurată și valoarea reală a măsurandului.' },
    { term: 'Goniometru', def: 'Instrument pentru măsurarea unghiurilor.' },
    { term: 'Micrometru', def: 'Instrument de măsurare de precizie (0.01mm) bazat pe sistemul șurub-piuliță.' },
    { term: 'Modul (m)', def: 'Mărime caracteristică a roților dințate (m = D/z).' },
    { term: 'NSSM', def: 'Norme Specifice de Securitate și Sănătate în Muncă.' },
    { term: 'Pas (P)', def: 'Distanța dintre două puncte omoloage consecutive (la filete sau roți dințate).' },
    { term: 'Rugozitate', def: 'Ansamblul neregularităților (asperităților) de pe o suprafață prelucrată.' },
    { term: 'Șubler', def: 'Instrument de măsurare lungimi cu vernier (precizie 0.1 sau 0.05mm).' },
    { term: 'Toleranță (T)', def: 'Diferența dintre dimensiunea maximă și minimă admisă.' },
    { term: 'Vernier', def: 'Scară gradată ajutătoare care permite citirea fracțiunilor de diviziune.' }
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
            { q: 'Princi piul micrometrului se bazează pe:', a: ['Vernier', 'Șurub micrometric', 'Comparație', 'Optică'], c: 1 },
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
            { q: 'Calibrul TRECE verifică:', a: ['Dimensiuni minime', 'Dimensiuni maxime admise', 'Pasul', 'Ungh iul'], c: 1 },
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
        main.innerHTML = `
      <div class="container">
        <h2>${chap.title}</h2>
        <p style="font-size:1.1rem;margin-bottom:2rem;color:var(--text-secondary)">${chap.intro}</p>
        ${chap.sections.map(sec => `
          <div class="content-card">
            <h3>${sec.title}</h3>
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

function startTest(chapterId) {
    if (!tests[chapterId]) {
        alert('Test indisponibil pentru acest capitol.');
        return;
    }
    currentTest = chapterId;
    currentQuestion = 0;
    userAnswers = [];
    showQuestion();
}

function showQuestion() {
    const test = tests[currentTest];
    const q = test.questions[currentQuestion];
    const main = document.getElementById('mainContent');

    main.innerHTML = `
    <div class="container">
      <h2>${test.title}</h2>
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

function showResults() {
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

function generateCertificate() {
    alert('Certificate în dezvoltare');
    closeMenu();
}

function startQuickQuiz() {
    alert('Quiz Rapid în dezvoltare');
    closeMenu();
}

function startFinalExam() {
    alert('Examen Final în dezvoltare');
    closeMenu();
}

function showTeacherDashboard() {
    alert('Panou Profesor în dezvoltare');
    closeMenu();
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

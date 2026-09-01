const emojis = ['🍑', '🍆', '🍺', '🍷', '😂', '👽', '❤️'];

const emojiColors = {
    '🍑': '#FFC0CB',
    '🍆': '#800080',
    '🍺': '#FFD700',
    '🍷': '#8B0000',
    '😂': '#FFFF00',
    '👽': '#00FF00',
    '❤️': '#FF0000'
};

const state = {
    players: [],
    mode: 'classic',
    round: 1,
    spinning: false,
    history: [],
    timerSeconds: 0,
    timerInterval: null,
    timerRunning: false,
    language: 'en',
    jackpotRules: {},
    tooHot: false,
    neverEverActive: false,
    neverEverMode: false,
    neverEverQuestionsUsed: 0,
    neverEverActionsUsed: 0,
};

// --- Profils du cowboy annonceur ---

let cowboyVoiceEnabled = true;
let cowboyVolume = 1.0;
let lastActivity = Date.now();
let idleCheckInterval = null;
let cowboyVoice = null;
let cowboyHasSpoken = false;
let selectedCowboyProfile = 'texan_m';

if (typeof cowboyState === 'undefined') {
    window.cowboyState = {};
}
if (!window.cowboyState.selectedProfile) {
    window.cowboyState.selectedProfile = 'texan_m';
}
selectedCowboyProfile = window.cowboyState.selectedProfile;
if (typeof window.cowboyState.volume === 'number') {
    cowboyVolume = window.cowboyState.volume;
}

const profileBases = [
    {
        id: 'texan',
        label: 'Texan',
        emoji: '🤠',
        group: 'en',
        lang: 'en-US',
        rate: 0.88,
        malePitch: 0.55,
        femalePitch: 0.92,
        maleVoiceHint: 'david|alex|daniel|mark|james|en-US',
        femaleVoiceHint: 'karen|samantha|victoria|moira|en-US',
        ready: [
            "Howdy, folks! Let's get this wheel spinning!",
            "Yee-haw! The Jackpot is loaded and ready!",
            "Grab your hats, we're fixin' to spin!",
            "Whoa there! Get ready for a ripper of a time!",
            "Welcome to the rowdiest saloon this side of the Pecos!",
            "Saddle up, partners! Fortune favors the bold and the thirsty!",
            "The reels are hotter than a branding iron tonight!",
            "Step right up! Every spin's a brand new adventure under the big Texas sky!",
            "Yeeeehaw! Let's make memories and empty some glasses!",
            "The gold rush ain't got nothing on this jackpot, I reckon!",
            "Giddy up! Luck loves a brave Texan!",
            "Tonight we spin like there's no tomorrow, y'all!"
        ],
        spinning: [
            'Spinning...',
            "Hold on tight, y'all!",
            "You ain't seen nothin' yet!",
            'Round and round she goes!',
            'My spurs are tingling!',
            'Here we go, hold your horses!'
        ],
        win: [
            'Jackpot! You hit the motherlode!',
            "Hot diggity dog, that's a hit!",
            'Look at that luck, partner!',
            "Yeehaw! That's how we do it in Texas!",
            'You knocked it out of the park!',
            'Praise the golden horseshoe!',
            'The saloon goes wild! Drink up, partner!',
            "Sweet mother of tumbleweeds, what a spin!",
            "I ain't seen luck like that since the gold rush!",
            'That deserves a drink as big as Texas!',
            'Ride that lucky streak, cowboy!'
        ],
        lose: [
            'Next time, partner!',
            "Keep tryin', y'all!",
            'Better luck next spin!',
            'Not today, but tomorrow\'s another day!',
            'Dust yourself off and try again!',
            'Aw shucks, so close!',
            "The wheel's shy tonight...",
            'Even the best Texans miss the bullseye!',
            "Don't cry in your beer, partner — spin again!"
        ],
        idle: [
            "This wheel ain't gonna spin itself, partner!",
            'A Texan never waits — he rides!',
            'The Jackpot is getting impatient!',
            'My horse spins more than you do!',
            'In all my years on the prairie, I never saw a jackpot win itself!',
            'Hey! The drinks are getting warm over here!',
            'Even my cactus is more animated than this!',
            'The tumbleweeds are bored, partner!',
            'Fortune knocks softly... but the wheel needs a push!'
        ],
        spinCommand: ['Spin!', 'GO!', "Let's do this!", 'Show me what you got!', 'Yeehaw!'],
        start: [
            'Let the good times roll, partner!',
            'Another round, another chance at glory!',
            'Time to get this party started!',
            'Round two, here we come!',
            'Ready for another wild ride?'
        ],
        winChallenge: [
            "You drew the lucky straw! Your challenge is: {{challenge}} — Drink up and have fun with it!",
            "Jackpot! The spirits of the saloon decree: {{challenge}} Make it count, partner!",
            "Hot damn! The cards have spoken: {{challenge}} Show 'em how it's done!",
            "Ain't that a beaut! Your dare is: {{challenge}} Living dangerously, I like it!",
            "The jackpot gods are smiling: {{challenge}} Take this drink like a true Texan!",
            "Sweet mother of tumbleweeds! Your mission: {{challenge}} Ride that storm, partner!",
            "The wheel of fortune spins in your favor! {{challenge}} — No backing down now!",
            "That's a big win! The challenge: {{challenge}} Make it as legendary as this spin!"
        ],
        loseReaction: [
            "No match this time, but the drinks keep flowing! Try again!",
            "A miss is as good as a mile, but this ain't no time for sad faces! Spin again!",
            "The wheel says not today, but fortune is fickle — don't give up!",
            "Close only counts in horseshoes and hand grenades! Give it another whirl!",
            "The reels are shy tonight… or are they? Let's find out with another spin!",
            "Not the jackpot, but the night is still young! Spin that wheel!"
        ]
    },
    {
        id: 'australian',
        label: 'Australian',
        emoji: '🦘',
        group: 'en',
        lang: 'en-AU',
        rate: 1.1,
        malePitch: 0.85,
        femalePitch: 0.95,
        maleVoiceHint: 'karen|lee|en-AU',
        femaleVoiceHint: 'karen|lee|en-AU',
        ready: [
            "G'day cobbers, ready to give this beauty a spin?",
            "Crikey! The wheel's all fired up and ready to go!",
            "Let's give it a burl, mate!",
            "No worries, mates — let the good times roll!",
            "Bonzer day for a spin, if I do say so meself!",
            "Strap in, cobbers — here we go!",
            "Fair dinkum, this game's a ripper!",
            "Let's get this show on the road, mate!",
            "What a beauty of a wheel! Let's spin it!",
            "She'll be right, mate — just press the button!",
            "G'day and welcome to the lucky land down under!",
            "Ready for a fair go at the jackpot?"
        ],
        spinning: [
            'Spinning...',
            "Hold on tight, mate!",
            "She's going round and round like a boomerang!",
            "Bit of a ripper spin coming up!",
            "Here we go, no stress!"
        ],
        win: [
            'Fair dinkum! You nailed it, mate!',
            "Crikey! That's a ripper of a win!",
            "Bonzer! Absolutely bonzer!",
            "You beauty! Drink up, mate!",
            "That's gold, that is!",
            "Strewth! What a spin!",
            "You little beauty!",
            "Couldn't have gone better, mate!",
            "That's a fair dinkum miracle!"
        ],
        lose: [
            "No worries, mate! Have another go!",
            "Better luck next time, ay?",
            "She'll be right, don't sweat it!",
            "Close one! Have another spin!",
            "Tough luck, cobber — keep at it!"
        ],
        idle: [
            "Oi! The wheel's waiting, mate!",
            "C'mon, let's get it spinning!",
            "Even a kangaroo hops faster than this!",
            "You going to stand there all day, ay?",
            "Let's go, mate! The drinks are getting warm!",
            "Even my pet kangaroo spins better than you!"
        ],
        spinCommand: ['Spin it!', "Go on, mate!", "Let's do it!", "Give it a burl!"],
        start: [
            "Let's get this party started, mate!",
            "Another round, no worries!",
            "She'll be right, let's go!",
            "Bonzer! Let's spin!"
        ],
        winChallenge: [
            "Fair dinkum! You nailed it — {{challenge}} Give it a go, mate!",
            "Crikey, that's a ripper! Your challenge: {{challenge}} — Show 'em how it's done, mate!",
            "You beauty! The wheel has spoken: {{challenge}} Drink up and enjoy it, mate!",
            "Strewth! You hit the jackpot: {{challenge}} — Don't be a drongo, do it with style!",
            "That's gold, mate! Your challenge: {{challenge}} Give it your best shot!",
            "Absolutely bonzer! {{challenge}} — Cheers to that, mate!"
        ],
        loseReaction: [
            "No worries, mate — have another crack at it!",
            "Tough luck, cobber — the wheel will come around!",
            "She'll be right — spin again, mate!",
            "No jackpot, but the drinks are still flowing!",
            "Close one, ay? Give it another go!"
        ]
    },
    {
        id: 'british',
        label: 'British Rustic',
        emoji: '🧥',
        group: 'en',
        lang: 'en-GB',
        rate: 0.88,
        malePitch: 0.65,
        femalePitch: 0.9,
        maleVoiceHint: 'daniel|oliver|en-GB',
        femaleVoiceHint: 'samantha|victoria|en-GB',
        ready: [
            "Right then, let's have a go, eh?",
            "Blimey! The machine's all warmed up!",
            "Give it a spin, won't you?",
            "Well, well — let's see what fortune has in store!",
            "Cheerio! Let's get this show on the road!",
            "Fingers crossed, eh? Let's have a crack at it!",
            "Blimey, what a lark! Let's get spinning!",
            "Jolly good! The reels are ready for action!",
            "Cor blimey! Ready for some fun?",
            "Innit! Let's get this party crackin'!"
        ],
        spinning: [
            'Spinning...',
            'Hold your horses!',
            "Here we go then...",
            'Round and round it goes, brill!',
            'Fingers crossed!'
        ],
        win: [
            'Cor blimey! You actually did it!',
            'Jolly good show! That\'s a smashing winner!',
            'Blimey, that\'s brilliant!',
            'Bloody hell — what a spin!',
            'Tremendous! Drink up, everyone!',
            'Huzzah! That\'s how it\'s done!',
            'You little beauty!',
            'Fantastic! Well done, old chap!'
        ],
        lose: [
            "Ah well, never mind! Have another go!",
            "Tough luck, old chap — keep at it!",
            "Better luck next time, eh?",
            "Never say die — spin again!",
            "Close shave! Another round!"
        ],
        idle: [
            "Oi! The machine's waiting, innit!",
            "Are we going to stand here all day, love?",
            "Even my dog spins faster than this lot!",
            "Come on, let's get a move on!",
            "The ale's getting warm over here!",
            "Blimey, even the cat's bored!"
        ],
        spinCommand: ['Go on!', 'Have a go!', 'Let\'s have it!', "Don't be shy!"],
        start: [
            "Right then, let's get this party started!",
            "Another round — jolly good!",
            "Let's get on with it!",
            "Round two — fingers crossed!",
            "Cheerio! Let's spin!"
        ],
        winChallenge: [
            "Blimey! You've hit the jackpot — {{challenge}} Go on, give it a go, old chap!",
            "Jolly good! The challenge is: {{challenge}} — Smashing! Make it count!",
            "Cor blimey! Your dare: {{challenge}} — Don't be a coward now!",
            "Bloody hell, what a win! {{challenge}} — Drink up like a proper Brit!",
            "Tremendous spin! Your challenge: {{challenge}} — Show us how it's done!",
            "You beauty! {{challenge}} — Let's have a jolly good laugh about it!"
        ],
        loseReaction: [
            "No jackpot this time, but never say die! Spin again!",
            "Tough luck, cobber — the wheel will come good!",
            "Ah well, another round won't hurt!",
            "Close one, eh? Have another crack at it!",
            "No luck this time, but the night is young, innit!"
        ]
    },
    {
        id: 'berrichon',
        label: 'Berrichon',
        emoji: '🌾',
        group: 'fr',
        lang: 'fr-FR',
        rate: 0.82,
        malePitch: 0.6,
        femalePitch: 0.82,
        maleVoiceHint: 'paul|fr-FR|male',
        femaleVoiceHint: 'sylvie|fr-FR|female|female',
        ready: [
            "Ben viendieu, on va faire tourner la machine, les gars !",
            "Allez, les amis, à la vôtre !",
            "Pardi, ça va être une belle soirée viendieu !",
            "Allons-y, on n'est pas pressés mais on va gagner !",
            "Eh ben, la roue est prête, viendieu !",
            "Allez tourne, ma belle ! On a soif !",
            "Pardi, le jackpot nous attend !",
            "Allons-y, y'a du bon vin qui nous attend !",
            "Viendieu, les amis, à la vôtre et à la machine !",
            "Bonne soirée à vous tous, on se marte !",
            "Eh ben, on va se marrer, viendieu !",
            "Pardi, ce soir, on est tous gagnants !"
        ],
        spinning: [
            'Tourne...',
            "Allez, ma belle, tourne !",
            "On y va, viendieu !",
            'La roue tourne...',
            'Tiens-toi bien, les amis !'
        ],
        win: [
            "Ben viendieu ! C'est gagné, ça !",
            "Pardi, quel coup de chance viendieu !",
            "Mais c'est magnifique, les amis !",
            "Allez, à boire, c'est mérité !",
            "La Sainte machine a parlé !",
            "C'est la win, viendieu ! Bois un coup !",
            "Sacré coup de bol, ça !",
            "Allez, tous à table !",
            "Viendieu, on a gagné ! À la vôtre !",
            "Mais c'est bien, mais c'est bien !"
        ],
        lose: [
            "Ben tant pis, on recommence !",
            "Pardi, c'est pas aujourd'hui !",
            "Viendieu, la prochaine fois !",
            "Allez, ne sois pas triste, on tourne encore !",
            "C'est pas grave, on a toute la soirée !",
            "Ben viendieu, la roue est taquine !"
        ],
        idle: [
            "Ben viendieu, la machine tourne pas toute seule !",
            "Allez, on n'est pas des planches !",
            "La machine s'impatiente, viendieu !",
            "Même ma vache tourne plus vite que toi !",
            "Allons, les amis, à la vôtre et tournez !",
            "Viendieu, ne t'endors pas là !",
            "Hey ! La machine attend, pardi !"
        ],
        spinCommand: ['Allez !', 'Tourne !', "Vas-y !", "C'est parti !"],
        start: [
            "Allons-y, que la fête commence !",
            "Une nouvelle manche, viendieu !",
            "C'est parti, mes amis !",
            "On est prêts, alors tournons !",
            "Pardi, c'est parti pour la soirée !"
        ],
        winChallenge: [
            "Ben viendieu, c'est gagné ! Ton défi : {{challenge}} — Bois un coup et assume, viendieu !",
            "Pardi, la machine a parlé ! {{challenge}} — Faut pas avoir peur, les amis !",
            "La Sainte roue te l'ordonne : {{challenge}} — Bois ça d'un trait, viendieu !",
            "C'est la win, viendieu ! {{challenge}} — Montre ce que tu vaux, mais !",
            "Allez, {{challenge}} — C'est cadeau, profites-en, pardi !",
            "Mais c'est magnifique ! {{challenge}} — Bois ça fièrement, viendieu !"
        ],
        loseReaction: [
            "Ben tant pis, viendieu ! On recommence !",
            "Pardi, c'est pas la win, mais on tourne encore !",
            "La roue est taquine ce soir, mais on y croit !",
            "Ben c'est pas grave, on a toute la nuit, viendieu !",
            "La prochaine sera la bonne, pardi !"
        ]
    },
    {
        id: 'marseillais',
        label: 'Marseillais',
        emoji: '⚽',
        group: 'fr',
        lang: 'fr-FR',
        rate: 1.2,
        malePitch: 0.78,
        femalePitch: 0.9,
        maleVoiceHint: 'paul|fr-FR|male',
        femaleVoiceHint: 'sylvie|fr-FR|female',
        ready: [
            "Allez, on tourne la machine, les gars !",
            "Putain, ça va être une soirée de ouf !",
            "Vas-y ma belle, on est chauds !",
            "Les amis, à la vôtre et que ça tourne !",
            "Oh là là, le jackpot nous appelle !",
            "Allez, c'est parti pour la fiesta !",
            "On est là, on est chauds, alors go !",
            "Wesh, la machine est prête, on y va !",
            "Putain, les gars, c'est le moment !",
            "Allez, à la vôtre, on est en mode win !"
        ],
        spinning: [
            'Tourne...',
            'Allez, vas-y !',
            "C'est parti, les gars !",
            "On tient le bon bout !",
            'Elle tourne, elle tourne...'
        ],
        win: [
            "Oh là là ! C'est gagné, les gars !",
            "Putain, c'est de la balle !",
            "Oh oui, oh oui, c'est la win !",
            "Allez, à boire, c'est mérité !",
            "On est trop forts, les gars !",
            "Oh là là, le jackpot ! On fête ça !",
            "Trop bien, les amis, à la vôtre !",
            "Wesh, on a kiffé ! À boire !",
            "Putain de win, les gars !"
        ],
        lose: [
            "Ben ça va, on recommence !",
            "Pas de win, mais on est toujours chauds !",
            "Allez, ne soyez pas tristes !",
            "La roue est taquine, mais on l'aura !",
            "C'est pas grave, on tourne encore !",
            "Les gars, on y croit !"
        ],
        idle: [
            "Allez, la machine tourne pas toute seule, les gars !",
            "On est là ou pas ?",
            "Vas-y, presse le bouton, les amis !",
            "Même le mistral est plus rapide !",
            "Allez, on n'est pas des flemmards !",
            "Putain, à vous de jouer !"
        ],
        spinCommand: ['Allez !', "C'est parti !", 'Vas-y !', "On y va !"],
        start: [
            "Allez, que la soirée commence !",
            "C'est parti pour le jackpot, les gars !",
            "On est chauds, allons-y !",
            "Vas-y, tourne, ma belle !",
            "Wesh, c'est parti !"
        ],
        winChallenge: [
            "Oh là là, c'est gagné ! Ton défi : {{challenge}} — Bois un coup et assume, les gars !",
            "Putain, la machine a parlé ! {{challenge}} — Faut pas avoir peur, vas-y les gars !",
            "C'est la win ! {{challenge}} — Bois ça d'un trait, allez !",
            "Oh oui, oh oui ! {{challenge}} — Montre ce que tu vaux, wesh !",
            "Les amis, {{challenge}} — C'est cadeau, profites-en !",
            "Trop bien les gars, {{challenge}} — Bois ça fièrement !"
        ],
        loseReaction: [
            "Pas de win, mais on reste chauds, les gars ! On recommence !",
            "Ben ça va, la roue est taquine mais on l'aura !",
            "Pas grave, on a toute la soirée pour gagner !",
            "C'est pas une raison pour être tristes ! On tourne encore !",
            "Allez, ne lâchez rien, la prochaine sera la bonne !"
        ]
    },
    {
        id: 'toulousain',
        label: 'Toulousain',
        emoji: '🌹',
        group: 'fr',
        lang: 'fr-FR',
        rate: 1.05,
        malePitch: 0.75,
        femalePitch: 0.88,
        maleVoiceHint: 'paul|fr-FR|male',
        femaleVoiceHint: 'sylvie|fr-FR|female',
        ready: [
            "Allez, on tourne la machine, les amics !",
            "Putain, ça va être une soirée de folie !",
            "Vas-y ma belle, on est chauds !",
            "Los amics, a la vòstra e que ça torne !",
            "Oh là là, lo jackpot nos espèra !",
            "Allez, c'est partit per la fièsta !",
            "Siàs prèst, aqui anam !",
            "La ròda es cargada, que lo benvengut !",
            "Allez, les amics, à la vôstra !",
            "Putain, c'est le moment de win !"
        ],
        spinning: [
            'Torne...',
            'Allez, vas-y !',
            "C'est partit, los amics !",
            "Nos tenim lo bon bòl !",
            'Ella torne, e torne...'
        ],
        win: [
            "Oh là là ! Es guanyat, los amics !",
            "Putain, es de la bola !",
            "Aiò, aiò, es la win !",
            "Alètz, a beure, es meritat !",
            "Siam tròp forts, los amics !",
            "Es òuf, aquel jòc !",
            "Oh là là, lo jackpot ! Celebrem aquò !",
            "Tròp bèn, los amics, a la vòstra !",
            "Aiò, aiò, win !",
            "Es magnifique, los amis !"
        ],
        lose: [
            "Bèn, ça va, tornam començar !",
            "Pas de win, mas sèm totjorn calents !",
            "Alètz, siatz pas trists !",
            "La ròda es tacanha, mas l'aurèm !",
            "Es pas greu, tornam tornar !",
            "Los amics, on y croit !"
        ],
        idle: [
            "Alètz, la maquina torne pas tot sol, los amics !",
            "Sèm aquí o pas ?",
            "Vas-y, quita lo boton !",
            "Même lo vent de Toulouse es mai rapid !",
            "Alètz, sèm pas de mandroses !",
            "Putain, à vous de jouer !"
        ],
        spinCommand: ['Alètz !', "C'est partit !", 'Vas-y !', "Anam !"],
        start: [
            "Alètz, que la serenata començe !",
            "C'est partit per lo jackpot, los amics !",
            "Siam calents, anam !",
            "Vas-y, torne, ma bèla !",
            "Allez, c'est parti, les amics !"
        ],
        winChallenge: [
            "Oh là là, es guanyat ! Tòu desafi : {{challenge}} — Beu un cop e prene lor, los amics !",
            "Putain, la maquina a parlat ! {{challenge}} — Fas pa paur, vas-y !",
            "Es la win ! {{challenge}} — Beu aquò d'un trèch, alètz !",
            "Aiò, aiò ! {{challenge}} — Mòstra çò que vals !",
            "Los amics, {{challenge}} — Es regalat, profita-te'n !",
            "Tròp bèn, {{challenge}} — Beu aquò amb orgulh !"
        ],
        loseReaction: [
            "Pas de win, mas sèm totjorn calents, los amics ! Tornam !",
            "Bèn ça va, la ròda es tacanha mas l'aurèm !",
            "Es pas greu, avèm tota la serenada per ganhar !",
            "Es pas una rason per èsser trists ! Tornam tornar !",
            "Alètz, daissatz pas, la seguenta serà la bona !"
        ]
    },
    {
        id: 'alsacien',
        label: 'Alsacien',
        emoji: '🥨',
        group: 'fr',
        lang: 'fr-FR',
        rate: 0.95,
        malePitch: 0.72,
        femalePitch: 0.88,
        maleVoiceHint: 'paul|fr-FR|male',
        femaleVoiceHint: 'sylvie|fr-FR|female',
        ready: [
            "Howowow, on va faire tourner la machine, les amis !",
            "Ach so, le jackpot nous attend, howowow !",
            "Allez, c'est parti, les gars, howowow !",
            "Howowow, quelle soirée qui s'annonce !",
            "S'guet, la roue est prête, howowow !",
            "Allons-y, on a soif, howowow !",
            "Mais c'est magnifique, ce jeu, howowow !",
            "Howowow, let's go, les amis !",
            "Ach so, les amis, à la vôtre !",
            "Howowow, c'est le moment de win !"
        ],
        spinning: [
            'Tourne...',
            'Allez, vas-y !',
            "Howowow, c'est parti !",
            "On tient le bon bout !",
            'Elle tourne, elle tourne...'
        ],
        win: [
            "Howowow, c'est gagné, ça !",
            "Ach so, quel coup de chance !",
            "Mais c'est magnifique, les amis !",
            "Allez, à boire, c'est mérité !",
            "Le jackpot est alsacien, howowow !",
            "C'est la win, howowow ! Bois un coup !",
            "S'guet, c'est magnifique !",
            "Howowow, quelle victoire !",
            "Ach so, win !",
            "Howowow, les amis, à la vôtre !"
        ],
        lose: [
            "Ach bien, on recommence !",
            "Pas de win, mais on reste là !",
            "Howowow, la prochaine fois !",
            "Allez, ne soyez pas tristes !",
            "C'est pas grave, on a du temps !",
            "Howowow, la roue est taquine !"
        ],
        idle: [
            "Howowow, la machine tourne pas toute seule !",
            "Allez, on est là ou quoi ?",
            "Vas-y, appuie sur le bouton !",
            "Même mon chien tourne plus vite que toi, howowow !",
            "Allez, on n'est pas des légumes !",
            "Howowow, à vous de jouer !"
        ],
        spinCommand: ['Allez !', 'Tourne !', "Vas-y !", "Howowow, c'est parti !"],
        start: [
            "Howowow, que la fête commence !",
            "Allez, c'est parti pour le jackpot !",
            "On est prêts, alors allons-y !",
            "Howowow, quelle soirée en perspective !",
            "Ach so, à la vôtre, les amis !"
        ],
        winChallenge: [
            "Howowow, c'est gagné ! Ton défi : {{challenge}} — Bois un coup et assume, les amis !",
            "Ach so, la machine a parlé ! {{challenge}} — Vas-y, montre ce que tu vaux !",
            "C'est la win, howowow ! {{challenge}} — Bois ça d'un trait !",
            "Mais c'est magnifique ! {{challenge}} — Faut pas avoir peur, howowow !",
            "Howowow, {{challenge}} — C'est cadeau, profites-en !",
            "S'guet, {{challenge}} — Bois ça fièrement, howowow !"
        ],
        loseReaction: [
            "Pas de win, mais on reste là, howowow ! On recommence !",
            "Ach bien, la roue est taquine mais on l'aura !",
            "Pas grave, on a toute la soirée pour gagner !",
            "Howowow, c'est pas une raison pour être tristes !",
            "Allez, la prochaine sera la bonne, les amis !"
        ]
    },
    {
        id: 'andalou',
        label: 'Andalou',
        emoji: '💃',
        group: 'es',
        lang: 'es-ES',
        rate: 0.9,
        malePitch: 0.7,
        femalePitch: 0.88,
        maleVoiceHint: 'male|es-ES',
        femaleVoiceHint: 'female|es-ES',
        ready: [
            "¡Vamos a girar la rueda, amigos!",
            "¡Olé, el jackpot nos espera!",
            "¡Dale, dale, que la noche es joven!",
            "¡Vamos, que la ruleta está caliente!",
            "¡Ay, qué bonito va a ser esto!",
            "¡Venga, que vamos a ganar!",
            "¡La máquina está lista, vamos!",
            "¡Olé, olé, que empiece la fiesta!",
            "¡Ay, qué ganas de jugar, amigos!",
            "¡Vamos a darle con fuerza, andaluces!"
        ],
        spinning: [
            'Girando...',
            '¡Dale fuerte!',
            '¡Vamos, gira!',
            '¡Que va, que va!',
            '¡Ay, qué emoción!'
        ],
        win: [
            "¡Olé! ¡Lo has clavado, amigo!",
            "¡Ay, qué suerte tienes!",
            "¡Eres un campeón! ¡Bebe!",
            "¡Olé, olé, olé! ¡Ganaste!",
            "¡Qué bueno, qué bueno!",
            "¡La ruleta te quiere, amigo!",
            "¡Viva el jackpot!",
            "¡Eso es, amigo, así se hace!",
            "¡Olé, campeón!",
            "¡Qué suertudo estás, amigo!"
        ],
        lose: [
            "¡No pasa nada, amigo! ¡Otra vez!",
            "¡Vamos, que la próxima es la tuya!",
            "¡Ay, qué mala suerte! Pero no te rindas!",
            "¡Sigue intentándolo, campeón!",
            "¡No te preocupes, la noche es joven!",
            "¡A la próxima, andalú!"
        ],
        idle: [
            "¡Vamos, la máquina no gira sola!",
            "¡Ey, que estamos aquí para divertirnos!",
            "¡Dale, no seas tímido!",
            "¡Hasta el toro es más rápido que esto!",
            "¡Vamos, que la cerveza se calienta!",
            "¡Olé, a spinnear, amigo!"
        ],
        spinCommand: ['¡Dale!', '¡Gira!', '¡Vamos!', '¡A por ello!'],
        start: [
            "¡Vamos, que empiece la fiesta!",
            "¡Otra ronda, qué bueno!",
            "¡A jugar, amigos!",
            "¡La ruleta está caliente, vamos!",
            "¡Olé, que empiece el show!"
        ],
        winChallenge: [
            "¡Olé, has ganado! Tu reto: {{challenge}} — Bebe y diviértete, amigo!",
            "¡Ay, qué bueno! La ruleta dice: {{challenge}} — ¡Enséñanos de lo que eres capaz!",
            "¡Eres un campeón! {{challenge}} — No te rajes, amigo!",
            "¡Olé, olé! Tu desafío: {{challenge}} — Bebe como un verdadero andaluz!",
            "¡Qué suerte! {{challenge}} — Aprovéchalo, amigo!",
            "¡Viva! {{challenge}} — Bebe y celebra, ¡olé!"
        ],
        loseReaction: [
            "¡No pasa nada, amigo! La rueda te espera!",
            "¡Ay, mala suerte, pero no te rindas!",
            "No te preocupes, la noche es joven — ¡gira otra vez!",
            "Casi lo tienes, ¡inténtalo de nuevo!",
            "No es el jackpot, pero la fiesta sigue!"
        ]
    },
    {
        id: 'mexicain',
        label: 'Mexicain',
        emoji: '🌮',
        group: 'es',
        lang: 'es-MX',
        rate: 0.9,
        malePitch: 0.7,
        femalePitch: 0.9,
        maleVoiceHint: 'male|es-MX|es-ES',
        femaleVoiceHint: 'female|es-MX|es-ES',
        ready: [
            "¡Órale, vamos a girar la ruleta, compadre!",
            "¡Ándale, el jackpot nos está llamando!",
            "¡Vamos, mi amigo, que la suerte está de nuestro lado!",
            "¡Ay, caray, qué buena onda va a ser esta noche!",
            "¡Órale, que la máquina está bien prendida!",
            "¡Vamos, compadre, a darle con todo!",
            "¡Qué bueno, qué bueno! El juego empieza!",
            "¡Órale, que hoy nos llevamos el premio!",
            "¡Chicos, a la ruleta, vamos!",
            "¡Órale, quédate y apuesta, chicos!"
        ],
        spinning: [
            'Girando...',
            '¡Órale, dale!',
            '¡Ándale, que ruede!',
            '¡Vamos, mi amigo!',
            '¡Ay, qué emoción, compadre!'
        ],
        win: [
            "¡Órale! ¡Le atinaste, compadre!",
            "¡Ay, caray! ¡Qué buena suerte!",
            "¡Eres un campeón, mi amigo! ¡Bebe!",
            "¡Órale, olé! ¡Ganaste, compadre!",
            "¡Qué padre, qué padre!",
            "¡El jackpot es tuyo, mi amigo!",
            "¡Viva México! ¡Y viva tu suerte!",
            "¡Así se hace, compadre!",
            "¡Órale, chicanos!",
            "¡Qué chido, compadre!"
        ],
        lose: [
            "¡No hay problema, compadre! ¡Inténtalo de nuevo!",
            "¡Órale, la próxima te toca a ti!",
            "¡Ay, caray! Pero no te rajes!",
            "¡Sigue intentando, mi amigo!",
            "¡No te preocupes, la noche es joven!",
            "¡A la próxima, órale!"
        ],
        idle: [
            "¡Órale, compadre! La máquina no gira sola!",
            "¡Ey, mi amigo, que aquí estamos para divertirnos!",
            "¡Vamos, no seas tímido, dale!",
            "¡Hasta mi caballo gira más rápido que tú!",
            "¡Órale, que la cerveza se calienta!",
            "¡Chicanos, a spinnear, jóvenes!"
        ],
        spinCommand: ['¡Órale!', '¡Gira!', '¡Vamos!', '¡Ándale!'],
        start: [
            "¡Órale, que empiece la fiesta, compadre!",
            "¡Otra ronda, qué buena onda!",
            "¡A jugar, mis amigos!",
            "¡Vamos, que hoy nos ganamos el premio!",
            "¡Órale, chicanos, a la carga!"
        ],
        winChallenge: [
            "¡Órale, ganaste! Tu reto: {{challenge}} — Bebe y diviértete, compadre!",
            "¡Ay, caray! La ruleta dice: {{challenge}} — ¡Enséñanos de lo que eres capaz!",
            "¡Eres un campeón! {{challenge}} — No te rajes, mi amigo!",
            "¡Órale, olé! Tu desafío: {{challenge}} — Bebe como un verdadero mexicano!",
            "¡Qué padre! {{challenge}} — Aprovéchalo, compadre!",
            "¡Viva! {{challenge}} — Bebe y celebra, ¡órale!"
        ],
        loseReaction: [
            "¡No hay problema, compadre! La ruleta te espera!",
            "¡Órale, mala suerte, pero no te rajes!",
            "No te preocupes, la noche es joven — ¡gira otra vez!",
            "Casi lo tienes, ¡inténtalo de nuevo!",
            "No es el jackpot, pero la fiesta sigue, ¡órale!"
        ]
    },
    {
        id: 'napolitain',
        label: 'Napolitain',
        emoji: '🍕',
        group: 'it',
        lang: 'it-IT',
        rate: 1.1,
        malePitch: 0.8,
        femalePitch: 0.95,
        maleVoiceHint: 'riccardo|male|it-IT',
        femaleVoiceHint: 'sara|female|it-IT',
        ready: [
            "Andiamo a girare la ruota, amico!",
            "Madonna, il jackpot ci aspetta!",
            "Avanti, che la fortuna è con noi!",
            "Mamma mia, che bella serata!",
            "Andiamo, che la macchina è pronta!",
            "Forza, amico, diamici dentro!",
            "Che spettacolo, stasera si vince!",
            "Andiamo, che il jackpot è nostro!",
            "Mama mia, che fortuna!",
            "Andiamo, che viniamo!"
        ],
        spinning: [
            'Girando...',
            'Avanti, dai!',
            'Forza, gira!',
            "Andiamo, amico!",
            'Che emozione!'
        ],
        win: [
            "Madonna! Hai vinto, amico!",
            "Che fortuna, mamma mia!",
            "Sei un campione, bevi pure!",
            "Olè! Hai preso il jackpot!",
            "Che bello, che bello!",
            "Il jackpot è tuo, amico!",
            "Viva la fortuna!",
            "Così si fa, bravissimo!",
            "Mamma mia che win!",
            "Che fortuna, amico mio!"
        ],
        lose: [
            "Non ti preoccupare, amico! Riprova!",
            "Coraggio, la prossima volta è tua!",
            "Sfortuna, ma non mollare!",
            "Dai, riprova, campione!",
            "Non importa, la notte è giovane!",
            "Mamma mia, non mollare!"
        ],
        idle: [
            "Andiamo, amico! La ruota non gira da sola!",
            "Ehi, che siamo qui per divertirci!",
            "Dai, non essere timido, premi il bottone!",
            "Anche il mio cane gira più veloce!",
            "Avanti, la birra si scalda!",
            "Mamma mia, a spinnear!"
        ],
        spinCommand: ['Forza!', 'Gira!', 'Andiamo!', 'Dai!'],
        start: [
            "Forza, che inizi la festa!",
            "Altra partita, che bello!",
            "Andiamo, amici!",
            "La ruota è calda, andiamo!",
            "Viva, che viniamo!"
        ],
        winChallenge: [
            "Madonna, hai vinto! La sfida: {{challenge}} — Bevi e divertiti, amico!",
            "Che fortuna! La ruota ha parlato: {{challenge}} — Fai vedere chi sei!",
            "Sei un campione! {{challenge}} — Non mollare, amico!",
            "Olè! Il tuo compito: {{challenge}} — Bevi come un vero napoletano!",
            "Che bello! {{challenge}} — Goditelo, amico!",
            "Viva! {{challenge}} — Bevi e festeggia, forza!"
        ],
        loseReaction: [
            "Non ti preoccupare, amico! La ruota gira per tutti!",
            "Sfortuna, ma non mollare! Riprova!",
            "Non importa, la notte è giovane — gira ancora!",
            "Ci sei quasi, dai!",
            "Non è il jackpot, ma la festa continua!"
        ]
    }
];

const cowboyProfiles = {};
profileBases.forEach(function (base) {
    [
        ['_m', base.malePitch, base.maleVoiceHint, 'male'],
        ['_f', base.femalePitch, base.femaleVoiceHint, 'female']
    ].forEach(function (variant) {
        var suffix = variant[0];
        var pitch = variant[1];
        var voiceHint = variant[2];
        var gender = variant[3];
        var profile = Object.assign({}, base, {
            id: base.id + suffix,
            label: base.emoji + ' ' + base.label + (gender === 'female' ? ' F' : ' M'),
            pitch: pitch,
            voiceHint: voiceHint,
            gender: gender
        });
        delete profile.malePitch;
        delete profile.femalePitch;
        delete profile.maleVoiceHint;
        delete profile.femaleVoiceHint;
        cowboyProfiles[profile.id] = profile;
    });
});

// Évite de répéter deux fois de suite la même phrase

// Évite de répéter deux fois de suite la même phrase
let lastCowboyPhrase = '';
function pickCowboyPhrase(messageType, profileId) {
    const profile = cowboyProfiles[profileId || selectedCowboyProfile];
    if (!profile) return '';
    const pool = profile[messageType] || [];
    if (!pool.length) return '';
    let phrase = pool[Math.floor(Math.random() * pool.length)];
    let guard = 0;
    while (phrase === lastCowboyPhrase && pool.length > 1 && guard < 10) {
        phrase = pool[Math.floor(Math.random() * pool.length)];
        guard++;
    }
    lastCowboyPhrase = phrase;
    return phrase;
}

// --- Cowboy TTS (Web Speech API) ---

function pickCowboyVoice() {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    const profile = cowboyProfiles[selectedCowboyProfile];
    const targetLang = profile ? profile.lang : 'en-US';
    const hint = profile ? profile.voiceHint : 'david|alex|daniel|mark|james|en-US';

    const sameLang = voices.filter(v => v.lang.startsWith(targetLang.split('-')[0]));
    const pool = sameLang.length ? sameLang : voices;

    const preferred = pool.find(v => new RegExp(hint, 'i').test(v.name));
    if (preferred) return preferred;

    return pool.find(v => v.lang === targetLang) ||
           pool.find(v => /en-US|en-GB|en-AU|fr-FR|es-ES|it-IT/i.test(v.lang)) ||
           pool[0] || null;
}

function speakCowboy(text) {
    if (!cowboyVoiceEnabled || !text || !window.speechSynthesis) return;
    try {
        const profile = cowboyProfiles[selectedCowboyProfile];
        if (!cowboyVoice) cowboyVoice = pickCowboyVoice();
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(String(text));
        utterance.lang = profile ? profile.lang : 'en-US';
        if (cowboyVoice) utterance.voice = cowboyVoice;
        utterance.rate = profile ? profile.rate : 0.88;
        utterance.pitch = profile ? profile.pitch : 0.55;
        utterance.volume = cowboyVolume;
        utterance.onstart = () => { cowboyHasSpoken = true; };
        window.speechSynthesis.speak(utterance);
    } catch (e) { /* TTS indisponible */ }
}

// Les voix se chargent souvent de façon asynchrone : on re-pique la voix
// du cowboy dès qu'elles sont disponibles.
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        cowboyVoice = pickCowboyVoice();
    };
}

function announceCowboy(messageType, customMessage = null, challenge = null) {
    const cowboyText = document.getElementById('cowboyText');
    if (!cowboyVoiceEnabled || !cowboyText) return;
    let message = customMessage || pickCowboyPhrase(messageType, selectedCowboyProfile);
    if (!message) return;
    if (challenge) {
        message = message.replace(/\{\{challenge\}\}/g, challenge);
    }
    cowboyText.textContent = message;
    cowboyText.style.animation = 'none';
    cowboyText.offsetHeight;
    cowboyText.style.animation = 'speechBubblePop 0.5s ease-out';
    speakCowboy(message);
}

function resetIdleWarning() {
    lastActivity = Date.now();
    const idleWarning = document.getElementById('idleWarning');
    if (idleWarning) idleWarning.classList.remove('show');
}

let lastIdleAnnounce = 0;
function checkIdle() {
    const idleTime = Date.now() - lastActivity;
    const idleWarning = document.getElementById('idleWarning');
    if (idleTime > 20000 && !state.spinning) {
        if (idleWarning) {
            idleWarning.textContent = 'Still waiting for a spin, partner...';
            idleWarning.classList.add('show');
        }
        // Une petite phrase variée toutes les 20 secondes maximum
        // (au lieu de répéter "Spin!" en boucle chaque seconde)
        const now = Date.now();
        if (now - lastIdleAnnounce >= 20000) {
            lastIdleAnnounce = now;
            // Alterne entre relances de spin et petites phrases extraverties
            announceCowboy(Math.random() < 0.4 ? 'spinCommand' : 'idle');
        }
    } else if (idleTime <= 20000 && idleWarning && idleWarning.classList.contains('show')) {
        idleWarning.classList.remove('show');
    }
}

function playSound(soundType) {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (soundType === 'spin') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1500, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        } else if (soundType === 'win') {
            const notes = [523, 659, 784, 1047];
            notes.forEach((freq, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g);
                g.connect(ctx.destination);
                o.type = 'sine';
                o.frequency.value = freq;
                g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.15);
                g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.5);
                o.start(ctx.currentTime + i * 0.15);
                o.stop(ctx.currentTime + i * 0.15 + 0.5);
            });
        } else if (soundType === 'lose') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
        }
    } catch (e) {
        console.log('Audio error:', e);
    }
}

const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('result');
const languageSelector = document.getElementById('language');
const langDropdown = document.getElementById('langDropdown');
const langBtn = document.getElementById('langBtn');
const langLabel = document.getElementById('langLabel');
const emojiRainContainer = document.getElementById('emoji-rain-container');
const emojiExplosionContainer = document.getElementById('emoji-explosion-container');
const cowboyMuteBtn = document.getElementById('cowboyMuteBtn');
const cowboyVolumeBtn = document.getElementById('cowboyVolumeBtn');
const cowboyBtn = document.getElementById('cowboyBtn');
const cowboyDropdown = document.getElementById('cowboyDropdown');
const cowboySelect = document.getElementById('cowboySelect');
const restartBtn = document.getElementById('restartBtn');

// Setup panel elements
const setupPanel = document.getElementById('setupPanel');
const gamePanel = document.getElementById('gamePanel');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const playerNameInput = document.getElementById('playerNameInput');
const playerList = document.getElementById('playerList');
const modeBtns = document.querySelectorAll('.mode-btn');
const prevRoundBtn = document.getElementById('prevRoundBtn');
const nextRoundBtn = document.getElementById('nextRoundBtn');
const roundDisplay = document.getElementById('roundDisplay');
const startTimerBtn = document.getElementById('startTimerBtn');
const stopTimerBtn = document.getElementById('stopTimerBtn');
const timerDisplay = document.getElementById('timerDisplay');
const startGameBtn = document.getElementById('startGameBtn');
const backHomeBtn = document.getElementById('backHomeBtn');
const backToHubBtn = document.getElementById('backToHubBtn');
const tooHotBtn = document.getElementById('tooHotBtn');

// Game info display elements
const gameModeDisplay = document.getElementById('gameModeDisplay');
const gameRoundDisplay = document.getElementById('gameRoundDisplay');
const gameTimerDisplay = document.getElementById('gameTimerDisplay');

// Rules modal elements
const rulesBtn = document.getElementById('rulesBtn');
const rulesModal = document.getElementById('rulesModal');
const closeRulesModal = document.getElementById('closeRulesModal');

function updateNeverEverUI() {
    const neverEverPanel = document.getElementById('neverEverPanel');
    if (neverEverPanel) {
        if (state.neverEverMode) {
            neverEverPanel.classList.add('active');
        } else {
            neverEverPanel.classList.remove('active');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('rules.json')
        .then(response => response.json())
        .then(data => {
            state.jackpotRules = data;
            updateLanguage(languageSelector.value);
        })
        .catch(error => {
            console.error('Error loading jackpot rules:', error);
            resultDisplay.textContent = 'Error loading game. Please try again.';
        });

    setupEventListeners();
    updateUI();

    slot1.textContent = '🍺';
    slot2.textContent = '🍺';
    slot3.textContent = '🍺';

    idleCheckInterval = setInterval(checkIdle, 1000);
    announceCowboy('ready');

    if (cowboySelect) {
        cowboySelect.value = selectedCowboyProfile;
    }
    const cowboyLabelEl = document.getElementById('cowboyLabel');
    if (cowboyLabelEl && cowboyProfiles[selectedCowboyProfile]) {
        cowboyLabelEl.textContent = cowboyProfiles[selectedCowboyProfile].label;
    }
    if (cowboyMuteBtn) {
        cowboyMuteBtn.textContent = cowboyVoiceEnabled ? '🔊' : '🔇';
        cowboyMuteBtn.title = cowboyVoiceEnabled ? 'Mute cowboy voice' : 'Unmute cowboy voice';
    }
    updateCowboyVolumeButton();

    const welcomeProfile = cowboyProfiles[selectedCowboyProfile];
    const welcomeSpeech = welcomeProfile ? welcomeProfile.ready[0] : 'Howdy, partner! Press Spin to start!';
    setTimeout(() => {
        if (cowboyHasSpoken) return;
        const unlock = () => {
            if (!cowboyHasSpoken) {
                speakCowboy(welcomeSpeech);
            }
            document.removeEventListener('pointerdown', unlock);
            document.removeEventListener('keydown', unlock);
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('click', unlock);
        };
        document.addEventListener('pointerdown', unlock);
        document.addEventListener('keydown', unlock);
        document.addEventListener('touchstart', unlock);
        document.addEventListener('click', unlock);
    }, 1500);
});

document.addEventListener('click', (e) => {
    if (cowboyDropdown && cowboyBtn && !cowboyBtn.contains(e.target) && !cowboyDropdown.contains(e.target)) {
        cowboyDropdown.classList.remove('open');
    }
    if (langDropdown && langBtn && !langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
        langDropdown.classList.remove('open');
    }
    resetIdleWarning();
});

function setupEventListeners() {
    languageSelector.addEventListener('change', (event) => {
        state.language = event.target.value;
        updateLanguage(state.language);
        langDropdown.classList.remove('open');
        resetIdleWarning();
    });

    langBtn.addEventListener('click', () => {
        langDropdown.classList.toggle('open');
    });

    if (cowboyBtn && cowboySelect) {
        cowboyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cowboyDropdown.classList.toggle('open');
        });
        cowboySelect.addEventListener('change', (event) => {
            selectedCowboyProfile = event.target.value;
            window.cowboyState.selectedProfile = selectedCowboyProfile;
            cowboyDropdown.classList.remove('open');
            cowboyVoice = null;
            const labelEl = document.getElementById('cowboyLabel');
            if (labelEl && cowboyProfiles[selectedCowboyProfile]) {
                labelEl.textContent = cowboyProfiles[selectedCowboyProfile].label;
            }
            resetIdleWarning();
            announceCowboy('ready');
        });
    }

    if (backToHubBtn) {
        backToHubBtn.addEventListener('click', goToHub);
    }

    rulesBtn.addEventListener('click', () => {
        rulesModal.classList.add('open');
    });

    closeRulesModal.addEventListener('click', () => {
        rulesModal.classList.remove('open');
    });

    rulesModal.addEventListener('click', (event) => {
        if (event.target === rulesModal) {
            rulesModal.classList.remove('open');
        }
    });

    addPlayerBtn.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        if (name && !state.players.includes(name)) {
            state.players.push(name);
            playerNameInput.value = '';
            renderPlayers();
            updateUI();
        }
    });

    playerNameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addPlayerBtn.click();
        }
    });

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.mode = btn.dataset.mode;
            updateUI();
        });
    });

    prevRoundBtn.addEventListener('click', () => {
        if (state.round > 1) {
            state.round--;
            roundDisplay.textContent = state.round;
            updateUI();
        }
    });

    nextRoundBtn.addEventListener('click', () => {
        state.round++;
        roundDisplay.textContent = state.round;
        updateUI();
    });

    startTimerBtn.addEventListener('click', startTimer);
    stopTimerBtn.addEventListener('click', stopTimer);
    startGameBtn.addEventListener('click', startGame);
    document.getElementById('backToHubSetupBtn').addEventListener('click', goToHub);
    backHomeBtn.addEventListener('click', goHome);
    spinButton.addEventListener('click', spin);
    tooHotBtn.addEventListener('click', () => {
        state.tooHot = true;
        tooHotBtn.textContent = 'Too Hot!';
        setTimeout(() => {
            state.tooHot = false;
            tooHotBtn.textContent = 'Too Hot';
        }, 2000);
    });

    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
    }

    if (cowboyMuteBtn) {
        cowboyMuteBtn.addEventListener('click', () => {
            cowboyVoiceEnabled = !cowboyVoiceEnabled;
            cowboyMuteBtn.textContent = cowboyVoiceEnabled ? '🔊' : '🔇';
            cowboyMuteBtn.title = cowboyVoiceEnabled ? 'Mute cowboy voice' : 'Unmute cowboy voice';
        });
    }
    if (cowboyVolumeBtn) {
        cowboyVolumeBtn.addEventListener('click', () => {
            const levels = [0.25, 0.5, 0.75, 1.0];
            const labels = ['25%', '50%', '75%', '100%'];
            const icons = ['🔉', '🔉', '🔊', '🔊'];
            const currentIndex = levels.indexOf(cowboyVolume);
            const nextIndex = (currentIndex === -1 ? 3 : (currentIndex + 1) % 4);
            cowboyVolume = levels[nextIndex];
            window.cowboyState.volume = cowboyVolume;
            updateCowboyVolumeButton();
        });
    }
}

function updateCowboyVolumeButton() {
    const pct = Math.round(cowboyVolume * 100);
    const icon = cowboyVolume <= 0.5 ? '🔉' : '🔊';
    if (cowboyVolumeBtn) {
        cowboyVolumeBtn.textContent = icon + pct + '%';
        cowboyVolumeBtn.title = 'Cowboy voice volume: ' + pct + '%. Click to change.';
    }
}

function renderPlayers() {
    playerList.innerHTML = '';
    state.players.forEach((player, index) => {
        const li = document.createElement('li');
        li.className = 'player-item';
        li.innerHTML = `${player} <button class="remove-player-btn" data-index="${index}">&times;</button>`;
        playerList.appendChild(li);
    });

    document.querySelectorAll('.remove-player-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            state.players.splice(index, 1);
            renderPlayers();
            updateUI();
        });
    });
}

function updateLanguage(lang) {
    state.language = lang;
    const titles = {
        en: 'Jackpot Drinking Game',
        fr: 'Jeu à Boire Jackpot',
        es: 'Juego de Beber Jackpot',
        it: 'Gioco a Bere Jackpot'
    };
    const labels = {
        en: 'EN',
        fr: 'FR',
        es: 'ES',
        it: 'IT'
    };
    document.querySelector('h1').textContent = titles[lang] || titles.en;
    if (langLabel) langLabel.textContent = labels[lang] || lang.toUpperCase();
    spinButton.textContent = {
        en: 'Spin',
        fr: 'Lancer',
        es: 'Girar',
        it: 'Gira'
    }[lang] || 'Spin';

    slot1.textContent = langLabelsSlotReset() ? '🍺' : slot1.textContent;
    slot2.textContent = langLabelsSlotReset() ? '🍺' : slot2.textContent;
    slot3.textContent = langLabelsSlotReset() ? '🍺' : slot3.textContent;
}

// Ne réinitialise les rouleaux que sur l'écran de configuration.
// Protège contre le "restart" visuel en pleine partie (ex: chargement
// tardif de rules.json qui rappelle updateLanguage).
function langLabelsSlotReset() {
    return !gamePanel || gamePanel.classList.contains('hidden');
}

function updateUI() {
    gameModeDisplay.textContent = `Mode: ${state.mode.charAt(0).toUpperCase() + state.mode.slice(1)}`;
    gameRoundDisplay.textContent = `Round: ${state.round}`;
    gameTimerDisplay.textContent = formatTime(state.timerSeconds);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function startTimer() {
    if (state.timerRunning) return;
    state.timerRunning = true;
    state.timerInterval = setInterval(() => {
        state.timerSeconds++;
        timerDisplay.textContent = formatTime(state.timerSeconds);
        gameTimerDisplay.textContent = formatTime(state.timerSeconds);
    }, 1000);
}

function stopTimer() {
    state.timerRunning = false;
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}

function goHome() {
    stopTimer();
    state.round = 1;
    roundDisplay.textContent = state.round;
    state.timerSeconds = 0;
    timerDisplay.textContent = '00:00';
    updateUI();
    gamePanel.classList.add('hidden');
    setupPanel.classList.remove('hidden');
}

function goToHub() {
    stopTimer();
    window.location.href = '../index.html';
}

function restartGame() {
    stopTimer();
    if (idleCheckInterval) clearInterval(idleCheckInterval);
    state.players = [];
    state.round = 1;
    state.history = [];
    state.tooHot = false;
    state.spinning = false;
    state.mode = 'classic';
    state.timerSeconds = 0;

    roundDisplay.textContent = state.round;
    timerDisplay.textContent = '00:00';
    gameTimerDisplay.textContent = '00:00';

    modeBtns.forEach(b => b.classList.remove('active'));
    const classicBtn = document.querySelector('.mode-btn[data-mode="classic"]');
    if (classicBtn) classicBtn.classList.add('active');

    renderPlayers();
    updateUI();

    gamePanel.classList.add('hidden');
    setupPanel.classList.remove('hidden');

    resultDisplay.textContent = 'Spin the wheel to start!';
    resultDisplay.style.backgroundColor = '#f9f9f9';
    resultDisplay.style.color = '#555';

    slot1.textContent = '🍺';
    slot2.textContent = '🍺';
    slot3.textContent = '🍺';

    announceCowboy('ready');
    idleCheckInterval = setInterval(checkIdle, 1000);
    resetIdleWarning();
}

function startGame() {
    setupPanel.classList.add('hidden');
    gamePanel.classList.remove('hidden');
    state.round = 1;
    roundDisplay.textContent = state.round;
    updateUI();
    startTimer();
    announceCowboy('start');
    // Un seul intervalle d'idle : on efface l'ancien avant d'en créer un nouveau
    if (idleCheckInterval) clearInterval(idleCheckInterval);
    idleCheckInterval = setInterval(checkIdle, 1000);
    lastIdleAnnounce = Date.now();
    // Switch the music player to the Jackpot track
    if (window.DPMusicPlayer && typeof window.DPMusicPlayer.playTrack === 'function') {
        window.DPMusicPlayer.playTrack('Arcade Fanfare.mp3');
    }
}

function getRandomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

async function spin() {
    if (state.spinning) return;
    state.spinning = true;
    state.tooHot = false;
    resetIdleWarning();
    playSound('spin');
    announceCowboy('spinning');
    spinButton.textContent = state.language === 'fr' ? 'Tourne...' : 'Spinning...';
    resultDisplay.textContent = '';
    resultDisplay.style.backgroundColor = '#f9f9f9';
    resultDisplay.style.color = '#555';

    slot1.classList.add('spinning');
    slot2.classList.add('spinning');
    slot3.classList.add('spinning');

    let spins = 0;
    const maxSpins = 20;
    const intervalTime = 100;

    let finalEmoji1, finalEmoji2, finalEmoji3;

    if (Math.random() < 0.7) {
        const forcedEmoji = getRandomEmoji();
        finalEmoji1 = forcedEmoji;
        finalEmoji2 = forcedEmoji;
        finalEmoji3 = forcedEmoji;
    } else {
        finalEmoji1 = getRandomEmoji();
        finalEmoji2 = getRandomEmoji();
        finalEmoji3 = getRandomEmoji();
    }

    const spinInterval = setInterval(() => {
        slot1.textContent = getRandomEmoji();
        slot2.textContent = getRandomEmoji();
        slot3.textContent = getRandomEmoji();
        spins++;

        if (spins > maxSpins) {
            clearInterval(spinInterval);
            state.spinning = false;
            spinButton.textContent = state.language === 'fr' ? 'Lancer' : 'Spin';
            slot1.classList.remove('spinning');
            slot2.classList.remove('spinning');
            slot3.classList.remove('spinning');

            slot1.textContent = finalEmoji1;
            slot2.textContent = finalEmoji2;
                        slot3.textContent = finalEmoji3;

            checkResult(finalEmoji1, finalEmoji2, finalEmoji3).catch(e => console.error('checkResult error:', e));
            }
    }, intervalTime);
}

async function checkResult(emoji1, emoji2, emoji3) {
    if (emoji1 === emoji2 && emoji2 === emoji3) {
        const jackpotKey = emoji1 + emoji2 + emoji3;
        let challenge = null;
        let source = 'local';

        if (!state.tooHot) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                const response = await fetch('/api/jackpot/challenge', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mode: state.mode,
                        round: state.round,
                        players: state.players,
                        history: state.history,
                        language: state.language,
                        emojiCombo: jackpotKey,
                    }),
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    if (data.source === 'ai' && data.challenge) {
                        challenge = data.challenge;
                        source = 'ai';
                    }
                }
            } catch (error) {
                console.error('AI challenge fetch failed:', error);
            }
        }

        if (!challenge) {
            const rule = state.jackpotRules[jackpotKey]?.[state.language];
            if (rule && rule.questions && rule.questions.length > 0) {
                const randomIndex = Math.floor(Math.random() * rule.questions.length);
                challenge = rule.questions[randomIndex];
                source = 'local';
            } else {
                challenge = state.language === 'fr' ? `Jackpot ! ${jackpotKey} - Bois !` : `Jackpot! ${jackpotKey} - Drink!`;
                source = 'local';
            }
        }

        state.history.push(challenge);
        if (state.history.length > 50) state.history.shift();

        const winningEmoji = emoji1;
        const emojiColor = emojiColors[winningEmoji] || '#f9f9f9';
        resultDisplay.style.backgroundColor = emojiColor;
        resultDisplay.style.color = 'white';

        const sourceLabel = source === 'ai' ? '[AI] ' : '';
        resultDisplay.innerHTML = `${jackpotKey}<br>${sourceLabel}${challenge}`;

        startEmojiRain(winningEmoji, 50);
        triggerEmojiExplosion(winningEmoji);
        playSound('win');
        announceCowboy('winChallenge', null, challenge);

        state.round++;
        roundDisplay.textContent = state.round;
        updateUI();
    } else {
        resultDisplay.style.backgroundColor = '#f9f9f9';
        resultDisplay.style.color = '#555';
        playSound('lose');
        announceCowboy('loseReaction');
        const messages = {
            fr: 'Pas de jackpot. Relance !',
            es: 'No hay jackpot. ¡Gira de nuevo!',
            it: 'Nessun jackpot. Gira di nuovo!',
            en: 'No jackpot. Spin again!'
        };
        resultDisplay.textContent = messages[state.language] || messages.en;
    }
}

function startEmojiRain(emoji, count) {
    if (!emojiRainContainer) return;
    emojiRainContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const emojiElement = document.createElement('div');
        emojiElement.classList.add('falling-emoji');
        emojiElement.textContent = emoji;
        if (window.innerWidth <= 768) {
            const minLeft = 5;
            const maxLeft = 85;
            emojiElement.style.left = `${Math.random() * (maxLeft - minLeft) + minLeft}vw`;
        } else {
            const minLeft = 28;
            const maxLeft = 68;
            emojiElement.style.left = `${Math.random() * (maxLeft - minLeft) + minLeft}vw`;
        }
        emojiElement.style.animationDuration = `${Math.random() * 2 + 3}s`;
        emojiElement.style.animationDelay = `${Math.random() * 0.5}s`;
        emojiRainContainer.appendChild(emojiElement);
        emojiElement.addEventListener('animationend', () => emojiElement.remove());
    }
}

function triggerEmojiExplosion(emoji) {
    if (!emojiExplosionContainer) return;
    emojiExplosionContainer.innerHTML = '';
    const explosionEmoji = document.createElement('div');
    explosionEmoji.classList.add('emoji-explosion');
    explosionEmoji.textContent = emoji;
    explosionEmoji.style.left = '50%';
    explosionEmoji.style.top = '50%';
    emojiExplosionContainer.appendChild(explosionEmoji);
    explosionEmoji.addEventListener('animationend', () => explosionEmoji.remove());
}

'use strict';
var write = document.getElementById('write');
var edit = document.getElementById('edit');
function checkEdit()
{
alert('editFn processing..');
}
function checkWrite()
{
alert('writeFn processing..');

}

var iscore={};
//["lists", "UI", "tooltips", "analytics", "formatting", "parser", "desktop"]
iscore['lists']={}; 
iscore['UI']={}; 
iscore['tooltips']={}; 
iscore['analytics']={}; 
iscore['formatting']={}; 
iscore['parser']={}; 
iscore['desktop']={};

iscore['lists']['simpleAlternativeList'] = { 
    "a number of": 'Many, some',
    abundance: 'Enough, plenty',
    "accede to": 'Allow, agree to',
    accelerate: 'Speed up',
    accentuate: 'Stress',
    accompany: 'Go with, with',
    accomplish: 'Do',
    accorded: 'Given',
    accrue: 'Add, gain',
    acquiesce: 'Agree',
    acquire: 'Get',
    additional: 'More, extra',
    "adjacent to": 'Next to',
    adjustment: 'Change',
    admissible: 'Allowed, accepted',
    advantageous: 'Helpful',
    "adversely impact": 'Hurt',
    advise: 'Tell',
    aforementioned: 'Remove',
    aggregate: 'Total, add',
    aircraft: 'Plane',
    "all of": 'All',
    alleviate: 'Ease, reduce',
    allocate: 'Divide',
    "along the lines of": 'Like, as in',
    "already existing": 'Existing',
    alternatively: 'Or',
    ameliorate: 'Improve, help',
    anticipate: 'Expect',
    apparent: 'Clear, plain',
    appreciable: 'Many',
    "as a means of": 'To',
    "as of yet": 'Yet',
    "as to": 'On, about',
    "as yet": 'Yet',
    ascertain: 'Find out, learn',
    assistance: 'Help',
    "at this time": 'Now',
    attain: 'Meet',
    "attributable to": 'Because',
    authorize: 'Allow, let',
    "because of the fact that": 'Because',
    belated: 'Late',
    "benefit from": 'Enjoy',
    bestow: 'Give, award',
    "by virtue of": 'by, under',
    cease: 'stop',
    "close proximity": 'near',
    commence: 'Begin or start',
    "comply with": 'follow',
    concerning: 'about, on',
    consequently: 'so',
    consolidate: 'join, merge',
    constitutes: 'is, forms, makes up',
    demonstrate: 'prove, show',
    depart: 'leave, go',
    designate: 'choose, name',
    discontinue: 'drop, stop',
    "due to the fact that": 'because, since',
    "each and every": 'Each',
    economical: 'cheap',
    eliminate: 'cut, drop, end',
    elucidate: 'explain',
    employ: 'use',
    endeavor: 'try',
    enumerate: 'count',
    equitable: 'fair',
    equivalent: 'equal',
    evaluate: 'test, check',
    evidenced: 'showed',
    exclusively: 'only',
    expedite: 'hurry',
    expend: 'spend',
    expiration: 'end',
    facilitate: 'ease, help',
    "factual evidence": 'facts, evidence',
    feasible: 'workable',
    finalize: 'complete, finish',
    "first and foremost": 'first',
    "for the purpose of": 'to',
    forfeit: 'lose, give up',
    formulate: 'plan',
    "honest truth": 'truth',
    however: 'but, yet',
    "if and when": 'use either word; not both',
    impacted: 'affected, harmed, changed',
    implement: 'install, put in place; tool',
    "in a timely manner": 'on time',
    "in accordance with": 'by, under',
    "in addition": 'also, besides, too',
    "in all likelihood": 'probably',
    "in an effort to": 'to',
    "in between": 'between',
    "in excess of": 'more than',
    "in lieu of": 'instead',
    "in light of the fact that": 'because',
    "in many cases": 'often',
    "in order to": 'to',
    "in regard to": 'about, concerning, on',
    "in some instances ": 'sometimes',
    "in terms of": 'omit; for, as, with',
    "in the near future": 'soon',
    "in the process of": 'omit',
    inception: 'start',
    "incumbent upon": 'must',
    indicate: 'say, state, or show',
    indication: 'sign',
    initiate: 'start',
    "is applicable to": 'applies to',
    "is authorized to": 'may',
    "is responsible for": 'handles',
    "it is essential": 'must, need to',
    literally: 'omit',
    magnitude: 'size',
    maximum: 'greatest, largest, most',
    methodology: 'method',
    minimize: 'cut',
    minimum: 'least, smallest, small',
    modify: 'change',
    monitor: 'check, watch, track',
    multiple: 'many',
    necessitate: 'cause, need',
    nevertheless: 'still, besides, even so',
    "not certain": 'uncertain',
    "not many": 'few',
    "not often": 'rarely',
    "not unless": 'only if',
    "not unlike": 'similar, alike',
    notwithstanding: 'in spite of, still',
    "null and void": 'use either null or void',
    numerous: 'many',
    objective: 'aim, goal',
    obligate: 'bind, compel',
    obtain: 'get',
    "on the contrary": 'but, so',
    "on the other hand": 'omit; but, so',
    "one particular": 'one',
    optimum: 'best, greatest, most',
    overall: 'omit',
    "owing to the fact that": 'because, since',
    participate: 'take part',
    particulars: 'details',
    "pass away": 'die',
    "pertaining to": 'about, of, on',
    "point in time": 'time, point, moment, now',
    portion: 'part',
    possess: 'have, own',
    preclude: 'prevent',
    previously: 'before',
    "prior to": 'before',
    prioritize: 'rank, focus on',
    procure: 'buy, get',
    proficiency: 'skill',
    "provided that": 'if',
    purchase: 'buy, sale',
    "put simply": 'omit',
    "readily apparent": 'clear',
    "refer back": 'refer',
    regarding: 'about, of, on',
    relocate: 'move',
    remainder: 'rest',
    remuneration: 'payment',
    require: 'must, need',
    requirement: 'need, rule',
    reside: 'live',
    residence: 'house',
    retain: 'keep',
    satisfy: 'meet, please',
    shall: 'must, will',
    "should you wish": 'if you want',
    "similar to": 'like',
    solicit: 'ask for, request',
    "span across": 'span, cross',
    strategize: 'plan',
    subsequent: 'later, next, after, then',
    substantial: 'large, much',
    "successfully complete": 'complete, pass',
    sufficient: 'enough',
    terminate: 'end, stop',
    "the month of": 'omit',
    therefore: 'thus, so',
    "this day and age": 'today',
    "time period": 'time, period',
    "took advantage of": 'preyed on',
    transmit: 'send',
    transpire: 'happen',
    "until such time as": 'until',
    utilization: 'use',
    utilize: 'use',
    validate: 'confirm',
    "various different": 'various, different',
    very: 'omit',
    "whether or not": 'whether',
    "with respect to": 'on, about',
    "with the exception of": 'except for',
    witnessed: 'saw, seen'
}

iscore['lists']['passiveList'] = [{
    orig: 'awoken',
    replace: 'awoke'
}, {
    orig: 'beaten',
    replace: 'beat'
}, {
    orig: 'begun',
    replace: 'began'
}, {
    orig: 'bent',
    replace: 'bent'
}, {
    orig: 'bitten',
    replace: 'bit'
}, {
    orig: 'bled',
    replace: 'bled'
}, {
    orig: 'blown',
    replace: 'blew'
}, {
    orig: 'broken',
    replace: 'broke'
}, {
    orig: 'brought',
    replace: 'brought'
}, {
    orig: 'built',
    replace: 'built'
}, {
    orig: 'bought',
    replace: 'bought'
}, {
    orig: 'caught',
    replace: 'caught'
}, {
    orig: 'chosen',
    replace: 'chose'
}, {
    orig: 'cut',
    replace: 'cut'
}, {
    orig: 'dealt',
    replace: 'dealt'
}, {
    orig: 'done',
    replace: 'did'
}, {
    orig: 'drawn',
    replace: 'drew'
}, {
    orig: 'driven',
    replace: 'drove'
}, {
    orig: 'eaten',
    replace: 'ate'
}, {
    orig: 'fed',
    replace: 'fed'
}, {
    orig: 'felt',
    replace: 'felt'
}, {
    orig: 'fought',
    replace: 'fought'
}, {
    orig: 'found',
    replace: 'found'
}, {
    orig: 'forbidden',
    replace: 'forbade'
}, {
    orig: 'forgotten',
    replace: 'forgot'
}, {
    orig: 'forgiven',
    replace: 'forgave'
}, {
    orig: 'frozen',
    replace: 'froze'
}, {
    orig: 'gotten',
    replace: 'got'
}, {
    orig: 'given',
    replace: 'gave'
}, {
    orig: 'ground',
    replace: 'ground'
}, {
    orig: 'ground',
    replace: 'ground, grinded'
}, {
    orig: 'hung',
    replace: 'hung'
}, {
    orig: 'heard',
    replace: 'heard'
}, {
    orig: 'hidden',
    replace: 'hid'
}, {
    orig: 'hit',
    replace: 'hit'
}, {
    orig: 'held',
    replace: 'held'
}, {
    orig: 'hurt',
    replace: 'hurt'
}, {
    orig: 'kept',
    replace: 'kept'
}, {
    orig: 'known',
    replace: 'knew'
}, {
    orig: 'laid',
    replace: 'laid'
}, {
    orig: 'led',
    replace: 'led'
}, {
    orig: 'left',
    replace: 'left'
}, {
    orig: 'let',
    replace: 'let'
}, {
    orig: 'lost',
    replace: 'lost'
}, {
    orig: 'made',
    replace: 'made'
}, {
    orig: 'meant',
    replace: 'meant'
}, {
    orig: 'met',
    replace: 'met'
}, {
    orig: 'paid',
    replace: 'paid'
}, {
    orig: 'proven',
    replace: 'proved'
}, {
    orig: 'put',
    replace: 'put'
}, {
    orig: 'read',
    replace: 'read'
}, {
    orig: 'ridden',
    replace: 'rode'
}, {
    orig: 'rung',
    replace: 'rang'
}, {
    orig: 'run',
    replace: 'ran'
}, {
    orig: 'said',
    replace: 'said'
}, {
    orig: 'seen',
    replace: 'saw'
}, {
    orig: 'sold',
    replace: 'sold'
}, {
    orig: 'sent',
    replace: 'sent'
}, {
    orig: 'shaken',
    replace: 'shook'
}, {
    orig: 'shaved',
    replace: 'shaved'
}, {
    orig: 'shot',
    replace: 'shot'
}, {
    orig: 'shown',
    replace: 'showed'
}, {
    orig: 'shut',
    replace: 'shut'
}, {
    orig: 'sung',
    replace: 'sung'
}, {
    orig: 'sunk',
    replace: 'sunk'
}, {
    orig: 'slain',
    replace: 'slew'
}, {
    orig: 'slid',
    replace: 'slid'
}, {
    orig: 'spoken',
    replace: 'spoke'
}, {
    orig: 'spent',
    replace: 'spent'
}, {
    orig: 'spun',
    replace: 'spun'
}, {
    orig: 'split',
    replace: 'split'
}, {
    orig: 'spread',
    replace: 'spread'
}, {
    orig: 'stolen',
    replace: 'stole'
}, {
    orig: 'struck',
    replace: 'struck'
}, {
    orig: 'swept',
    replace: 'swept'
}, {
    orig: 'swung',
    replace: 'swung'
}, {
    orig: 'taken',
    replace: 'took'
}, {
    orig: 'taught',
    replace: 'taught'
}, {
    orig: 'torn',
    replace: 'tore'
}, {
    orig: 'told',
    replace: 'told'
}, {
    orig: 'thought',
    replace: 'thought'
}, {
    orig: 'thrown',
    replace: 'threw'
}, {
    orig: 'undergone',
    replace: 'underwent'
}, {
    orig: 'understood',
    replace: 'understood'
}, {
    orig: 'upset',
    replace: 'upset'
}, {
    orig: 'woken',
    replace: 'woke'
}, {
    orig: 'worn',
    replace: 'wore'
}, {
    orig: 'won',
    replace: 'won'
}, {
    orig: 'withdrawn',
    replace: 'withdrew'
}, {
    orig: 'written',
    replace: 'wrote'
}];

iscore['lists']['notAdverbList'] = ['actually', 'additionally', 'allegedly', 'ally', 'alternatively', 'anomaly', 'apply', 'approximately', 'ashely', 'ashly', 'assembly', 'awfully', 'baily', 'belly', 'bely', 'billy', 'bradly', 'bristly', 'bubbly', 'bully', 'burly', 'butterfly', 'carly', 'charly', 'chilly', 'comely', 'completely', 'comply', 'consequently', 'costly', 'courtly', 'crinkly', 'crumbly', 'cuddly', 'curly', 'currently', 'daily', 'dastardly', 'deadly', 'deathly', 'definitely', 'dilly', 'disorderly', 'doily', 'dolly', 'dolly', 'dragonfly', 'early', 'elderly', 'elly', 'emily', 'especially', 'exactly', 'exclusively', 'family', 'finally', 'firefly', 'folly', 'friendly', 'frilly', 'gadfly', 'gangly', 'generally', 'ghastly', 'giggly', 'globally', 'goodly', 'gravelly', 'grisly', 'gully', 'haily', 'hally', 'harly', 'hardly', 'heavenly', 'hillbilly', 'hilly', 'holly', 'holy', 'homely', 'homily', 'horsefly', 'hourly', 'immediately', 'instinctively', 'imply', 'italy', 'jelly', 'jiggly', 'jilly', 'jolly', 'july', 'karly', 'karly', 'kelly', 'kindly', 'lately', 'likely', 'lilly', 'lily', 'lily', 'lively', 'lolly', 'lonely', 'lovely', 'lowly', 'luckily', 'mealy', 'measly', 'melancholy', 'mentally', 'molly', 'molly', 'monopoly', 'monthly', 'multiply', 'nightly', 'oily', 'only', 'orderly', 'panoply', 'particularly', 'partly', 'paully', 'pearly', 'pebbly', 'polly', 'potbelly', 'presumably', 'previously', 'pualy', 'quarterly', 'rally', 'rarely', 'recently', 'rely', 'reply', 'reportedly', 'roughly', 'sally', 'scaly', 'shapely', 'shelly', 'shirly', 'shortly', 'sickly', 'silly', 'smelly', 'sparkly', 'spindly', 'spritely', 'squiggly', 'stately', 'steely', 'supply', 'surly', 'tally', 'tally', 'timely', 'trolly', 'ugly', 'underbelly', 'unfortunately', 'unlikely', 'usually', 'waverly', 'weekly', 'wholly', 'willy', 'wily', 'wobbly', 'wooly', 'worldly', 'wrinkly', 'yearly'];


var alt =[];

for(var i=0; i<Object.keys(iscore.lists.simpleAlternativeList).length; i++)
    {
       alt[i] = Object.keys(iscore.lists.simpleAlternativeList)[i]; 
    }


var hard     = document.getElementById('hard');
var veryhard = document.getElementById('veryhard');
var passive  = document.getElementById('passive');
var altr      = document.getElementById('altr');
var adv      = document.getElementById('adv');


var simple = 0, a;

function suggestions()
{
 simple=0; 
    for(var i=0;i<alt.length; i++)
    {
      var  a = alt[i];
           a = new RegExp(a,"g");
     if(idata.value.match(a)!=null)
     {
      simple = idata.value.match(a).length + simple;
      console.log(simple+' '+alt[i]+'-'+iscore.lists.simpleAlternativeList[alt[i]]);
         
      //idata.value = idata.value.replace(alt[i],iscore.lists.simpleAlternativeList[alt[i]]);     
    }
  }
    altr.innerText = simple;
}

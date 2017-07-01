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
var altr     = document.getElementById('altr');
var adv      = document.getElementById('adv');
var idata    = document.querySelector('.public-DraftEditor-content');


//----------------------------------------------------[Simple Alternatives]----------------------------------------------------------||
var simple, simCount, simAlt, another, anotherAlt;
function suggestions()
{
 simple = [], simAlt=[], simCount = 0; 
    another = [], anotherAlt = [];
    
    for(var i=0; i<alt.length; i++)
    {
      var  a = alt[i];
           a = new RegExp(a,"g");
     if(idata.innerText.match(a)!=null)
     {
       simCount = idata.innerText.match(a).length + simCount;
       //console.log(simple+' '+alt[i]+' - '+iscore.lists.simpleAlternativeList[alt[i]]);
       simple.push(alt[i]);
       simAlt.push(''+iscore.lists.simpleAlternativeList[alt[i]]);     
       //idata.innerText = idata.innerText.replace(alt[i],iscore.lists.simpleAlternativeList[alt[i]]);     
     }
    }
    
    
    another = idata.innerText.match(/(-)?\b(a number of|abundance|accede to|accelerate|accentuate|accompany|accomplish|accorded|accrue|acquiesce|acquire|additional|adjacent to|adjustment|admissible|advantageous|adversely impact|advise|aforementioned|aggregate|aircraft|all of|alleviate|allocate|along the lines of|already existing|alternatively|ameliorate|anticipate|apparent|appreciable|as a means of|as of yet|as to|as yet|ascertain|assistance|at this time|attain|attributable to|authorize|because of the fact that|belated|benefit from|bestow|by virtue of|cease|close proximity|commence|comply with|concerning|consequently|consolidate|constitutes|demonstrate|depart|designate|discontinue|due to the fact that|each and every|economical|eliminate|elucidate|employ|endeavor|enumerate|equitable|equivalent|evaluate|evidenced|exclusively|expedite|expend|expiration|facilitate|factual evidence|feasible|finalize|first and foremost|for the purpose of|forfeit|formulate|honest truth|however|if and when|impacted|implement|in a timely manner|in accordance with|in addition|in all likelihood|in an effort to|in between|in excess of|in lieu of|in light of the fact that|in many cases|in order to|in regard to|in some instances |in terms of|in the near future|in the process of|inception|incumbent upon|indicate|indication|initiate|is applicable to|is authorized to|is responsible for|it is essential|literally|magnitude|maximum|methodology|minimize|minimum|modify|monitor|multiple|necessitate|nevertheless|not certain|not many|not often|not unless|not unlike|notwithstanding|null and void|numerous|objective|obligate|obtain|on the contrary|on the other hand|one particular|optimum|overall|owing to the fact that|participate|particulars|pass away|pertaining to|point in time|portion|possess|preclude|previously|prior to|prioritize|procure|proficiency|provided that|purchase|put simply|readily apparent|refer back|regarding|relocate|remainder|remuneration|require|requirement|reside|residence|retain|satisfy|shall|should you wish|similar to|solicit|span across|strategize|subsequent|substantial|successfully complete|sufficient|terminate|the month of|therefore|this day and age|time period|took advantage of|transmit|transpire|until such time as|utilization|utilize|validate|various different|very|whether or not|with respect to|with the exception of|witnessed)\b/gi);
    
     if(another!=null)
     {
         for(var j=0; j<another.length;j++)
             {
                 anotherAlt.push(''+iscore.lists.simpleAlternativeList[another[j]]);
             }
     }
    
    if(another!=null) { altr.innerText = another.length}
       else
            {  altr.innerText = 0; }
    
    
    //altr.innerText = simCount;
    console.log(simple);
    console.log(simAlt);
    console.log(another);
    console.log(anotherAlt);
}
//--------------------------------------------------------------------------------------------------------------||


//-----------------------------------------------------[Adverbs]---------------------------------------------------------||
var adverb = 0, advb;
function adverbs()
{
 adverb = idata.innerText.match(/\S+ly\b/g);
 advb = idata.innerText.match(/(-)?\b(actuall|additionall|allegedl|all|alternativel|anomal|appl|approximatel|ashel|ashl|assembl|awfull|bail|bell|bel|bill|bradl|bristl|bubbl|bull|burl|butterfl|carl|charl|chill|comel|completel|compl|consequentl|costl|courtl|crinkl|crumbl|cuddl|curl|currentl|dail|dastardl|deadl|deathl|definitel|dill|disorderl|doil|doll|doll|dragonfl|earl|elderl|ell|emil|especiall|exactl|exclusivel|famil|finall|firefl|foll|friendl|frill|gadfl|gangl|generall|ghastl|giggl|globall|goodl|gravell|grisl|gull|hail|hall|harl|hardl|heavenl|hillbill|hill|holl|hol|homel|homil|horsefl|hourl|immediatel|instinctivel|impl|ital|jell|jiggl|jill|joll|jul|karl|karl|kell|kindl|latel|likel|lill|lil|lil|livel|loll|lonel|lovel|lowl|luckil|meal|measl|melanchol|mentall|moll|moll|monopol|monthl|multipl|nightl|oil|onl|orderl|panopl|particularl|partl|paull|pearl|pebbl|poll|potbell|presumabl|previousl|pual|quarterl|rall|rarel|recentl|rel|repl|reportedl|roughl|sall|scal|shapel|shell|shirl|shortl|sickl|sill|smell|sparkl|spindl|spritel|squiggl|statel|steel|suppl|surl|tall|tall|timel|troll|ugl|underbell|unfortunatel|unlikel|usuall|waverl|weekl|wholl|will|wil|wobbl|wool|worldl|wrinkl|yearl)y\b/gi);
   if(adverb!=null)
       {
         if(advb!=null)
         {
            for(var i=0; i<adverb.length; i++)
            {
             for(var j=0; j<advb.length; j++)
                { 
                    if(i!= adverb.length){ //this condition is used-to avoid match undefined error.
                    if(adverb[i].match(/\w+/g) == advb[j])
                        {
                            adverb.splice(i,1);
                            //console.log(i);
                            //console.log(adverb.length);
                        }
                    }
                }
             }

        }
     }
     if(adverb!=null)
     {
        for(var k=0; k<adverb.length; k++)
        {
            adverb[k]=''+adverb[k].match(/\w+/g);
            adv.innerText = adverb.length;
        }
     
     }   
    
        console.log(adverb);
        
        //adverb = idata.innerText.match(/\S+ly\b/g).length;
}
//--------------------------------------------------------------------------------------------------------------||


//-------------------------------------------------[Passive Voice]-------------------------------------------------------------||
var passi;
function passivefn()
{
    passi = idata.innerText.match(/\b(is|are|was|were|be|been|being)(\s)(([a-z]+ed)|awoken|beaten|begun|bent|bitten|bled|blown|broken|brought|built|bought|caught|chosen|cut|dealt|done|drawn|driven|eaten|fed|felt|fought|found|forbidden|forgotten|forgiven|frozen|gotten|given|ground|ground|hung|heard|hidden|hit|held|hurt|kept|known|laid|led|left|let|lost|made|meant|met|paid|proven|put|read|ridden|rung|run|said|seen|sold|sent|shaken|shaved|shot|shown|shut|sung|sunk|slain|slid|spoken|spent|spun|split|spread|stolen|struck|swept|swung|taken|taught|torn|told|thought|thrown|undergone|understood|upset|woken|worn|won|withdrawn|written)(\sby)?\b/gi
);
    if(passi!=null){  passive.innerText = passi.length;  }
       else
            {  passive.innerText = 0;  }
    
    console.log(passi);
}
//--------------------------------------------------------------------------------------------------------------||



//-------------------------------------------Highlight Method -I--------------------------------------------------||
function highlightPassive(text)
{
    var inputText = document.querySelector(".DraftEditor-root")
    var innerHTML = inputText.innerHTML
    var index = innerHTML.indexOf(text);
    
    var str = idata.innerText;
    var regex = '('+text+')', result, indices = [];
    regex = new RegExp(regex,'gi');
    while ( (result = regex.exec(str)) ) {
        indices.push(result.index);
    }
    
    if ( index >= 0 )
    { 
        innerHTML = innerHTML.substring(0,index) + "<span class='passive'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML; 
        }
    console.log(indices);   
}

function highlightAdverb(text)
{
    var inputText = document.querySelector(".DraftEditor-root")
    var innerHTML = inputText.innerHTML
    var index = innerHTML.indexOf(text);
    
    var str = idata.innerText;
    var regex = '('+text+')', result, indices = [];
    regex = new RegExp(regex,'gi');
    while ( (result = regex.exec(str)) ) {
        indices.push(result.index);
    }
    
    if ( index >= 0 )
    { 
        innerHTML = innerHTML.substring(0,index) + "<span class='adverb'>" +  innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML; 
    }
}

function highlightSimple(text)
{
    var inputText = document.querySelector(".DraftEditor-root")
    var innerHTML = inputText.innerHTML
    var index = innerHTML.indexOf(text);
    
    var str = idata.innerText;
    var regex = '('+text+')', result, indices = [];
    regex = new RegExp(regex,'gi');
    while ( (result = regex.exec(str)) ) {
        indices.push(result.index);
    }
    
   if ( index >= 0 )
    { 
        innerHTML = innerHTML.substring(0,index) + "<span class='simple'>" +  innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML; 
    }
     
}

//---------------------------------------------------------------------------------------------------------------------------||


//-------------------------------------------------Highlight Method-II----------------------------------------------------------||
function highlightSimpleSearch(tryText) {
    var query = new RegExp("(\\b" + tryText + "\\b)", "gim");
    var e = document.querySelector(".DraftEditor-root").innerHTML;
    //var enew = e.replace(/(<span>|<\/span>)/igm, "");
    //document.querySelector(".DraftEditor-root").innerHTML = enew;
    var newe;
    
    if(tryText == 'very')
        {
          newe = e.replace(query, "<span class='simple' title='REMOVE'>$1</span>");
        }else{
          var title = iscore.lists.simpleAlternativeList[tryText].replace(/, /g,'/');
          newe = e.replace(query, "<span class='simple' title="+ title +">$1</span>");
        }
        document.querySelector(".DraftEditor-root").innerHTML = newe;

}

function highlightAdverbSearch(tryText) {
    var query = new RegExp("(\\b" + tryText + "\\b)", "gim");
    var e = document.querySelector(".DraftEditor-root").innerHTML;
    //var enew = e.replace(/(<span>|<\/span>)/igm, "");
    //document.querySelector(".DraftEditor-root").innerHTML = enew;
    var newe = e.replace(query, "<span class='adverb'>$1</span>");
    document.querySelector(".DraftEditor-root").innerHTML = newe;

}

function highlightPassiveSearch(tryText) {
    var query = new RegExp("(\\b" + tryText + "\\b)", "gim");
    var e = document.querySelector(".DraftEditor-root").innerHTML;
    //var enew = e.replace(/(<span>|<\/span>)/igm, "");
    //document.querySelector(".DraftEditor-root").innerHTML = enew;
    var newe = e.replace(query, "<span class='passive'>$1</span>");
    document.querySelector(".DraftEditor-root").innerHTML = newe;

}
//-------------------------------------------------------------------------------------------------------------||

function marker()
{ 
  var i;
    if(simple!=null)
        {
            for(i=0;i<simple.length;i++)
            { //highlightSimple(another[i]);   
             highlightSimpleSearch(simple[i]); }
        }
    if(adverb!=null)
        {
            for(i=0;i<adverb.length;i++)
            { //highlightAdverb(adverb[i]);
              highlightAdverbSearch(adverb[i]); }
        }
    if(passi!=null)
        {
             for(i=0;i<passi.length;i++)
             { //highlightPassive(passi[i]);
             highlightPassiveSearch(passi[i]); }   
        }     
}



//--------------------------------------------------------------------------------------------------------------||
function updateSuggestions()
{
    suggestions();
    adverbs();
    passivefn();
    count.alternative = another;
    count.alternativeWord = anotherAlt;
    count.adverb = adverb;
    count.passive = passi;
    marker();
    //console.log(count);
}
//--------------------------------------------------------------------------------------------------------------||






















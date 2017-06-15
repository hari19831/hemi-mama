var idata = document.getElementById('idata');
var grade = document.getElementById('grade');
var para  = document.getElementById('para');
var sentence = document.getElementById('sentence');
var allCharac = document.getElementById('allCharac');
var charac = document.getElementById('charac');
var words = document.getElementById('words');
var letters = document.getElementById('letters');
var readTime = document.getElementById('readTime');

var count,igrade;

function stats()
{
    Countable.once(idata, function (counter) {
         //console.log(this, counter);
         count = counter;
        
         count.sentences = idata.value.split(/[.|!|?]\s/gi).length;//no.of.sentences
         count.letters   = idata.value.replace(/[^A-Z]/gi, "").length;//no.of.letters
         count.readTime  = Math.round(count.words/4.3);
         
         sentence.innerText  = count.sentences; 
         allCharac.innerText = count.all;
         charac.innerText    = count.characters;
         words.innerText     = count.words;
         letters.innerText   = count.letters
         readTime.innerText  = count.readTime;
         para.innerText      = count.paragraphs;    
        
         if(count.words>10)
         {
           igrade = Math.abs(Math.round(4.71*(count.letters/count.words)+0.5*(count.words/count.sentences)-21.43));
           grade.innerText = igrade;
         }
         else
         {
             igrade = 'Not Enough Text';
             grade.innerText = igrade
         }
         
         //console.log(count);
         //console.log(igrade);
    });
}
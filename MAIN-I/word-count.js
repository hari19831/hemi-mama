var idata = document.querySelector('.public-DraftEditor-content');
var grade = document.getElementById('grade');
var para  = document.getElementById('para');
var sentence  = document.getElementById('sentence');
var allCharac = document.getElementById('allCharac');
var charac = document.getElementById('charac');
var words  = document.getElementById('words');
var letters  = document.getElementById('letters');
var readTime = document.getElementById('readTime');

var count,igrade;

function stats()
{
    Countable.live(idata, function (counter) {
         //console.log(this, counter);
         count = counter;
         console.log(counter);
         //count.sentences = idata.innerText.split(/[.|!|?]\s/gi).length;//no.of.sentences
         count.sentences = idata.innerText.split(/\s+[^.!?]*[.!?]/).length;//no.of.sentences
         count.letters   = idata.innerText.replace(/[^A-Z]/gi, "").length;//no.of.letters
         count.readTime  = Math.ceil(count.words/4.3);
         readTime.innerText = count.readTime+'s';
         
         if(count.readTime > 60 || count.readTime == 60)
         {
             readTime.innerText = count.readTime/60+'m';
             
             if(count.readTime%60!==0)
             {
               readTime.innerText = Math.floor(count.readTime/60)+'m'+':'+(count.readTime%60)+'s';    
             }
         } 
        else if(count.readTime > 1200 || count.readTime == 1200)
            {
             readTime.innerText = count.readTime/1200+'h';
             
             if(count.readTime%1200!==0)
             {
               readTime.innerText = Math.floor(count.readTime/1200)+'h'+':'+(count.readTime%1200)+'m';    
             }
   
            }
        
         sentence.innerText  = count.sentences; 
         allCharac.innerText = count.all;
         charac.innerText    = count.characters;
         words.innerText     = count.words;
         letters.innerText   = count.letters
         //readTime.innerText  = count.readTime;
         para.innerText      = count.paragraphs;    
        
         if(count.words>10)
         {
           igrade = Math.abs(Math.ceil(4.71*(count.letters/count.words)+0.5*(count.words/count.sentences)-21.43));
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
    updateSuggestions(); // updates Suggestion ScoreCard...
}
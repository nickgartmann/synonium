function renderWordListToElement(element, words) {
  element.innerHTML = _.map(words || [], function(word) {
    return "<li>" + word + "</li>";
  }).join("\n"); 
}

function findSynonymsForSingle(word){
  var p = new promise.Promise();
  promise.get("https://wordsapiv1.p.mashape.com/words/" + word + "/synonyms", null, {
    'X-Mashape-Key': 'nDCTlklHHGmshYT0XSVDPZq6yiNyp1NfjmRjsnE90WIuXcOkqG',
    'Accept': 'application/json'
  }).then(function(error, response) {
    if(error) {
      p.done([]);
    } else {
      p.done(JSON.parse(response)['synonyms']);
    }
  });
  return p;
}

function findSynonymsFor(words) {
  var p = new promise.Promise();
  promise.join(_.map(words, findSynonymsForSingle)).then(function(results) {
    p.done(_.intersection.apply(this, _.flatten(results, true)));
  });
  return p;
}

function applyOnClick(elements, callback) {
  _.each(elements, function(element) {
    element.addEventListener('click', function() {
      callback.apply(element,[element.innerText]); });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var formElement  = document.getElementById('search');
  var inputElement = document.getElementById('word-search');
  var currentWordsList = document.getElementById('current-words');
  var currentSynonymsList = document.getElementById('current-synonyms');

  var currentWords = [];

  function renderWords() {
    renderWordListToElement(currentWordsList, currentWords);
    findSynonymsFor(currentWords).then(function(synonyms) {
      renderWordListToElement(currentSynonymsList, synonyms);

      if(synonyms.length === 0 && currentWords.length !== 0) {
        currentSynonymsList.innerHTML = "No synonyms found.";
      }

      applyOnClick(currentWordsList.children, function(text) {
        currentWords = _.without(currentWords, text);
        renderWords();
      });

      applyOnClick(currentSynonymsList.children, function(text) {
        currentWords.push(text);
        renderWords();
      });
    });
  }

  formElement.addEventListener('submit', function(event) {
    event.preventDefault();
    var value = inputElement.value;
    currentWords.push(value.replace(/\s/g,''));
    renderWords(); 
    inputElement.value = "";
    return false;
  });

});

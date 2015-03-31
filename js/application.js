var THESAURUS_URL = 'thesaurus.json';

function loadThesaurus(callback) {
  // Raw JS request borrowed from:
  // http://code.tutsplus.com/articles/how-to-make-ajax-requests-with-raw-javascript--net-4855
  var xhr;
  if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
  else {
    var versions = [
      "MSXML2.XmlHttp.5.0", 
      "MSXML2.XmlHttp.4.0",
      "MSXML2.XmlHttp.3.0", 
      "MSXML2.XmlHttp.2.0",
      "Microsoft.XmlHttp"
    ];

    for(var i = 0, len = versions.length; i < len; i++) {
      try {
        xhr = new ActiveXObject(versions[i]);
        break;
      }
      catch(e){}
    } 
  }

  xhr.onreadystatechange = ensureReadiness;

  function ensureReadiness() {
    if(xhr.readyState < 4) {
      return;
    }
    if(xhr.status !== 200) {
      return;
    }
    if(xhr.readyState === 4) {
      callback(JSON.parse(xhr.responseText));
    }
  }

  xhr.open('GET', THESAURUS_URL, true);
  xhr.send('');
}

function renderWordListToElement(element, words) {
  element.innerHTML = _.map(words || [], function(word) {
    return "<li>" + word + "</li>";
  }).join("\n"); 
}

function findSynonymsFor(words, thesaurus) {
  var synonyms = _.map(words,function(word) {
    return thesaurus[word];
  });
  return _.intersection.apply(this, synonyms);
}

function applyOnClick(elements, callback) {
  _.each(elements, function(element) {
    element.addEventListener('click', function() {
      callback.apply(element,[element.innerText]); });
  });
}

var thesaurus = null;
loadThesaurus(function(th) {
  thesaurus = th;
});

document.addEventListener('DOMContentLoaded', function() {
  var formElement  = document.getElementById('search');
  var inputElement = document.getElementById('word-search');
  var currentWordsList = document.getElementById('current-words');
  var currentSynonymsList = document.getElementById('current-synonyms');

  var currentWords = [];

  function renderWords() {
    renderWordListToElement(currentWordsList, currentWords);
    var synonyms = findSynonymsFor(currentWords, thesaurus);
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
 }

  search.addEventListener('submit', function(event) {
    event.preventDefault();
    var value = inputElement.value;
    currentWords.push(value.replace(/\s/g,''));
    renderWords(); 
    inputElement.value = "";
    return false;
  });

 });

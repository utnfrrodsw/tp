// Dependencies
var crypto = require("crypto");

// Normalize a word
exports.normalize = function normalize(word) {
    return word.toLowerCase().replace(/[^\w]/g, "");
};

// Tokenize a doc
exports.tokenize = function tokenize(doc) {
    return doc.split(/[\s_():.!?,;]+/);
};

exports.reduce = function(previous, current, index, array) {
    if(!(current in previous)) {
        previous[current] = 1 / array.length;
    } else {
        previous[current] += 1 / array.length;
    }
    return previous;
};

// Text frequency
exports.tf = function tf(words, stopWords) {
    return words
        // Normalize words
        .map(exports.normalize)
        // Filter out stop words and short words
        .filter(function(word) {
            return word.length > 1 && (!stopWords || !~stopWords.indexOf(word));
        })
        // Reduce
        .reduce(exports.reduce, {});
};

// Inverse document frequency
exports.idf = function idf(D, dted) {
    return Math.log(D / (1 + dted)) / Math.log(10);
};

// Main entry point, load the corpus and return an object
// which can calculate the tfidf for a certain doc
exports.analyze = function analyze(corpus, _stopWords) {
    var
        // Total number of (unique) documents
        D = 0,
        // Number of documents containing the term
        dted = {},
        // Keep our calculated text frequencies
        docs = {},
        // Normalized stop words
        stopWords;
    
    if(_stopWords) stopWords = _stopWords.map(exports.normalize);

    // Key the corpus on their md5 hash
    function hash(doc) {
        return crypto.createHash("md5").update(doc).digest("base64");
    }

    function add(h, doc) {
        // One more document
        D++;
        // Calculate and store the term frequency
        docs[h] = exports.tf(exports.tokenize(doc), stopWords);
        // Update number of documents with term
        for(term in docs[h]) {
            if(!(term in dted)) dted[term] = 0;
            dted[term]++;
        }
    }

    if(!(corpus instanceof Array)) {
        // They are loading a previously analyzed corpus
        var data = corpus instanceof Object ? corpus : JSON.parse(corpus);
        D = data.D;
        dted = data.dted;
        docs = data.docs;
    } else {
        // They are loading a term and a corpus
        for(var i = 0, l = corpus.length; i < l; i++) {
            var doc = corpus[i],
                h = hash(doc);

            // Add the document if it's new to us
            if(!(h in docs)) {
                add(h, doc);
            }
        }
    }

    // Return a function which calculates the tfidf for this document
    return {
        tfidf: function(t, doc) {
            var h = hash(doc),
                term = exports.normalize(t);

            // If it's a new document, add it
            if(!(h in docs)) {
                add(h, doc);
            }
            
            // Return the tfidf
            if(term in docs[h])
                return docs[h][term] * exports.idf(D, dted[term]);
            else
                return 0;
        },
        asJSON: function() {
            return JSON.stringify({
                version: 1,
                D: D,
                dted: dted,
                docs: docs
            });
        }
    };
};

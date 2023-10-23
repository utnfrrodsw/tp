tfidf = require("../lib/tfidf");

exports.testReduce = function(test) {
    test.expect(1);
    test.deepEqual(["foo", "bar"].reduce(tfidf.reduce, {}),
        {"foo": 0.5, "bar": 0.5}
    );
    test.done();
};

exports.testTf = function(test) {
    test.expect(1);
    test.deepEqual(tfidf.tf(["foo", "bar", "foo", "qux", "quux", "foo", "baz"]),
        {
            "foo": 3 / 7,
            "bar": 1 / 7,
            "qux": 1 / 7,
            "quux": 1 / 7,
            "baz": 1 / 7
        }
    );
    test.done();
};

exports.testTfWithStopWords = function(test) {
    test.expect(1);
    test.deepEqual(tfidf.tf(["foo", "bar", "foo", "qux", "quux", "foo", "baz"], ["bar"]),
        {
            "foo": 3 / 6,
            "qux": 1 / 6,
            "quux": 1 / 6,
            "baz": 1 / 6
        }
    );
    test.done();
};

exports.testIdf = function(test) {
    test.expect(1);
    test.equal(tfidf.idf(1e7, 999), 4);
    test.done();
};

exports.testAnalyze = function(test) {
    test.expect(1);
    var corpus = [
        "foo bar", "baz qux", "qux quuux", "bar baz", "bar qux",
        "bar quux", "qux bar", "quux bar", "quux baz", "bar",
        "qux", "quux", "padme hum", "mane hum", "fie foe",
        "fee fie", "fie fee", "baz foe", "fie bar", "frompel hompel"
    ];
    var data = tfidf.analyze(corpus);
    test.equal(data.tfidf("foo", "foo bar"), 0.5);
    test.done();
};

exports.testAnalyzeAndSave = function(test) {
    test.expect(1);
    var corpus = [
        "foo bar", "baz qux", "qux quuux", "bar baz", "bar qux",
        "bar quux", "qux bar", "quux bar", "quux baz", "bar",
        "qux", "quux", "padme hum", "mane hum", "fie foe",
        "fee fie", "fie fee", "baz foe", "fie bar", "frompel hompel"
    ];
    var data = tfidf.analyze(corpus),
        json = data.asJSON();
    test.ok(JSON.parse(json));
    test.done();
};

exports.testAnalyzeSerializedCorpus = function(test) {
    test.expect(1);
    var corpus = [
        "foo bar", "baz qux", "qux quuux", "bar baz", "bar qux",
        "bar quux", "qux bar", "quux bar", "quux baz", "bar",
        "qux", "quux", "padme hum", "mane hum", "fie foe",
        "fee fie", "fie fee", "baz foe", "fie bar", "frompel hompel"
    ];
    var json = tfidf.analyze(corpus).asJSON(),
        data = tfidf.analyze(json);
    test.equal(data.tfidf("foo", "foo bar"), 0.5);
    test.done();
};

exports.testAnalyzeWithOneNewDoc = function(test) {
    test.expect(1);
    var corpus = [
        "baz qux", "qux quuux", "bar baz", "bar qux",
        "bar quux", "qux bar", "quux bar", "quux baz", "bar",
        "qux", "quux", "padme hum", "mane hum", "fie foe",
        "fee fie", "fie fee", "baz foe", "fie bar", "frompel hompel"
    ];
    var data = tfidf.analyze(corpus);
    test.equal(data.tfidf("foo", "foo baz"), 0.5);
    test.done();
};

exports.testAnalyzeWithTwoIdenticalDocs = function(test) {
    test.expect(1);
    var corpus = [
        "foo bar", "baz qux", "baz qux", "qux quuux", "bar baz", "bar qux",
        "bar quux", "qux bar", "quux bar", "quux baz", "bar",
        "qux", "quux", "padme hum", "mane hum", "fie foe",
        "fee fie", "fie fee", "baz foe", "fie bar", "frompel hompel"
    ];
    var data = tfidf.analyze(corpus);
    test.equal(data.tfidf("foo", "foo bar"), 0.5);
    test.done();
};

exports.testAnalyzeWithStopWords = function(test) {
    test.expect(1);
    var corpus = [
        "a foo bar too", "baz qux", "qux quuux", "bar baz", "bar qux",
        "bar quux", "qux bar", "quux bar", "quux baz", "bar",
        "qux", "quux", "padme hum", "mane hum", "fie foe",
        "fee fie", "fie fee", "baz foe", "fie bar", "frompel hompel"
    ];
    var data = tfidf.analyze(corpus, ["a", "too"]);
    test.equal(data.tfidf("too", "a foo bar too"), 0);
    test.done();
};

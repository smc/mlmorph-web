import sys
import regex
import os
from flask import Flask, jsonify, render_template, request
from flask_swagger import swagger

os.chdir(os.path.dirname(os.path.realpath(__file__)))

from mlmorph import Generator, Analyser
from mlmorph_spellchecker import SpellChecker

app = Flask(__name__,
    static_folder = "./dist/",
    static_url_path='',
    template_folder = "./dist")

generator = Generator()
analyser = Analyser()
spellchecker = SpellChecker()

@app.route("/",defaults={'path': ''})
@app.route('/ner', defaults={'path':'ner'})
@app.route('/spellcheck', defaults={'path':'spellcheck'})
@app.route('/number', defaults={'path':'number'})
@app.route('/about', defaults={'path':'about'})
@app.route('/generator', defaults={'path':'generator'})
def index(path):
    return render_template('index.html',)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

@app.route("/api/analyse", methods=['POST', 'GET'])
def do_analyse():
    """
    Analyse the given text
    ---
    tags:
        - analysis
    consumes:
        - application/json
    produces:
        - application/json
    parameters:
        - name: text
          in: body
          description: The text to be analysed. Can be multiple words.
          type: string
          required: true
    """
    text = None
    analyse_results = {}
    if request.method == 'POST':
        text = request.json.get('text')
    else:
        text = request.args.get('text')
    text = text.strip()
    words = regex.split(r'(\s+)', text)
    # real analysis
    for windex in range(len(words)):
        word = words[windex]
        anals = analyser.analyse(word, False)
        anals_results = []
        if len(anals) == 0:
            anals_results = []
        else:
            for aindex in range(len(anals)):
                anals_results.append(analyser.parse_analysis(anals[aindex][0]))

        anals_results.sort(key=lambda analysis: analysis['weight'])
        analyse_results[word] = anals_results

    return jsonify(result=analyse_results)


@app.route("/api/generate", methods=['GET'])
def do_generate():
    """
    Generate a word from given morpheme sequence
    ---
    tags:
        - generate
    consumes:
        - application/json
    produces:
        - application/json
    parameters:
        - name: word
          in: query
          description: The morpheme string
          type: string
          required: true
        - name: type
          in: query
          description: The word POS
          type: string
          required: false
        - name: infl
          in: query
          description: The inflection
          type: string
          required: false
    """
    generate_results = []
    word = request.args.get('word')
    wordtype = request.args.get('type')
    genInput = word
    if wordtype:
        genInput += '<' + wordtype + '>'
    infl = request.args.get('infl')
    if infl:
        genInput += '<' + infl + '>'
    gens = generator.generate(genInput)
    if len(gens) == 0:
        generate_results.append(genInput)
    for gindex in range(len(gens)):
        generate_results.append(gens[gindex][0])
    return jsonify(word=word, type=wordtype, infl=infl, result=generate_results)


@app.route("/api/spellcheck", methods=['POST', 'GET'])
def do_spellcheck():
    """
    Spellcheck the words given text
    ---
    tags:
        - spellcheck
    consumes:
        - application/json
    produces:
        - application/json
    parameters:
        - name: text
          in: body
          description: The morpheme string
          type: string
          required: true
    """
    result = {}
    if request.method == 'POST':
        text = request.json.get('text')
    else:
        text = request.args.get('text')
    text = text.strip()
    words = regex.split(r'(\s+)', text)
    result = {}
    # real analysis
    for windex in range(len(words)):
        word = words[windex]
        isCorrect = spellchecker.spellcheck(word)
        suggestions = []
        if not isCorrect:
            suggestions = spellchecker.candidates(word)
        result[word] = {'correct': isCorrect, 'suggestions': suggestions}
    return jsonify(result)

@app.route("/spec")
def spec():
    swag = swagger(app)
    swag['info']['version'] = "1.0"
    swag['info']['title'] = "mlmorph web api"
    return jsonify(swag)


if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))

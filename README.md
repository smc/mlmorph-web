Web interface for mlmorph Malayalam Morphology Analyser
=======================================================

Flask based web interface for Malayalam morphology analyser and spellchecker


Installation
------------

Create a virtual environment. In linux based systems, it is like this:
```
python -m venv ENV_DIR
source ENV_DIR/bin/activate
```

Then install the dependencies

```
pip install -r requirements.txt
```


Start the webserver and open the URL given in the output with a web browser.

```
python mlmorphweb.py
```

Or configure webservers like Apache with this flask application. You may use the example configuration for reference. Refer http://flask.pocoo.org/docs/0.12/deploying/ for more information on deploying flask applications.
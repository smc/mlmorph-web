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

Build web interface. There is a vuejs based web interface for all the apis. To build it:

```
npm install
npm run build
```

Start the webserver and open the URL given in the output with a web browser.

```
gunicorn mlmorphweb:app
```

Or configure webservers like Apache with this flask application. You may use the example configuration for reference. Refer http://flask.pocoo.org/docs/0.12/deploying/ for more information on deploying flask applications.
This application can also be easily deployed in Heroku. See https://devcenter.heroku.com/articles/getting-started-with-python


Using Docker
============

```
docker build --tag=mlmorphweb .
sudo docker run -e PORT=80 -p 4000:80 mlmorphweb
```

And open browser at localhost:4000

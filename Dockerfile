FROM python:3.6-buster
MAINTAINER Santhosh Thottingal "santhosh.thottingal@gmail.coom"
WORKDIR /app
COPY . /app
RUN pip3 install -r requirements.txt
ENV NAME MlmorphWeb

# Make port 80 available to the world outside this container
EXPOSE 80
CMD gunicorn -b 0.0.0.0:80 mlmorphweb:app


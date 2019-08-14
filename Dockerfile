FROM python:3.6-buster
MAINTAINER Santhosh Thottingal "santhosh.thottingal@gmail.coom"
WORKDIR /app
COPY . /app
RUN pip3 install -r requirements.txt
RUN apt-get update
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && apt-get install nodejs -y
RUN npm install
RUN npm run build
ENV NAME MlmorphWeb

# Make port 80 available to the world outside this container
EXPOSE 80
CMD gunicorn -b 0.0.0.0:80 mlmorphweb:app


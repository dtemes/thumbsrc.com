#A very nice and useful service to capture webpages as jpeg images by timstudd

FROM ubuntu:trusty
MAINTAINER David Temes <dtemes@gmail.com>

RUN apt-get update && apt-get install -y \
	imagemagick \
	mongodb \
	nodejs \
	npm \
	wget \
	wkhtmltopdf

COPY . /src

RUN cd /src; npm install

#this avoids problems running mongodb in my very small test environment
RUN echo "smallfiles=true">>/etc/mongodb.conf

EXPOSE 5000 27017

ENTRYPOINT ["/src/run.sh"]

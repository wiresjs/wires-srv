FROM morrr/base:0.0.2
ADD ./ /app
WORKDIR /app

RUN \
   npm install && \
   bower install --allow-root

EXPOSE  3000
CMD ["node", "app.js"]

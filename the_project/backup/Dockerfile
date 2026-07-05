FROM alpine

WORKDIR /usr/src/app

COPY script.sh .

RUN chmod +x /usr/src/app/script.sh

RUN apk add curl -y

CMD ["./script.sh"]

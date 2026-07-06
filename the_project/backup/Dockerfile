FROM gcr.io/google.com/cloudsdktool/google-cloud-cli
WORKDIR /usr/src/app

COPY script.sh .

RUN chmod +x /usr/src/app/script.sh

RUN apk add postgresql-client

CMD ["./script.sh"]

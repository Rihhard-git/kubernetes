FROM gcr.io/google.com/cloudsdktool/google-cloud-cli
WORKDIR /usr/src/app

COPY script.sh .

RUN chmod +x /usr/src/app/script.sh

RUN apt update && apt install -y postgresql-client-18

CMD ["./script.sh"]

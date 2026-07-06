#!/usr/bin/env bash
set -e

if [ $URL ]
then

  gcloud container clusters get-credentials dwk-cluster --location=europe-north1-b

  #pg_dump -v $URL > /usr/src/app/backup.sql
  curl -X GET -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    "https://storage.googleapis.com/storage/v1/b/raihhardv-backup-bucket/o"
  echo "Not sending the dump actually anywhere"
  # curl -F ‘data=@/usr/src/app/backup.sql’ https://somewhere
fi
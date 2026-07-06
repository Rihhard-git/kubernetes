#!/usr/bin/env bash
set -e

if [ $URL ]
then

  name=backup-$(date -I).sql

  pg_dump -v $URL > /usr/src/app/$name
  curl -X POST --data-binary @/usr/src/app/$name \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    "Content-Type: application/sql" \
    "https://storage.googleapis.com/upload/storage/v1/b/raihhardv-backup-bucket/o?uploadType=media&name=$name"

  # curl -F ‘data=@/usr/src/app/backup.sql’ https://somewhere
fi
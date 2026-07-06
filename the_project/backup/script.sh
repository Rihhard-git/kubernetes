#!/usr/bin/env bash
set -e

if [ $URL ]
then
  

  pg_dump -v $URL > /usr/src/app/backup.sql
  curl -X POST --data-binary @/usr/src/app/backup.sql \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    "Content-Type: application/sql" \
    "https://storage.googleapis.com/upload/storage/v1/b/raihhardv-backup-bucket/o?name=backup$(date -I)"

  # curl -F ‘data=@/usr/src/app/backup.sql’ https://somewhere
fi
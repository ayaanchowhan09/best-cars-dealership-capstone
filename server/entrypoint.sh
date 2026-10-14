#!/bin/sh

# Make migrations and migrate the database.
echo "Making migrations and migrating the database. "
python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Render supplies the listening port through PORT. Keep 8000 as the local default.
if [ "$1" = "gunicorn" ]; then
  exec gunicorn --bind "0.0.0.0:${PORT:-8000}" --workers "${WEB_CONCURRENCY:-2}" djangoproj.wsgi:application
fi
exec "$@"

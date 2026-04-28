#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Seed data if empty
python manage.py shell -c "
from api.models import Region
if not Region.objects.exists():
    import subprocess
    subprocess.call(['python', 'manage.py', 'seed'])
    from django.contrib.auth.models import User
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@agrosmart.ma', 'admin123')
    if not User.objects.filter(username='commercial').exists():
        u = User.objects.create_user('commercial', 'commercial@agrosmart.ma', 'commercial123')
        u.first_name = 'Ahmed'
        u.last_name = 'Benali'
        u.save()
"

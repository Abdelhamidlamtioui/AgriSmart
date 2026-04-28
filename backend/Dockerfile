FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --no-input 2>/dev/null || true

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && python manage.py seed 2>/dev/null; gunicorn agrosmart.wsgi:application --bind 0.0.0.0:8000"]

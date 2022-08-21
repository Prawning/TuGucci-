FROM python:3.10
RUN mkdir /app
COPY main.py /app
COPY requirements.txt /app
COPY ml_key.json /app
WORKDIR /app
RUN pip install -r requirements.txt
ENV PORT 8080
ENV GOOGLE_APPLICATION_CREDENTIALS /app/ml_key.json
EXPOSE 8080
CMD exec gunicor --bind :PORT --workers 2 --threads 8 main:app
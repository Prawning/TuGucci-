import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import storage, language_v1
from google.oauth2 import service_account
from datetime import date

# google cloud storage
GOOGLE_APPLICATION_CREDENTIALS = "ml_key.json"
credentials = service_account.Credentials.from_service_account_file(GOOGLE_APPLICATION_CREDENTIALS)
storage_client = storage.Client.from_service_account_json(GOOGLE_APPLICATION_CREDENTIALS)
def new_bucket(uuid):
    bucket_name = uuid + "-bucket"
    bucket = storage_client.create_bucket(bucket_name)
    buckets = list(storage_client.list_buckets())
    print(buckets)

# google cloud sentiment
def analyze_sentiment(text_content):
    sentiment_client = language_v1.LanguageServiceClient(credentials=credentials)
    type_ = language_v1.Document.Type.PLAIN_TEXT
    language = "en"
    document = {"content": text_content, "type_": type_, "language": language}

    encoding_type = language_v1.EncodingType.UTF8
    response = sentiment_client.analyze_sentiment(request = {'document': document, 'encoding_type': encoding_type})
    return response


# Set up Flask
app = Flask(__name__)
CORS(app) # Allow cross-origin requests
@app.route('/create_bucket/<uuid>', methods = ['POST'])
def create_bucket(uuid):
    new_bucket(uuid)
    return "bucket created"

@app.route('/update_journal/<uuid>', methods = ['POST'])
def update_journal(uuid):
    contents = request.json['entry']
    bucket_name = uuid.lower() + "-bucket"
    bucket = storage_client.bucket(bucket_name)
    content_list = contents.split(" ")
    blob_name = f"{str(date.today())}-{content_list[0]}-{random.randint(1,1000)}.txt"
    blob = bucket.blob(blob_name)
    blob.upload_from_string(contents)
    return f"{blob_name} uploaded to {bucket_name}"

@app.route("/api/<uuid>", methods = ['GET'])
def api(uuid):
    # use uuid to get bucket name
    bucket_name = uuid.lower() + "-bucket"
    bucket = storage_client.bucket(bucket_name)
    # get all blobs in bucket
    blobs = bucket.list_blobs()
    # for every blob, analyze sentiment
    to_return = {}
    for blob in blobs:
        time_created = blob.time_created.strftime("%m/%d/%Y, %H:%M:%S")
        blob_content = str(blob.download_as_string())
        response = analyze_sentiment(blob_content)
        score = float(response.document_sentiment.score)
        magnitude = float(response.document_sentiment.magnitude)
        data = {
            "blob_content" : blob_content,
            "score" : score,
            "magnitude" : magnitude,
        }
        to_return[time_created] = data

    return to_return



def main():
    app.run(debug = True, port=8080)

if __name__ == '__main__':
    main()


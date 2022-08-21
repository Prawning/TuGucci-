import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import storage, language_v1
from google.oauth2 import service_account
from datetime import date
# import os 

# google cloud storage
# GOOGLE_APPLICATION_CREDENTIALS = os.getcwd() + "\\text_sentiment\\ml_key.json"
GOOGLE_APPLICATION_CREDENTIALS = "ml_key.json"
credentials = service_account.Credentials.from_service_account_file(GOOGLE_APPLICATION_CREDENTIALS)

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
@app.route("/")
def hello():
    return "This shit be working"


@app.route("/api", methods = ['post']) # this performs sentiment anal ysis immediately, no need for buckets
def api():
    text = request.json['entry']
    response = analyze_sentiment(text)
    score = float(response.document_sentiment.score)
    magnitude = float(response.document_sentiment.magnitude)
    data = {
        "score" : score,
        "magnitude" : magnitude,
    }
    return data



def main():
    app.run(debug = True, port=8080)

if __name__ == '__main__':
    main()


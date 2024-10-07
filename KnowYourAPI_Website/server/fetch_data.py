from flask import Flask, request, jsonify, send_file
import requests
from bs4 import BeautifulSoup
import csv
import os
import pandas as pd
from transformers import pipeline
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re

# Ensure nltk resources are downloaded
nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__)

# Load Hugging Face sentiment analysis model
sentiment_pipeline = pipeline('sentiment-analysis')

# Define aspects
aspects = [
    'Usability', 'Performance', 'Bug', 'Security', 'Community',
    'Compatibility', 'Documentation', 'Legal', 'Portability',
    'OnlySentiment', 'Others'
]

# Stop words
stop_words = set(stopwords.words('english'))

# Function to preprocess text
def preprocess_text(text):
    text = re.sub(r'\d+', '', text)  # Remove numbers
    text = re.sub(r'[^\w\s]', '', text)  # Remove special characters
    tokens = word_tokenize(text)
    tokens = [word.lower() for word in tokens if word.lower() not in stop_words]
    return ' '.join(tokens)

# Preprocess and analyze data
def preprocess_and_analyze(file_path):
    try:
        data = pd.read_csv(file_path)
        data_cleaned = data.drop_duplicates().dropna()
        data_cleaned['Answer'] = data_cleaned['Answer'].apply(preprocess_text)

        # Initialize aspect counts
        aspect_sentiments = {aspect: {'positive': 0, 'negative': 0} for aspect in aspects}

        # Run sentiment analysis
        for answer in data_cleaned['Answer']:
            sentiment = sentiment_pipeline(answer[:512])  # Truncate text for BERT model
            sentiment_label = sentiment[0]['label']
            sentiment_score = sentiment[0]['score']

            # Here, map the answer to the aspects manually or by keywords (simplified example)
            for aspect in aspects:
                if aspect.lower() in answer:  # You can refine the aspect detection mechanism
                    if sentiment_label == 'POSITIVE':
                        aspect_sentiments[aspect]['positive'] += 1
                    else:
                        aspect_sentiments[aspect]['negative'] += 1

        # Calculate percentages for each aspect
        aspect_percentages = {}
        for aspect, counts in aspect_sentiments.items():
            total = counts['positive'] + counts['negative']
            if total > 0:
                aspect_percentages[aspect] = {
                    'positive': (counts['positive'] / total) * 100,
                    'negative': (counts['negative'] / total) * 100
                }
            else:
                aspect_percentages[aspect] = {'positive': 0, 'negative': 0}

        return aspect_percentages

    except Exception as e:
        print(f"Error preprocessing and analyzing data: {e}")
        raise e

# Fetch and process data from StackOverflow
@app.route('/fetch_data', methods=['POST'])
def handle_request():
    try:
        data = request.get_json()
        url = data.get('url')
        if not url:
            return jsonify({'error': 'URL is required'}), 400

        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        question_title = soup.find('h1').text.strip()
        question_content = soup.find('div', class_='js-post-body').text.strip()

        answers = soup.find_all('div', class_='answer')
        csv_filename = 'scraped_data.csv'
        
        with open(csv_filename, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['Question Title', 'Question', 'Answer'])
            for answer in answers:
                answer_content = answer.find('div', class_='js-post-body').text.strip()
                writer.writerow([question_title, question_content, answer_content])
        
        # Preprocess and analyze the data
        aspect_percentages = preprocess_and_analyze(csv_filename)
        return jsonify(aspect_percentages)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004, debug=False)

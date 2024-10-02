from flask import Flask, request, jsonify, send_file
import requests
from bs4 import BeautifulSoup
import csv
import os

app = Flask(__name__)

def fetch_stackoverflow_data(url):
    # Send HTTP request to the given URL
    response = requests.get(url)
    response.raise_for_status()  # Check for HTTP errors
    print(url)

    # Parse HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Create or open a CSV file for writing data
    csv_filename = 'stackoverflow_data.csv'
    with open(csv_filename, 'w', newline='', encoding='utf-8') as file:
        try:
            writer = csv.writer(file)
            # Write the headers for the CSV file
            writer.writerow(['Question ID', 'Question Title', 'Question', 'Answer ID', 'Answer'])

            # Extract the question ID, title, and content
            print("#######################")
            question_id = url.split('/')[-1]
            question_title = soup.find('h1').text.strip()
            question_content = soup.find('div', class_='js-post-body').text.strip()

            # Find all answers on the page
            answers = soup.find_all('div', class_='answer')

            for answer in answers:
                answer_id = answer['data-answerid']
                answer_content = answer.find('div', class_='js-post-body').text.strip()

                # Write data to the CSV
                writer.writerow([question_id, question_title, question_content, answer_id, answer_content])
            
        except Exception as e:
            print(f"An error occurred: {e}")

    return csv_filename

@app.route('/fetch_data', methods=['POST'])
def handle_request():
    try:
        # Extract the URL from the incoming request
        data = request.get_json()
        url = data.get('url')
        #Check url ky konsa hy us ky according function call kary 
        if not url:
            return jsonify({'error': 'URL is required'}), 400

        # Call the scraping function and get the CSV filename
        csv_filename = fetch_stackoverflow_data(url)

        # Send the CSV file back as a response
        return send_file(csv_filename, as_attachment=True)

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004, debug=False)

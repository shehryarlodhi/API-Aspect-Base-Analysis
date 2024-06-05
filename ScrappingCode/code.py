import csv
import requests
from bs4 import BeautifulSoup

def fetch_stackoverflow_data(url):
    # Send HTTP request to the given URL
    response = requests.get(url)
    response.raise_for_status()  # Check for HTTP errors

    # Parse HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Create or open a CSV file for writing data
    with open('stackoverflow_data.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        # Write the headers for the CSV file
        writer.writerow(['Question ID', 'Question Title', 'Question', 'Answer ID', 'Answer'])

        # Extract the question ID, title, and content
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

# Replace 'YOUR_LINK_HERE' with your StackOverflow link
url = 'https://stackoverflow.com/questions/75740652/fastapi-streamingresponse-not-streaming-with-generator-function'
fetch_stackoverflow_data(url)

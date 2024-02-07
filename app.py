from flask import Flask, jsonify, request
import pandas as pd
import os
import google.generativeai as genai
from IPython.display import Markdown
import re
import random
import json

GOOGLE_API_KEY= "AIzaSyBgc-O6x9qII5OpTGIyxYrHyICAdRj-Pe0"
genai.configure(api_key = GOOGLE_API_KEY)

def score(df):
    # Maximum values for each column
    numerical_columns = ['Correctness', 'Difficulty', 'Time Spent']
    max_values = df[numerical_columns].max()

    # Dividing each value in numerical columns by the respective maximum value
    for col in numerical_columns:
        df[col] = df[col] / max_values[col]

    # Normalizing number of attempts by dividing every value by max number of attempts (5)
    df['Number of Attempts'] = df['Number of Attempts'] / 5
    df['Correctness'].fillna(0, inplace=True)

    # ProGuide score formula
    df['Score'] = (df['Correctness'] * df['Difficulty'] + \
                   (df['Correctness'] * df['Difficulty']) / df['Time Spent'] + \
                   (df['Correctness'] * df['Difficulty']) / df['Number of Attempts']) / 1.8

    # Grouping by 'Topics' and calculating the average score per topic
    average_score_per_topic = df.groupby('Topics')['Score'].mean()
    return average_score_per_topic

app = Flask(__name__)

# Endpoint to receive POST requests containing data
@app.route('/calculate_score', methods=['POST'])
def calculate_score():
    try:
        # Get the JSON data from the POST request
        data = request.get_json()
        
        # Convert the received JSON data to a DataFrame
        df = pd.DataFrame(data)
        
        # Calculate ProGuide
        # using the provided function
        result = score(df)
        
        # Convert the result to a JSON response
        response = result.to_json()
        
        return response, 200  # Return the response and status code 200 (OK)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400  # Return error message and status code 400 (Bad Request)


# function for changging numbers in a question to a random value
def replace_numbers_with_random(text, percentage_range=25):
    """
    Replace integers or floats in the text with random values within a specified percentage range.

    Parameters:
        text (str): The input text containing numbers to be replaced.
        percentage_range (int): The percentage range for random value generation. Default is 25.

    Returns:
        str: The modified text with numbers replaced.
    """
    # Regular expression pattern to match integers and floats
    pattern = r'(\d+\.\d+|\d+)'

    # Function to replace each matched number with a random value within a 25% range
    def replace(match):
        original_value = float(match.group())
        percentage_change = random.uniform(-percentage_range, percentage_range)
        new_value = round(original_value * (1 + percentage_change / 100), 2)
        return str(new_value)

    # Replacing numbers in the text using the defined pattern and replacement function
    modified_text = re.sub(pattern, replace, text)

    return modified_text

# Function for question paraphrasing
def generate_modified_content(question, percentage_range=25):
    """
    Generate modified content by changing numerical values in the question.

    Parameters:
        question (str): The input question containing numerical values to be replaced.
        percentage_range (int): The percentage range for random value generation. Default is 25.

    Returns:
        str: The modified content with numerical values replaced.
    """

    GOOGLE_API_KEY= "AIzaSyBgc-O6x9qII5OpTGIyxYrHyICAdRj-Pe0" #API key i got from google developer site. it needs to be kept in a .env file. This will be done in further updates
    
    # Calling the replace_numbers_with_random function to modify numerical values in the question
    modified_question = replace_numbers_with_random(question, percentage_range)

    # Use the modified question as input to the generative model and obtain the response
    model = genai.GenerativeModel('gemini-pro')
    prefix = "Use this question to form a short physics question: "
    response = model.generate_content(prefix + modified_question)

    return response.text

# route for generating new questions from old
@app.route('/paraphrase', methods=['POST'])
def paraphrase_question():
    if request.method == 'POST':
        try:
            # Getting the question from the POST request
            question = request.get_json().get("question")

            # Modifying the intergers or floats in the question and creating a new question from it
            modified_content = generate_modified_content(question)

            # JSON response
            return  jsonify({"Modified_content ": modified_content})

        except Exception as e:
            return jsonify({'error': str(e)})


def answer_questions(question):

    # Answering the questions
    model = genai.GenerativeModel('gemini-pro')
    prefix = "Please answer question: "
    response = model.generate_content(prefix + question)

    return response.text


# route for generating new questions from old
@app.route('/answer', methods=['POST'])
def answers():
    if request.method == 'POST':
        try:
            # Getting the question from the POST requests
            question = request.get_json().get("question")

            # Modifying the intergers or floats in the question and creating a new question from it
            answer = answer_questions(question)

            # JSON response
            return  jsonify({"Answer ": answer})

        except Exception as e:
            return jsonify({'error': str(e)})
if __name__ == '__main__':
    app.run(debug=True)

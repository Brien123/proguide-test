from flask import Flask, jsonify, request
import pandas as pd
import os
import google.generativeai as genai
from IPython.display import Markdown
import re
import random
import json
from functions.function import score, replace_numbers_with_random, generate_modified_content

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

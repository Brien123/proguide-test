from flask import Flask, jsonify, request
import pandas as pd
import os
import google.generativeai as genai
from IPython.display import Markdown
import re
import random
import json
from functions.function import score, replace_numbers_with_random, generate_modified_content, answer_questions

app = Flask(__name__)

# Endpoint to receive POST requests containing data
@app.route('/calculate_score', methods=['POST'])
def calculate_score():
    """
Example df: {
    "Topics": ["Math", "Math", "Physics", "Physic", "Chemistry"],
    "Correctness": [1, 0, 1, 1, 0],
    "Difficulty": [1, 3, 2, 2, 3],
    "Time Spent": [30, 40, 20, 25, 35],
    "Number of Attempts": [3, 4, 2, 5, 3]
}
"""
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
    """
    Example question: {
    "question": "A boy walks a distance of 5 km in 100 minutes, what is his speed. what is the difference between speed and velocity"
    }
    """
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


# route for answering new questions from old
@app.route('/answer', methods=['POST'])
def answers():
        """
    Example question: {
    "question": "A boy walks a distance of 5 km in 100 minutes, what is his speed. what is the difference between speed and velocity"
    }
    """
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

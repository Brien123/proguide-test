from flask import Flask, jsonify, request
import pandas as pd
import os
import google.generativeai as genai
from IPython.display import Markdown
import re
import random
import json
from functions.function import score, replace_numbers_with_random, generate_modified_content, answer_questions, calculate_similarity, fetch_data_from_mysql, frequency
#import seaborn as sns
#import matplotlib.pyplot as plt

app = Flask(__name__)

# route to receive requests containing data and calculate proguide score
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
        data = request.get_json()
        df = pd.DataFrame(data)
        
        # Calculate ProGuide
        # using the provided function
        result = score(df)
        response = result.to_json()
        
        return response, 200 
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400  


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


# route to receive questions and return similarities
@app.route('/calculate_similarity', methods=['POST'])
def similarity():

    """
    Example data: 
    {
    "questions": [
        "What is machine learning?",
        "Tell me about machine learning",
        "What is artificial intelligence?",
        "Explain AI to me"
    ]
}
    """
    questions = request.json.get('questions', [])

    if len(questions) < 2:
        return jsonify({'error': 'At least two questions are required'}), 400

    # Calculate similarity
    similarity = calculate_similarity(questions)

    # response
    response = []
    for i in range(len(questions)):
        for j in range(i + 1, len(questions)):
            response.append({
                'question1': questions[i],
                'question2': questions[j],
                'percentage similarity': similarity[i][j]
            })

    return jsonify(response), 200     


# route to get topic frequency per year
@app.route('/frequency', methods=['GET'])
def freq():
    table = request.get_json().get("table")
    tabs = frequency(table)
    return tabs

if __name__ == '__main__':
    app.run(debug=True)

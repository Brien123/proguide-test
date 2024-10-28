import pandas as pd
import os
import google.generativeai as genai
from IPython.display import display
from IPython.display import Markdown
import re
import random
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize
from dotenv import load_dotenv
import mysql.connector
from flask import session
import textwrap
import hashlib
import base64
import secrets
from flask_session import Session
from groq import Groq
from langchain.chains import ConversationChain, LLMChain
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)
from langchain_core.messages import SystemMessage
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate

def to_markdown(text):
    text = text.replace('•', '  *')
    # Convert the Markdown content to a string
    markdown_string = textwrap.indent(text, '> ', predicate=lambda _: True)
    return markdown_string

api_key = os.environ.get("GOOGLE_API_KEY")


def score(df):
    """
    Calculates the proguide score of a given student for a particular Q/A session.

    Parameters:
        df (dict): A dictionary containing the various scores for the questions answered

    Returns:
        int: ProGuide score
    """
        
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
        str: Generated question
    """
    
    # Calling the replace_numbers_with_random function to modify numerical values in the question
    modified_question = replace_numbers_with_random(question, percentage_range)

    # Use the modified question as input to the generative model and obtain the response
    model = genai.GenerativeModel('gemini-pro')
    prefix = "Use this question to form a short physics question: "
    response = model.generate_content(prefix + modified_question)

    return response.text


def answer_questions(question):
    """
    Answer questions posed to it.

    Parameters:
        question (str): The input question containing numerical values to be replaced.

    Returns:
        str: Answer to the question
    """

    # Answering the questions
    model = genai.GenerativeModel('gemini-pro')
    prefix = "Please answer question: "
    response = model.generate_content(prefix + question)

    return response.text

# Function to calculate similarity between questions
def calculate_similarity(questions):
    """
    Calculates the cosine similarity between pairs of questions.

    Parameters:
      questions (list): A list of strings representing the questions to compare.

    Returns:
      similarity (numpy.ndarray): A 2D numpy array containing the similarity percentages
                                  between pairs of questions.
    """
    #questions_df = question
    questions_df = pd.DataFrame(questions, columns=["questions"])
    vectorizer = TfidfVectorizer()
    questions_tfidf = vectorizer.fit_transform(questions_df["questions"])
    similarity = cosine_similarity(questions_tfidf) * 100
    return similarity

def fetch_data_from_mysql(table):
    """
    Function to fetch data from MySQL database.

    Parameters:
        table (str): Name of the table to fetch data from.

    Returns:
        pandas.DataFrame: DataFrame containing the fetched data.
    """
    # Connect to MySQL database
    connection = mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )

    # Execute a MySQL query to fetch data
    query = f"SELECT * FROM ProGuide.{table}"
    cursor = connection.cursor()
    cursor.execute(query)

    # Fetch all rows from the result set
    data = cursor.fetchall()

    # Close the cursor and connection
    cursor.close()
    connection.close()

    # Convert the data to a DataFrame
    result = pd.DataFrame(data, columns=cursor.column_names)

    return result


def frequency(table):
    """
    Function to get the frequency of each unique topic per year.

    Parameters:
        dataframe (pandas.DataFrame): DataFrame containing columns 'id', 'question', 'topic', and 'year'.

    Returns:
        pandas.DataFrame: DataFrame containing the frequency of each unique topic per year.
    """
    questions = fetch_data_from_mysql(table)
    frequency_df = questions.groupby(['year', 'Topic']).size().unstack(fill_value=0)
    frequency_json = frequency_df.to_json(orient='index')
    
    return frequency_json


def get_topic_similarity(topic, table):
    questions_df = fetch_data_from_mysql(table)
    questions_df = questions_df[questions_df['Topic'] == topic]
    questions = questions_df['Questions'].tolist()
    question_ids = questions_df['ID'].tolist()
    
    similarity_matrix = calculate_similarity(questions)
    
    results = []
    
    for i in range(len(questions)):
        for j in range(i+1, len(questions)):
            pair = {
                'question_id_1': question_ids[i],
                'question_id_2': question_ids[j],
                'question_1': questions[i],
                'question_2': questions[j],
                'similarity_score': similarity_matrix[i][j]
            }
            results.append(pair)
    
    return results


def chat(user_input):
    # Initialize the GenerativeModel with the provided model_name
    model = genai.GenerativeModel('gemini-pro')
    
    # Retrieve the conversation history from the session or initialize it
    messages = session.get('messages', [])
    
    # Append the user's input to the conversation history
    messages.append({'role': 'user', 'parts': [user_input]})
    
    # Generate content based on the messages
    response = model.generate_content(messages)
    
    # Append the model's response to the conversation history
    messages.append({'role': 'model', 'parts': [response.text]})
    
    # Store the updated conversation history in the session
    session['messages'] = messages
    
    #response = to_markdown(response.text) # Return the plain text response
    responses = ""
    for chunk in response:
        responses += chunk.text + "\n"  # Add a newline between chunks
    
    return responses


def chats(user_question):
    """
    This function handles the chat interaction with Groq's language model.
    """
    # Get Groq API key
    groq_api_key = os.environ['GROQ_API_KEY']

    # Initialize Groq Langchain chat object and conversation
    groq_chat = ChatGroq(
        groq_api_key=groq_api_key,
        model_name='llama3-8b-8192'  # Default model
    )

    # Initialize memory
    memory = ConversationBufferWindowMemory(k=5, memory_key="chat_history", return_messages=True)

    # Construct a chat prompt template using various components
    prompt_components = [
        SystemMessage(content="you are an educational assistant call Jobe"),  # System prompt
        MessagesPlaceholder(variable_name="chat_history"),  # Placeholder for chat history
        HumanMessagePromptTemplate.from_template("{human_input}"),  # Placeholder for user input
    ]

    # Create a conversation chain using the LangChain LLM (Language Learning Model)
    conversation = LLMChain(
        llm=groq_chat,  # The Groq LangChain chat object initialized earlier.
        prompt=ChatPromptTemplate.from_messages(prompt_components),  # The constructed prompt template.
        verbose=True,   # Enables verbose output, which can be useful for debugging.
        memory=memory,  # The conversational memory object that stores and manages the conversation history.
    )

    # The chatbot's answer is generated by sending the full prompt to the Groq API.
    response = conversation.predict(human_input=user_question)
    
    return response


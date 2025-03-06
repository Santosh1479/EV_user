from flask import Flask, request, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.metrics import accuracy_score

app = Flask(__name__)

# Updated dataset with categories for checking nearby charging stations and battery charge
data = {
    "text": [
        "Where can I find a good restaurant?",
        "What is the weather like today?",
        "Check my battery level.",
        "How much charge is left on my phone?",
        "Find the nearest gas station.",
        "Show me my account balance.",
        "Is my order shipped?",
        "Search for the latest news.",
        "Check my internet speed.",
        "Where is the nearest EV charging station?",
        "Find a charging station nearby.",
        "Check the battery charge of my car.",
        "How much charge does my electric vehicle have left?"
    ],
    "label": [
        "search", "search", "check_charge", "check_charge", "search", "other", "other", "search", "check_charge", 
        "find_charging_station", "find_charging_station", "check_car_battery", "check_car_battery"
    ]
}

# Convert to DataFrame
df = pd.DataFrame(data)

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(df["text"], df["label"], test_size=0.2, random_state=42)

# Create a text classification model using Naive Bayes
model = make_pipeline(CountVectorizer(), MultinomialNB())

# Train the model
model.fit(X_train, y_train)

# Predict on the test set
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.2f}")

# Function to predict user input
def classify_text(text):
    return model.predict([text])[0]

@app.route('/classify', methods=['POST'])
def classify():
    data = request.get_json()
    text = data.get('text')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    category = classify_text(text)
    return jsonify({'category': category})

if __name__ == '__main__':
    app.run(debug=True)
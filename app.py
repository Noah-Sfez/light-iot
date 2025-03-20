from flask import Flask, request, jsonify, render_template
from text_to_speech import convert_text_to_speech

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_mp3', methods=['POST'])
def generate_mp3():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "Aucun texte fourni"}), 400

    convert_text_to_speech(text)
    return jsonify({"message": "Fichier MP3 généré avec succès"}), 200

if __name__ == '__main__':
    app.run(debug=True)

from gtts import gTTS

def convert_text_to_speech(text):
    tts = gTTS(text=text, lang='fr')
    tts.save("grands_titres.mp3")
    print("Fichier MP3 généré : grands_titres.mp3")

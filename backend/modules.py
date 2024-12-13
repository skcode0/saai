import whisperx
import numpy as np
from transformers import pipeline

# convert WAV binary to wav audio file and save 
def save_audio_as_wav(audio_buffer, output_file="output.wav"):
    with open(output_file, "wb") as f:
            f.write(audio_buffer)

# transcribe audio with WhisperX
def transcribe_audio(audio_buffer):
    device = "cuda" 
    batch_size = 8 # reduce if low on GPU mem
    compute_type = "float32" # change to "int8" if low on GPU mem (may reduce accuracy)
    language ="en" # english

    # load model
    model = whisperx.load_model("base", device=device, compute_type=compute_type, language=language)

    save_audio_as_wav(audio_buffer, "output.wav")

    # transcription
    audio = whisperx.load_audio("output.wav")
    result = model.transcribe(audio, batch_size=batch_size)

    # Whisperx returns in this format:
    # {'segments': [{'text': ' This is a test 1, 2, 3, 1, 2, 3. This is a test 1, 2, 3.', 'start': 0.009, 'end': 5.776}], 'language': 'en'}
    return result['segments'][0]['text'].strip()

# sentiment analysis with fine-tuned model (Goemotions)
def analyze_sentiment(transcription):
    # test model
    # sentiment_analyzer = pipeline("sentiment-analysis", model="joeddav/distilbert-base-uncased-go-emotions-student", return_all_scores=True)

    # my own fine-tuned model
    sentiment_analyzer = pipeline("sentiment-analysis", model="../models/augmented_v2", return_all_scores=True)

    result = sentiment_analyzer(transcription)[0]

    # change key names to emotion and probability
    cleaned_output = [{'emotion': entry['label'].capitalize(), 'probability': entry['score']} for entry in result]

    return cleaned_output

    


# Sentiment Analysis AI (SAAI)

## How it works:
1. Listens to audio from front end
   - Using frontend VAD (Voice Activity Detection) provided by [ricky0123](https://github.com/ricky0123/vad)
2. Sends wav binary to backend
3. Convert wav binary to .wav audio file
4. Feed .wav to [WhisperX](https://github.com/m-bain/whisperX) for transcription
5. Use outputted transcription to a sentiment analysis model (BERT-based) that's been trained on [GoEmotions](https://github.com/google-research/google-research/tree/master/goemotions)
6. Return transcription and corresponding sentiments to frontend
7. Frontend displays gif of top sentiment, transcription, and graph of sentiments

## Tools/Resources Used:
- React
- Front-end VAD by [ricky0123](https://github.com/ricky0123/vad)
- FastApi (websocket)
- [WhisperX](https://github.com/m-bain/whisperX)
- Hugging Face
- Datesets
   - [GoEmotions](https://github.com/google-research/google-research/tree/master/goemotions)
   - [sem_eval_2018_task_1 (English)](https://huggingface.co/datasets/SemEvalWorkshop/sem_eval_2018_task_1)
   - [Emotion Detection from Text - Pashupati Gupta](https://www.kaggle.com/datasets/pashupatigupta/emotion-detection-from-text/data)
   - [Emotions dataset for NLP - praveengovi](https://www.kaggle.com/datasets/praveengovi/emotions-dataset-for-nlp/data)
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

## Overview of how sentiment analysis models were trained
- Datasets have been processed and cleaned
  - datasets were converted to Hugging Face Datasets (uploaded to hugging face and saved locally)
  - labels have been one-hot-encoded (OHE) to reflect on multilabeling (28 sentiments based on GoEmotions)
  - Merged datasets
  - Data augmentation (TextAttack) added to certain minority/underrepresented labels
- 3 models (w/ class weighing to deal with imbalanced datasets) have been trained (saved locally and uploaded to Hugging Face):
  - Model using only GoEmotions dataset (go)
  - Model using GoEmotions and 3 other datasets (sources listed down below) (merged)
  - Model using GoEmotions, 3 other datasets, and data augmentation (only on some minority labels) (augmented)
- Measured performance metrics on individual sentiment labels
Note: Even with gtx1080 FP32, training a model with around 90k examples took around 50 min.

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
- [distilroberta-base](https://huggingface.co/distilbert/distilroberta-base)
- (TextAttack)[https://github.com/QData/TextAttack]

## Personal logs
- 11/27/24 - 11/29/24: finished basic front end
- 11/29/24: worked on backend websocket
- 12/1/24: implemented VAD on front end 
- 12/2/24: implemented websocket to send audio data, which is processed by WhisperX and sentiment analysis model. Processed data sent back to front end for displaying result. Image changing based on top emotion.
   - uploaded everything to github
- 12/3/24: implemented short long-term memory by saving 100 most recent sentiments/graphs in a state.
- 12/4/24: downloaded more datasets
- 12/5/24 - 12/6/24: cleaned/processed and combined datasets
- 12/7/24: textattack data augmentation
- 12/8/24 - 12/10/24: learned about hugging face fine tuning
- 12/10/24: implemented fine tuning 
- 12/12/24: trained 3 datasets
	1. original goEmotions dataset
	2. goEmotions + other datasets
	3. goEmotions + other datasets + textattack data augmentation
  - testing out augmented v2 (model 3 + EDA augmentation on all labels other than neutral)

## Result Summary

TODO
google result vs goemotions vs merged vs augmented
- look at f1 in each emotion (class weight)
- sample size per emotion
- hyperparameter tuning (more epochs and regularization)
- threshold for each emotion
- datasets not too good (some labels not perfect, examples may not be of quality --> still good enough, more examples == better metrics but also hurting others...also more imbalance between subset of emotions vs others)

v2 (model 3 + EDA augmentation on all labels other than neutral): improved quite a bit on minority labels, but didn't improve or hurt other label performance.
- need to focus more on augmenting minority labels

v3:
EasyDataAugmenter on all labels except labels with a lot of examples [neutral (27), sadness (25), joy (17), love (18), anger (2)].
CharSwapAugmenter on labels with very few examples compared to others: relief (23), confusion (6), disappointment (9), realization (22), caring (5), excitement (13), desire (8), remorse (24), embarrassment (12), nervousness (19), pride (21), grief (16).

conclusion: 
- more data for each sentiment for more accurate 
  - add data augmentation as model gets better
- hypertuning
- change thresholds for each emotion like this model did: https://huggingface.co/SamLowe/roberta-base-go_emotions
- look at micro/macro/weighted avg
  - imbalanced: macro/weighted
- note: sentiments don't need to be added up to 1 because it's multi-label not multi-class
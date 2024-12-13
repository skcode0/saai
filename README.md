# Sentiment Analysis AI (SAAI)

## How it works:
1. Listens to audio from front end
   - Using frontend VAD (Voice Activity Detection) provided by [ricky0123](https://github.com/ricky0123/vad)
2. Sends wav binary to backend
3. Convert wav binary to .wav audio file
4. Feed .wav to [WhisperX](https://github.com/m-bain/whisperX) for transcription
5. Use outputted transcription to a sentiment analysis model (BERT-based) that's been trained on [GoEmotions](https://github.com/google-research/google-research/tree/master/goemotions)
6. Return transcription and corresponding sentiments to frontend
7. Frontend displays gif of top sentiment, transcription, and graph of sentiments (Note that the probabilities of the sentiments don't have to add up to 1, because it's a multi-label classification, not multi-class where you can only have one label out of all labels)

# How to start up servers
- frontend (react): npm run dev
- backend (fastAPI): uvicorn main:app --reload
- Make sure to use your own model or comment out the test model in 'modules.py' in backend folder.
  - If you would like to try out my models (or datasets), you can find it here: [sngkm](https://huggingface.co/sangkm)

## Overview of how sentiment analysis models were trained
- Datasets have been processed and cleaned
  - datasets were converted to Hugging Face Datasets (uploaded to hugging face and saved locally)
  - labels have been one-hot-encoded (OHE) to reflect on multilabeling (28 sentiments based on GoEmotions)
  - Merged datasets
  - Data augmentation (TextAttack) added to certain minority/underrepresented labels
- 5 models (w/ class weighing to deal with imbalanced datasets) have been trained (saved locally and uploaded to Hugging Face):
  - Model using only GoEmotions dataset (`go`)
  - Model using GoEmotions and 3 other datasets (sources listed down below) (`merged`)
  - Model using GoEmotions, 3 other datasets, and data augmentation (only on some minority labels) (`augmented (v1)`)
  - Model using GoEmotions, 3 other datasets, and data augmentation on all labels except 'neutral'
  - Model using GoEmotions, 3 other datasets, and data augmentation (double the augmentation on minority labels)
- Measured performance metrics on individual sentiment labels
Note: Even with gtx1080 FP32, training a model with around 90k examples took around 50 min.

## Tools/Resources Used:
- React
- Front-end VAD by [ricky0123](https://github.com/ricky0123/vad)
- FastApi (websocket)
- [WhisperX](https://github.com/m-bain/whisperX)
- Hugging Face
- Datasets
   - [GoEmotions](https://github.com/google-research/google-research/tree/master/goemotions)
   - [sem_eval_2018_task_1 (English)](https://huggingface.co/datasets/SemEvalWorkshop/sem_eval_2018_task_1)
   - [Emotion Detection from Text - Pashupati Gupta](https://www.kaggle.com/datasets/pashupatigupta/emotion-detection-from-text/data)
   - [Emotions dataset for NLP - praveengovi](https://www.kaggle.com/datasets/praveengovi/emotions-dataset-for-nlp/data)
- [distilroberta-base](https://huggingface.co/distilbert/distilroberta-base)
- (TextAttack)[https://github.com/QData/TextAttack]

## Result Summary
Performance comparison between different fine-tuned models
- [Google](https://arxiv.org/pdf/2005.00547) 
  - Original research paper that trained on GoEmotions
- [SamLowe](https://huggingface.co/SamLowe/roberta-base-go_emotions)
  - Popular GoEmotions fine-tuned model on Hugging face
  - Shows results for default threshold of 0.5 and separate thresholds for each label.
- My models:
  - `go`: GoEmotions dataset only
  - `merged`: GoEmotions + 3 other datasets (Hugging Face & Kaggle)
  - `augmented (v1)`: merged datasets + augmented data
  - `augmented v2`: augmented v1 datasets + TextAttack's EDA on all labels other than neutral
  - `augmented v3`: augmented v1 datasets + TextAttack's EDA on non-majority labels + TextAttack's CharSwapAugmenter on minority labels
    - Creates more examples for labels with very few examples compared to other labels'

Notes:
- From the look it, Google's paper seems to have used threshold of 0.5. Also, it shows macro-averages, which are often used for imbalanced datasets. Thus, the chart below will show comparison based on **threshold=0.5** and **macro-averages** (on test sets).
- Google's and SamLowe's models don't explicitly mention how many examples were in test set, but I assume it's the same set as what I've used for my GoEmotions-only model (`go`). 
- Some models used more test samples for evaluation (look at `Support` column)
  - There are 5.43k examples for test set in GoEmotions, but the `Support` column shows around 6.33k. This is because it's multi-label, so each example can have multiple labels.
  - 17388 = test sets from GoEmotions + other datasets 


| Models       | Precision | Recall | F1-Score | Support |
|--------------|-----------|--------|----------|---------|
| Google       | 0.40      | **0.63**   | 0.46     | 6329    |
| SamLowe      | **0.575**     | 0.396  | 0.450    | 6329    |
| go           | 0.57      | 0.41   | 0.46     | 6329    |
| merged       | 0.57      | 0.42   | 0.46     | 17388   |
| augmented (v1) | 0.56      | 0.44   | 0.48     | 17388   |
| augmented v2 | 0.55      | 0.46   | **0.50**     | 17388   |
| augmented v3 | 0.55      | 0.46   | 0.49     | 17388   |


- My `go` model's performance is on par with Google's and SamLowe's.
- Just adding more datasets didn't really improve the performance of the model.
- From looking at F1, `augmented v2` model produced the highest score.
- Often times, minority labels often gave scores of 0 for precision/recall/f1 due to too few examples.
  - `Google`'s model failed to predict 'grief'
  - `SamLowe`'s and `go` model gave 0 for 'grief', 'pride', 'relief'
  - Although there were more data overall, `merged` model failed to give performance metrics for 'grief', 'pride', and surprisingly 'nervousness'. It gave 'relief' F1 score of 0.14. The reason for this is that the datasets often added common labels like 'joy', 'love', 'sadness', 'neutral', etc. but not enough examples for minority labels. Moreover, as you can see, the macro averages for the `merged` model didn't really show much improvement. It's probably due to adding examples that were not exactly of great quality. Some labels were questionable and debatable. It introduced some noise and hurt performances of some labels. For example, compared to `go` model, `merged` model gave F1 score of 0.82 for 'joy' and 0.65 for 'love'; `go` model had F1 score of 0.61 for 'joy' and 0.83 for 'love'. In the end, more data helped some labels while hurting others, eventually balancing out the overall score, causing the model to perform very similarly to the base model (`go`).
- Data augmented models actually improved the the performance a little. 
  - `V1` increased the F1 score by 0.02 compared to the base model (`go`). However it still failed to give scores for 'grief' and 'pride'. It was able to give 'nervousness' F1 score of 0.25 and 0.24 for 'relief'.
  - `V2` was the best model based on macro-F1. This model still failed to give score for 'grief' but was able to give 'pride' F1 score of 0.42. 'relief' was 0.25.
  - `V3`, although performed a little worse than `V2`, was able to give performance metrics for every label. This is thanks to more focus on having more data augmentation for minority labels. 'grief' had F1 score of 0.25, 'pride' 0.42, and 'relief' 0.17.


## Conclusion
- We can either use `augmented v2` or `augmented v3`. `V2` generalized the best out of the above-mentioned models. However, it still struggled with minority labels like 'grief'. If we want the model to at least recognize all labels, `v3` is preferred. For this project, I will be using `v2`, as grief is a sentiment that is often very specific to certain conversations.
- Please do note the models I have trained are NOT even close to being the best sentiment analysis model. There's still a lot of improvements to be had. Here are some of the things I would try to produce better results:
  1. Get more (quality) data, especially for minority labels
    - Not only does this help solve imbalanced dataset problem, but it also helps the model to predict more correct labels
  2. Use different data augmentation techniques to improve model performance by 1-2% (ymmv) and make your model(s) more robust
     - This method is especially good for minority labels as it also produces more data for those labels.
  3. Try different hyperparameters. I've mostly used defaults, but changing some of the hyperparameters (epochs, regularization, etc.) may product better results even with the same datasets.
  4. Try different thresholds instead of using the default 0.5.
      - [SamLowe](https://huggingface.co/SamLowe/roberta-base-go_emotions) shows example of how it's done.


## Ideas for more advanced improvements
- Add more labels
- Sarcasm detection
- Speech Emotion Recognition: use audio as input instead of text to detect emotions better
- Using computer vision to detect emotions based on body languages and facial expressions.


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
  - augmented v2 (model 3 + EDA augmentation on all labels other than neutral)
  - augmented v3 (EDA on non-majority labels + CharSwap on minority labels)
- 12/13/24: Imported augmented v2 to backend. Finished writing about result summary and conclusion
  - Made models/datasets/github publicly available. 
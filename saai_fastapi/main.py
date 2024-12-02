from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import Union
from modules import transcribe_audio, analyze_sentiment
import json

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None

@app.get('/')
def read_root():
    return {"Hello": "World"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_bytes() # get wav binary from front end

            # whisperx transcription 
            audio_transcription = transcribe_audio(data)
            print(audio_transcription)
            # sentiment analysis
            sentiment_data = analyze_sentiment(audio_transcription)

            message = {
                "transcription": audio_transcription,
                "sentiments": sentiment_data
            }

            print(json.dumps(message))

            await websocket.send_text(json.dumps(message)) # send json to client
  
    except Exception as e:
        print("Websocket error:", e)
        await websocket.close()

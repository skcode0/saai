from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import Union
from modules import transcribe_audio, analyze_sentiment
import json
from datetime import datetime


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
        count = 0
        while True:
            data = await websocket.receive_bytes() # get wav binary from front end

            # make id based on current date and time + count
            now = datetime.now()
            id = now.strftime("%Y%m%d_%H%M%S") + "_" + str(count)
            count += 1

            # whisperx transcription 
            audio_transcription = transcribe_audio(data)
            print(audio_transcription)
            # sentiment analysis
            sentiment_data = analyze_sentiment(audio_transcription)

            message = {
                "id": id,
                "transcription": audio_transcription,
                "sentiments": sentiment_data
            }

            print(json.dumps(message))

            await websocket.send_text(json.dumps(message)) # send json to client
  
    except Exception as e:
        print("Websocket error:", e)
        await websocket.close()

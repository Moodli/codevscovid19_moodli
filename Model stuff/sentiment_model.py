#sentiment model

from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer

#blob = TextBlob("Corona is bad, we are learning media")
#print(blob.sentiment)

#incoming ?

#outgoing geojson with sentiment and datetime
#
##train_data = pd.read_json (r'C:/Users/jonih/Desktop/emotion-detection-trn.json')
#print(train_data)

class blobclass:
    blob = TextBlob("")
    
    #def __init__(self):
    #    blob = TextBlob("")
        
    def write_text_get_sentiment(self,text):
        self.blob = TextBlob(text)
        sentiment = self.blob.sentiment
        return sentiment
    

model_sentiment = blobclass()
this_sentiment = model_sentiment.write_text_get_sentiment("I hate to be in quarantaine")
print("the sentiment of this sentence is:" + str(this_sentiment.polarity))
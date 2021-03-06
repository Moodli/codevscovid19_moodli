#sentiment model

from textblob_de import TextBlobDE as TextBlob
from textblob.sentiments import NaiveBayesAnalyzer
import json
import csv
import pandas as pd
import geojson
import numpy as np

#from textblob.np_extractors import ConllExtractor
#from textblob.base import BaseNPExtractor
#from textblob.en.np_extractors import ConllExtractor, FastNPExtractor

#incoming ?

#outgoing geojson with sentiment and datetime

class blobclass:
    blob = TextBlob("")
    #extractor = ConllExtractor()
    noun_collector = list()
    #def __init__(self):
    #    blob = TextBlob("")
        
    def write_text_get_sentiment(self,text):
        self.blob = TextBlob(text)
        sentiment = self.blob.sentiment
        return sentiment
    
    def get_nouns(self,text):
        blob = TextBlob(text)
        for words in blob.noun_phrases:
            self.noun_collector.append(words)
        if(len(blob.noun_phrases)>=1):
            print(blob.noun_phrases[0])

    def print_nouns(self):
        print(self.noun_collector)
        with open("nouns_german.txt", "w") as output:
            output.write(str(self.noun_collector))
    

def df_to_geojson(df, properties, lat='latitude', lon='longitude'):
    geojson = {'type':'FeatureCollection', 'features':[]}
    for _, row in df.iterrows():
        feature = {'type':'Feature','properties':{},'geometry':{'type':'Point','coordinates':[]}}
        feature['geometry']['coordinates'] = [row[lon],row[lat]]
        for prop in properties:
            feature['properties'][prop] = row[prop]
        geojson['features'].append(feature)
    return geojson

#with open("C:/Users/jonih/OneDrive/Documents/Freizeit/Hackathon/codevscovid19_moodli_backend/Model stuff/test.json") as f:
#  data = json.load(f)



data = pd.read_csv('C:/Users/jonih/OneDrive/Documents/Freizeit/Hackathon/codevscovid19_moodli_backend/Model stuff/dataExample_german.csv') 

model_sentiment = blobclass()

rows_list = []
for index,row in data.iterrows():

        dict1 = {}
        this_sentiment = model_sentiment.write_text_get_sentiment(row["text"])
        model_sentiment.get_nouns(row["text"])
        d = {"sentiment": this_sentiment.polarity}
        dict1.update(d) 

        rows_list.append(dict1)

data1 = pd.DataFrame(rows_list)   

data["sentiment"] = data1


lat = []
lon = []
# For each row in a varible,
for row in data["location"]:
    # Try to,
    try:
        lat.append(row.split(',')[0])
        lon.append(row.split(',')[1])
    # But if you get an error
    except:
        # append a missing value to lat
        lat.append(0)
        # append a missing value to lon
        lon.append(0)
        #lon.append(np.NaN) old

# Create two new columns from lat and lon
try:
    data['latitude'] = float(lat)
    data['longitude'] = float(lon)
except:
    data['latitude'] = lat
    data['longitude'] = lon 


print(data)
model_sentiment.print_nouns()

'''
dummydata = pd.DataFrame(np.random.randint(0,100,size=(10000, 2)), columns=list(['latitude','longitude']))
dummydata["text"]="some text"
dummydata["date"]="2020-03-27T18:25:43.511Z"
random_sentiment = np.random.uniform(low=-1.0, high=1.0, size=(10000))
dummydata["sentiment"]=random_sentiment
print(dummydata)
data = dummydata
'''

cols = ['date', 'text', 'sentiment']
geojson = df_to_geojson(data, cols)



output_filename = 'dataset.js'
with open('dataset_german.json', 'w') as output_file:
    #output_file.write('var dataset = ')
    json.dump(geojson, output_file, indent=2) #


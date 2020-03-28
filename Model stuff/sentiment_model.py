#sentiment model

from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer
import json
import csv
import pandas as pd
import geojson

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



data = pd.read_csv('C:/Users/jonih/OneDrive/Documents/Freizeit/Hackathon/codevscovid19_moodli_backend/Model stuff/dataExample.csv') 

model_sentiment = blobclass()

rows_list = []
for index,row in data.iterrows():

        dict1 = {}
        this_sentiment = model_sentiment.write_text_get_sentiment(row["text"])
        d = {"sentiment": this_sentiment.polarity}
        dict1.update(d) 

        rows_list.append(dict1)

data1 = pd.DataFrame(rows_list)   

data["sentiment"] = data1


print(data)


'''
sentiment_data = pd.DataFrame(columns=("sentiment"))
for index,row in data.iterrows():
    this_sentiment = model_sentiment.write_text_get_sentiment(row["text"])
    sentiment_data["sentiment"] = this_sentiment.polarity
    
data = pd.concat([data,sentiment_data])
'''
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
data['latitude'] = lat
data['longitude'] = lon

print(data)

cols = ['date', 'text', 'sentiment']
geojson = df_to_geojson(data, cols)

print(geojson)

output_filename = 'dataset.js'
with open('dataset.json', 'w') as output_file:
    #output_file.write('var dataset = ')
    json.dump(geojson, output_file, indent=2) #


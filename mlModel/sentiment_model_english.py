# sentiment model
import os
from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer
import json
import pandas as pd
import geojson
import redis

# Connect to redis
r = redis.Redis(host=os.environ['REDIS_HOST'], port=6379)


dirname = os.path.dirname(__file__)
incoming_path = os.path.join(dirname, '../mlModel/tweets.csv')
# outgoing geojson with sentiment,datetime, humanText, coordinates


class blobclass:
    blob = TextBlob("")

    def write_text_get_sentiment(self, text):
        self.blob = TextBlob(text)
        sentiment = self.blob.sentiment
        return sentiment


def df_to_geojson(df, properties, lat='latitude', lon='longitude'):
    geojson = {'type': 'FeatureCollection', 'features': []}
    for _, row in df.iterrows():
        feature = {'type': 'Feature', 'properties': {},
                   'geometry': {'type': 'Point', 'coordinates': []}}
        feature['geometry']['coordinates'] = [row[lon], row[lat]]
        for prop in properties:
            feature['properties'][prop] = row[prop]
        geojson['features'].append(feature)
    return geojson


data = pd.read_csv(incoming_path)

model_sentiment = blobclass()

rows_list = []
for index, row in data.iterrows():

    dict1 = {}
    this_sentiment = model_sentiment.write_text_get_sentiment(row["text"])

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
        lat.append(row.split(',')[0][1:])
        lon.append(row.split(',')[1][:-1])
    # But if you get an error
    except:
        # append a missing value to lat
        lat.append(0)
        # append a missing value to lon
        lon.append(0)
        # lon.append(np.NaN) old


# Create two new columns from lat and lon
try:
    data['latitude'] = float(lon)
    data['longitude'] = float(lat)
except:
    data['latitude'] = lon
    data['longitude'] = lat


'''
dummydata = pd.DataFrame(np.random.randint(0,100,size=(10000, 2)), columns=list(['latitude','longitude']))
dummydata["text"]="some text"
dummydata["date"]="2020-03-27T18:25:43.511Z"
random_sentiment = np.random.uniform(low=-1.0, high=1.0, size=(10000))
dummydata["sentiment"]=random_sentiment
print(dummydata)
data = dummydata
'''

# make geojson
cols = ['textHuman', 'sentiment']  # text
geojson = df_to_geojson(data, cols)

# Save the json data into redis
r.set('dataset', json.dumps(geojson, indent=4))
print("Damn look at this!!! Model Finished!!", end='')

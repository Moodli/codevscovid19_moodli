# sentiment model
import os
from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer
import json
import pandas as pd
import geojson
import redis
from io import StringIO

# Use local host if no env var is passed
try:
    host = os.environ['REDIS_HOST']
except:
    host = '127.0.0.1'

# Connect to redis
r = redis.Redis(host=host, port=6379)


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


# Get data from redis
data_source = r.get('csv').decode("utf-8")

# Convert it to dataframe
data = pd.read_csv(StringIO(data_source))

# The model
model_sentiment = blobclass()

# Empty array to hold the sentiment dict instance
rows_list = []

for index, row in data.iterrows():
    # The sentiment dict
    dict1 = {}

    # Get the sentiment score
    this_sentiment = model_sentiment.write_text_get_sentiment(row["text"])

    # Sentiment score format
    d = {"sentiment": this_sentiment.polarity}

    # Update the dict
    dict1.update(d)

    # Append the dict instance to the array
    rows_list.append(dict1)

# Turn the array of sentiment dicts into a dataframe
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


# make geojson
cols = ['textHuman', 'sentiment']  # text
geojson = df_to_geojson(data, cols)

# Save the json data into redis
r.set('dataset', json.dumps(geojson, indent=4))
print("Damn look at this!!! Model Finished!!", end='')

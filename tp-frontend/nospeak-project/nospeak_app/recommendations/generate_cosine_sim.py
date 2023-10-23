import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

csv_file_path = '/Users/bautistaguerra/Documents/source/soporte-G2307/TPI/nospeak-project/nospeak_app/recommendations/data_songs.csv'

data_songs = pd.read_csv(csv_file_path)

count = CountVectorizer()
count_matrix = count.fit_transform(data_songs['Genre'])

cosine_sim = cosine_similarity(count_matrix, count_matrix)


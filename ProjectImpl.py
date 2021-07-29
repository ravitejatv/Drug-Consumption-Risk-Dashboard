import pandas as pd
from sklearn.manifold import MDS
from sklearn.cluster import KMeans
import numpy as np
from sklearn.preprocessing import OrdinalEncoder
class ProjectImpl:
    def __init__(self):
        self.data = pd.read_csv("./data/drug_consumption_processed.csv")
        self.columns = self.data.columns
        self.dataset = self.data.to_numpy()
        self.categories = self.dataset[-1:][0]
        self.dataset = self.dataset[:-1]
       
        self.dataset_encoded = pd.read_csv("./data/drug_consumption_processed.csv").to_numpy()
        self.dataset_encoded = self.dataset_encoded[:-1]
        for ind,i in enumerate(self.categories):
            if i=="cat" and self.columns[ind] =="age":
                encoder = OrdinalEncoder(categories=[['18-24', '25-34', '35-44', '45-54', '55-64', '65+']])
                encoder.fit(self.dataset_encoded[:,ind].reshape(-1, 1))
                self.dataset_encoded[:,ind] = encoder.transform(self.dataset_encoded[:,ind].reshape(-1, 1)).flatten()
            elif i=="cat" and self.columns[ind] =="education":
                encoder = OrdinalEncoder(categories=[['B16', 'A16', 'A17', 'A18', 'NOCER', 'PROCER', 'UNI', 'MS', 'PHD']])
                encoder.fit(self.dataset_encoded[:,ind].reshape(-1, 1))
                self.dataset_encoded[:,ind] = encoder.transform(self.dataset_encoded[:,ind].reshape(-1, 1)).flatten()
            elif i=="cat":
                encoder = OrdinalEncoder()
                encoder.fit(self.dataset_encoded[:,ind].reshape(-1, 1))
                self.dataset_encoded[:,ind] = encoder.transform(self.dataset_encoded[:,ind].reshape(-1, 1)).flatten()
            elif i=="num":
                self.dataset_encoded[:,ind] = [int(cell) for cell in self.dataset_encoded[:,ind]]
        self.dataset_encoded = pd.DataFrame(data=self.dataset_encoded)

        
    def get_PlotsData(self):
        np.random.shuffle(self.dataset)
        return [self.dataset[:1000].tolist(), self.categories.tolist(), self.columns.tolist()]
    
    def get_MDSPlot(self):
        mds = MDS(n_components=2, dissimilarity="precomputed")
        data_transformed = self.dataset_encoded.astype('float64')
        corrrelation = 1 - abs(data_transformed.corr())
        dataset_transformed = mds.fit_transform(corrrelation)
        data_Arr = []
        for i in dataset_transformed:
            data_Arr.append(i.tolist())
        data_Arr = np.hsplit(np.array(data_Arr),2)
        X = []
        for i in data_Arr[0]:
            X.append(i[0])
        Y= []
        for i in data_Arr[1]:
            Y.append(i[0])
        return [X,Y,self.columns.tolist()]

    def kmeans_loadings(self):
        kmeans = KMeans(n_clusters=4, random_state=0).fit(self.dataset_num)
        return kmeans.labels_.tolist()
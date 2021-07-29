import pandas as pd
import numpy as np
class PreProcessing: 
    def __init__(self):
        self.columns = []
        self.data = []
        self.load_data()

    def convert_data(self):

        age = {-0.95197:'18-24', -0.07854:'25-34', 0.49788:'35-44', 1.09449:'45-54', 1.82213:'55-64', 2.59171:'65+'}
        self.data['age'] = [age[i] for i in self.data['age']]

        gender = {0.48246:'Female', -0.48246:'Male'}
        self.data['gender'] = [gender[i] for i in self.data['gender']]

        # education = {-2.43591:'Left school before 16 years', -1.73790:'Left school at 16 years', -1.43719:'Left school at 17 years', 
        # -1.22751:'Left school at 18 years', -0.61113:'Some college or university, no certificate or degree', 
        # -0.05921:'Professional certificate/ diploma', 0.45468:'University degree', 1.16365 :'Masters degree', 1.98437:'Doctorate degree'}
        education = {-2.43591:'B16', -1.73790:'A16', -1.43719:'A17', 
        -1.22751:'A18', -0.61113:'NOCER', 
        -0.05921:'PROCER', 0.45468:'UNI', 1.16365 :'MS', 1.98437:'PHD'}
        self.data['education'] = [education[i] for i in self.data['education']]


        country = {-0.09765:'Australia', 0.24923:'Canada', -0.46841:'New Zealand', -0.28519:'Other',
         0.21128:'Republic of Ireland', 0.96082:'UK', -0.57009:'USA'}
        self.data['country'] = [country[i] for i in self.data['country']]

        ethnicity = {-0.50212:'Asian', -1.10702:'Black', 1.90725:'Mixed-Black/Asian', 0.12600:'Mixed-White/Asian',
         -0.22166:'Mixed-White/Black', 0.11440:'Other', -0.31685:'White'}
        self.data['ethnicity'] = [ethnicity[i] for i in self.data['ethnicity']]

        nscore = {-3.46436:12,-3.15735:13,-2.75696:14,-2.52197:15,-2.42317:16,-2.34360:17,-2.21844:18,-2.05048:19,-1.86962:20,-1.69163:21,-1.55078:22,-1.43907:23,-1.32828:24,-1.19430:25,-1.05308:26,-0.92104:27,-0.79151:28,-0.67825:29,-0.58016:30,-0.46725:31,-0.34799:32,-0.24649:33,-0.14882:34,-0.05188:35,0.04257:36,0.13606:37,0.22393:38,0.31287:39,0.41667:40,0.52135:41,0.62967:42,0.73545:43,0.82562:44,0.91093:45,1.02119:46,1.13281:47,1.23461:48,1.37297:49,1.49158:50,1.60383:51,1.72012:52,1.83990:53,1.98437:54,2.12700:55,2.28554:56,2.46262:57,2.61139:58,2.82196:59,3.27393:60}
        self.data['nscore'] = [nscore[i] for i in self.data['nscore']]

        escore = {-3.27393:16,-3.00537:18,-2.72827:19,-2.53830:20,-2.44904:21,-2.32338:22,-2.21069:23,-2.11437:24,-2.03972:25,-1.92173:26,-1.76250:27,-1.63340:28,-1.50796:29,-1.37639:30,-1.23177:31,-1.09207:32,-0.94779:33,-0.80615:34,-0.69509:35,-0.57545:36,-0.43999:37,-0.30033:38,-0.15487:39,0.00332:40,0.16767:41,0.32197:42,0.47617:43,0.63779:44,0.80523:45,0.96248:46,1.11406:47,1.28610:48,1.45421:49,1.58487:50,1.74091:51,1.93886:52,2.12700:53,2.32338:54,2.57309:55,2.85950:56,3.00537:58,3.27393:59}
        self.data['escore'] = [escore[i] for i in self.data['escore']]

        oscore = {-3.27393:24,-2.85950:26,-2.63199:28,-2.39883:29,-2.21069:30,-2.09015:31,-1.97495:32,-1.82919:33,-1.68062:34,-1.55521:35,-1.42424:36,-1.27553:37,-1.11902:38,-0.97631:39,-0.84732:40,-0.71727:41,-0.58331:42,-0.45174:43,-0.31776:44,-0.17779:45,-0.01928:46,0.14143:47,0.29338:48,0.44585:49,0.58331:50,0.72330:51,0.88309:52,1.06238:53,1.24033:54,1.43533:55,1.65653:56,1.88511:57,2.15324:58,2.44904:59,2.90161:60}
        self.data['oscore'] = [oscore[i] for i in self.data['oscore']]

        ascore = {-3.46436:12,-3.15735:16,-3.00537:18,-2.90161:23,-2.78793:24,-2.70172:25,-2.53830:26,-2.35413:27,-2.21844:28,-2.07848:29,-1.92595:30,-1.77200:31,-1.62090:32,-1.47955:33,-1.34289:34,-1.21213:35,-1.07533:36,-0.91699:37,-0.76096:38,-0.60633:39,-0.45321:40,-0.30172:41,-0.15487:42,-0.01729:43,0.13136:44,0.28783:45,0.43852:46,0.59042:47,0.76096:48,0.94156:49,1.11406:50,1.2861:51,1.45039:52,1.61108:53,1.81866:54,2.03972:55,2.23427:56,2.46262:57,2.75696:58,3.15735:59,3.46436:60}
        self.data['ascore'] = [ascore[i] for i in self.data['ascore']]

        cscore = {-3.46436:17,-3.15735:19,-2.90161:20,-2.72827:21,-2.57309:22,-2.42317:23,-2.30408:24,-2.18109:25,-2.04506:26,-1.92173:27,-1.78169:28,-1.64101:29,-1.51840:30,-1.38502:31,-1.25773:32,-1.13788:33,-1.01450:34,-0.89891:35,-0.78155:36,-0.65253:37,-0.52745:38,-0.40581:39,-0.27607:40,-0.14277:41,-0.00665:42,0.12331:43,0.25953:44,0.41594:45,0.58489:46,0.7583:47,0.93949:48,1.13407:49,1.30612:50,1.46191:51,1.63088:52,1.81175:53,2.04506:54,2.33337:55,2.63199:56,3.00537:57,3.46436:59}
        self.data['cscore'] = [cscore[i] for i in self.data['cscore']]

        

    def load_data(self):
        column_list = ['age','gender','education','country','ethnicity','nscore','escore','oscore','ascore','cscore','alcohol','amphet','amyl','benzos','caff','cannabis','choc','coke','crack','ecstacy','heroin','ketamine','legalh','lsd','meth','mushrooms','nicotine','semer','vsa'] 
        self.data =  pd.read_csv('./data/drug_consumption.data', sep=",", usecols=column_list)
        self.columns = self.data.columns
        
    def write_to_data(self):
        # cat,cat,cat,cat,cat,num,num,num,num,num,cat,cat,cat,cat,cat,cat,cat,cat,cat,cat,cat,cat,cat,cat,cat,cat,cat,cat,cat
        self.data.to_csv('./data/drug_consumption_processed.csv', index=False)


prePro = PreProcessing()
prePro.convert_data()
prePro.write_to_data()
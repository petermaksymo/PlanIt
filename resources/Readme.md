# Files and purposes

* code_map_formatted.json - This file contains Major/Minor Course Codes and Names
* code_map_formatted.pickle - This is the original pickle file, unpacking it returns a dictionary of Course Codes and Names. Can unpickle the file like this: 
'''
import pickle as pk

data = pk.load(open('resources/code_map_formatted.pickle', 'rb'))
'''

* course_vectorizer.json - This file contains keywords and a corresponding int/id. Probably used for keyword search. 
* course_vectorizer.pickle - This is the original pickle file, unpacking it returns a sklearn.feature_extraction.text.TfidfVectorizer object [link](https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html). Can unpickle the file like this: 
'''
import pickle as pk

data = pk.load(open('resources/course_vectorizer.pickle', 'rb'))
'''

* course_vectors.npz - This is the original npz file, unpacking it returns a scipy.sparse.csr.csr_matrix object [link](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_matrix.html). Can unpickle the file like this: 
'''
import numpy as np

data = np.load('resources/course_vectors.npz', allow_pickle=True)
'''

* df_processed.csv - This file contains all the general information, should only really be used for reference, use the pickle file for actual purposes.  
    * Code
    * Name
    * Division
    * Course Description
    * Department
    * Pre-requisites
    * Course Level
    * UTSC Breadth
    * APSC Electives
    * Campus
    * Term
    * Activity
    * Last updated
    * Exclusion
    * UTM Distribution
    * Corequisite
    * Recommended Preparation
    * Arts and Science Breadth
    * Arts and Science Distribution
    * Later term course details
    * Course
    * FASEAvailable
    * MaybeRestricted
    * MajorsOutcomes
    * MinorsOutcomes
    * AIPreReqs
* df_processed.pickle - This is the original pickle file, unpacking it returns a pandas.Dataframe object [link](https://www.geeksforgeeks.org/python-pandas-dataframe/). Can unpickle the file like this: 
'''
import pickle as pk

data = pk.load(open('resources/df_processed.pickle', 'rb'))
'''

* fake_registration_data.csv - This is the original csv file, contains fake registration data. Unused on Education Pathways. 

* graph.pickle - This is the original pickle file, contains a graph that links courses together. For example - ECE361 is connected to ECE461 since 361 is a prerequisite. Unpacking this file returns a networkx.classes.digraph.DiGraph object [link](https://networkx.org/documentation/stable/tutorial.html). Can unpickle the file like this: 
'''
import pickle as pk

data = pk.load(open('resources/graph.pickle', 'rb'))
'''
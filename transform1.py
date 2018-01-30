#transformation of individual bank data to summary statistics
#edges are currently summed by standard deviation
import statistics
import math
from operator import itemgetter
import time as t

#gets unique values for a key
def get_unique_values(data,key):
    values=[]
    for row in data:
        values.append(row[key])
    uniqueValuesSet=set(values)
    uniqueValues=list(uniqueValuesSet)
    return uniqueValues

#gets time array with ordering
def get_periods(data):
    periods=[]
    for row in data:
        #compute order
        year = int(row['time'][0:4])
        if (int(row['time'][5])==0):
            month = int(row['time'][6])
        else:
            month = int(row['time'][5:6])
        idx = year*12+month
        #only add unique values
        if idx not in [period['idx'] for period in periods]:
            periods.append({"time": row['time'], "idx": idx})

    periodsSorted=sorted(periods, key=lambda k:k['idx'])
    result=[]
    for period in periodsSorted: result.append(period['time'])
    return result

#sets unique property for each country/sector combination
def set_sector_country_category(data):
    for row in data:
        row['category'] = row['source']+row['bank']+row['target']+row['edge_type']+row['time']
    return data
     
def eliminate_zero_values(data):
    dataClean = [row for row in data if (row['value']>0)]
    return dataClean

#cuts the dataset to something that can reasonably be visualised; eliminates very small portfolios
def cut_data(data,maxEdges,periods,categories):

    #check whether exceeds maximum length
    edges= len(data)/len(periods)
    if edges<maxEdges:
        return data,categories

    #cut for each period
    truncatedData=[]
    for time in periods:
            periodData = [row for row in data if row['time']==time]
            #smallest to largest
            periodSorted=sorted(periodData, key=itemgetter('value'), reverse=True)
            truncatedData=truncatedData+periodSorted[0:maxEdges]

    #update values
    data=truncatedData
    categories = [row['category'] for row in data]      
    return data,categories

#slice data into two levels
def slice_into_levels(data):
    slicedData=[]
    for row in data:
        slicedData.append({"source": row['source'], "target": row['bank'], "value": row['value'], "time": row['time'],
        "source_level": 0, "target_level": 1, "edge_type": row['edge_type']})
        slicedData.append({"source": row['bank'], "target": row['target'], "value": row['value'], "time": row['time'],
        "source_level": 1, "target_level": 2, "edge_type": row['edge_type']})
        #slicedData.append({"source": row['edge_type'], "target": row['target'], "value": row['value'], "time": row['time'],
        #"source_level": 2, "target_level": 3, "edge_type": row['edge_type']})
    return slicedData

##currently standard value of 10
def scale_sankey(data,periods):
    #get scaling factors
    scalingFactors=[]
    for period in periods:
        scalingFactors.append({"time": period, "value": 10})

    return scalingFactors   
import csv
import json

def numerical(x):
    try:
        float(x)
        return True
    except ValueError:
        return False

#def get_data():
#    data=[]
#    with open('data/derivatives.csv','r') as input:
#        reader = csv.DictReader(input)                   #automatically chooses the row heads as dictionary 
        #out=json.dumps( [ row for row in reader ])       #use out=json.dump(input) if no file output needed 
#        for row in reader:
#            data.append(row)
        #data = json.loads(reader,cls=Decoder)
#    return data

#def get_keys():
#    keys=[]
#    with open('data/derivatives.csv','r') as input:    
#        reader =csv.DictReader(input)
#        keys = reader.fieldnames
#        return keys

def decode_to_line(data,keys):
    #if there is a value column, rule out line chart
    if 'value' in keys:
        print ("Data not suitable for a line chart")
        return -1
    #if not, only accept numerical data
    for row in data:
        for key in keys:
            if numerical(row[key]):
                row[key] = float(row[key])
            else:
                print ("Data not suitable for a line chart")
                return -1
    return data

def transform_line_data(data,keys):
    transformed_data=[]
    xval= []
    for row in data:
        for key in keys:
            if key=='time':
                xval=row[key]
            else:
                yval=row[key]
                cat=key
                transformed_data.append({ "x": xval, "y": yval, "cat": cat})
            
    return transformed_data
        
def to_json(data):
    return json.dumps(data)

#data = get_data()
#keys = get_keys()
#data=decode(data,keys)
#data=transform_data(data,keys)
#data=to_json(data)
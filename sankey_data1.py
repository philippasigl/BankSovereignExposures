import csv
import json

#def get_data():
#    data=[]
#    with open('data/iv_funds.csv','r') as input:
#        reader = csv.DictReader(input)                   #automatically chooses the row heads as dictionary 
        #out=json.dumps( [ row for row in reader ])       #use out=json.dump(input) if no file output needed 
#        for row in reader:
#            data.append(row)
        #data = json.loads(reader,cls=Decoder)
#    return data

#def get_keys():
#    keys=[]
#    with open('data/iv_funds.csv','r') as input:    
#        reader =csv.DictReader(input)
#        keys = reader.fieldnames
#        return keys

def check_input(data,keys):
    #check suitable input
    if (not 'Amount' in keys) \
    or (not 'Period' in keys) \
    or (not 'Bank' in keys) \
    or (not 'target_country' in keys) \
    or (not 'NSA' in keys) \
    or (not 'Label' in keys):
        print ("Data missing value or time dimension")
        return -1

    for idx, row in enumerate(data):
        row['value'] = float(row['Amount'])
        if row['value']<0:
            del row
            print("deleted row ", idx, " since value <=0")
    return data

def multi_period_transform_sankey_data(data,keys):
    transformed_data=[]
    for row in data:
        transformed_data.append({ "source": row['originating_country'], "bank": row['Bank'], "edge_type": row['originating_country'], 
        "target": row['target_country'], "value": float(row['Amount']), "time": row['Period'], "source_level": 0, "target_level": 1})

    #keep for validation
    print("Validate data input")
    for idx, row in enumerate(transformed_data):
        print (row)
        if idx>10:
            break

    return transformed_data   

#def to_json(data):
#    return json.dumps(data)

#sankey_data = get_data()
#sankey_keys = get_keys()
#sankey_data=decode(sankey_data, sankey_keys)
#sankey_data=transform_data(sankey_data, sankey_keys)
#sankey_data=to_json(sankey_data)

from flask import Flask, render_template, request, redirect, url_for, flash, Response, jsonify
from werkzeug import secure_filename
import os
import csv
#import json
from line_data import *
from sankey_data1 import *
from transform1 import *
#to delete
import time as t

#app = Flask(__name__)
#app.secret_key = 'some_secret'


ALLOWED_EXTENSIONS = set(['csv'])
#app.config['UPLOAD_FOLDER'] = 'sovereign_exposures.csv'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#@app.route('/')
def upload_file():        
    print("started python")
    #if a post request has been made load, check whether csv and save in temp_data
    #file = request.files['file']
    #run checks
    #if file.filename == '':
    #    flash('No selected file')
    #    return redirect(request.url)
    #    #if not allowed_file(file.filename):
    #    flash('Not a csv file')
    #    return redirect(request.url)
    UPLOAD_FOLDER ='dummy_data' 
    filename = 'sovereign_exposures.csv'
    #file.save(os.path.join(UPLOAD_FOLDER, filename))
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    print(filepath)
    #save content in data
    data = []
    with open(filepath) as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)

    #save categories in keys 
    keys=[]
    with open(filepath) as file:    
        reader =csv.DictReader(file)
        keys = reader.fieldnames

    #try to create data for sankey chart (sankey_data=-1 if this fails)
    sankey_data=check_input(data,keys)
    if data != -1: 
        #turn into data suitable for a multi-period sankey
        sankey_data=multi_period_transform_sankey_data(data,keys)
        #get quarters (in order)
        time= get_periods(sankey_data)
        #create a unique category for every country/industry combination
        sankey_data=set_sector_country_category(sankey_data)
        #retrieve unique categories and banks so the data can be cut if necessary
        categories=get_unique_values(sankey_data,'category')
        banks=get_unique_values(sankey_data,'source')
            
        #cut data if it has more edges per screen than specified
        sankey_data, categories=cut_data(sankey_data,100,time,categories)
            
        #compute summary statistic by which the data will be mapped over all banks
        #sankey_data=collapse_banks_stddev(sankey_data,categories)
        #slice into nodes from banks to industry and industry to country
        sankey_data=slice_into_levels(sankey_data)
        #scale the sankey nodes
        scaling=scale_sankey(sankey_data,time)
        #take out any edges with value 0
        sankey_data=eliminate_zero_values(sankey_data)
        #turn data into json strings for passing on to javascript
        
        #sankeyJSON=[]
        #for item in sankey_data:
        #    sankeyJSON.append(to_json(item))
        #sankey_data=jsonify(sankey=sankeyJSON)
        #keys=to_json(keys)
        #time=to_json(time)
        #scaling=to_json(scaling)     
        
        #delete file in temp_data
        #os.remove(filepath)
       
        #redirect if no suitable data
        data = [sankey_data]
    if all(series == -1 for series in data):
        flash ('No suitable data found, please try another file')
        return redirect(request.url)
    
    #save produced data
    UPLOAD_FOLDER ='dummy_data' 
    filename = 'data.json'
    #file.save(os.path.join(UPLOAD_FOLDER, filename))
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    print(filepath)
    with open (filepath,'w') as file:
        json.dump(sankey_data,file)
    filename = 'time.json'
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    print(filepath)
    with open (filepath,'w') as file:
        json.dump(time,file)
    filename = 'keys.json'
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    print(filepath)
    with open (filepath,'w') as file:
        json.dump(keys,file)
    filename = 'scaling.json'
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    print(filepath)
    with open (filepath,'w') as file:
        json.dump(scaling,file)
    #return render_template('index.html', sankey_data=sankey_data, keys=keys, scaling=scaling, time=time)
    #return render_template('upload.html')

if __name__ == "__main__":
    upload_file()

#if __name__ == '__main__':
#    app.run(debug = True)
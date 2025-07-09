from flask import Flask, request, jsonify
import boto3
import uuid
import os

app = Flask(__name__)
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ.get('DYNAMO_TABLE', 'TodoTable'))

@app.route('/items', methods=['POST'])
def create_item():
    data = request.get_json()
    item_id = str(uuid.uuid4())
    data['id'] = item_id
    table.put_item(Item=data)
    return jsonify({'message': 'Item created', 'id': item_id}), 201

@app.route('/items', methods=['GET'])
def get_items():
    result = table.scan()
    return jsonify(result['Items'])

@app.route('/items/<string:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.get_json()
    data['id'] = item_id
    table.put_item(Item=data)
    return jsonify({'message': 'Item updated'})

@app.route('/items/<string:item_id>', methods=['DELETE'])
def delete_item(item_id):
    table.delete_item(Key={'id': item_id})
    return jsonify({'message': 'Item deleted'})

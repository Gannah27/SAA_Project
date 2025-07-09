from awsgi import response
from app import app

def handler(event, context):
    return response(app, event, context)

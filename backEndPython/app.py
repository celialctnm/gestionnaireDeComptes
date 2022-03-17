from tkinter import Image

from PIL import Image
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_marshmallow import Marshmallow
import pytesseract

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://celia:03092002@localhost/Depenses'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)


class Depenses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    magasin = db.Column(db.String(100))
    date = db.Column(db.Date)
    montant = db.Column(db.Integer)
    categorie = db.Column(db.String(100))

    def __init__(self, magasin, date, montant, categorie):
        self.magasin = magasin
        self.date = date
        self.montant = montant
        self.categorie = categorie


class DepensesSchema(ma.Schema):
    class Meta:
        fields = ('id', 'magasin', 'date', 'montant', 'categorie')


depenses_schema = DepensesSchema()
depenses_schema = DepensesSchema(many=True)

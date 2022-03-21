import random
from tkinter import Image

from PIL import Image
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_marshmallow import Marshmallow
import pytesseract
from sqlalchemy import create_engine, event, func
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://celia:03092002@localhost/Depenses'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

db2 = create_engine('mysql+mysqldb://celia:03092002@localhost/Depenses')


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


depense_schema = DepensesSchema()
depenses_schema = DepensesSchema(many=True)


@app.route('/get', methods=['GET'])
def get_articles():
    all_depenses = Depenses.query.all()
    results = depenses_schema.dump(all_depenses)
    return jsonify(results)


@app.route('/get/<id>/', methods=['GET'])
def post_details(id):
    depense = Depenses.query.get(id)
    return depense_schema.jsonify(depense)


@app.route('/add', methods=['POST'])
def add_article():
    magasin = request.json['magasin']
    date = request.json['date']
    montant = request.json['montant']
    categorie = request.json['categorie']

    depenses = Depenses(magasin, date, montant, categorie)
    db.session.add(depenses)
    db.session.commit()
    return depense_schema.jsonify(depenses)


@app.route('/update/<id>/', methods=['PUT'])
def update_article(id):
    depense = Depenses.query.get(id)
    magasin = request.json['magasin']
    date = request.json['date']
    montant = request.json['montant']
    categorie = request.json['categorie']

    depense.magasin = magasin
    depense.date = date
    depense.montant = montant
    depense.categorie = categorie
    db.session.commit()
    return depense_schema.jsonify(depense)


@app.route('/delete/<id>/', methods=['DELETE'])
def delete_article(id):
    depense = Depenses.query.get(id)
    db.session.delete(depense)
    db.session.commit()
    return depense_schema.jsonify(depense)


@app.route('/getImg', methods=['GET'])
def get_img():
    pytesseract.pytesseract.tesseract_cmd = r'/usr/local/Cellar/tesseract/5.0.1/bin/tesseract'
    imgText = pytesseract.image_to_string('image.png')
    # print(jsonify(imgText))
    # reponse["imgText"] = imgText
    return jsonify(imgText)


@app.route('/getMagasin', methods=['GET'])
def get_magasin():
    texteImage = get_img()
    premierCaractere = 0
    tabMotCle = ['TOTAL', 'ACHAT', 'Total', 'Achat']
    for i in range(len(tabMotCle)):
        if texteImage.find(tabMotCle[i]) != -1:
            premierCaractere = texteImage.find(tabMotCle[i])
    texteApresPremierTri = (texteImage[premierCaractere:premierCaractere + 30])

    return texteImage


@app.route("/image", methods=['GET', 'POST'])
def image():
    if request.method == "POST":
        # print(request.get_json())
        reponse = request.get_json()
        # print(reponse['byteImage'])
        print("-------------------------")
        import base64
        from PIL import Image
        from io import BytesIO
        im = Image.open(BytesIO(base64.b64decode(reponse['byteImage'])))
        im.save('image.png', 'PNG')
        return reponse


@app.route('/somme', methods=['GET'])
def somme():
    # Ajout des catégories dans un tableau
    tab = []
    depenses = Depenses.query.all()
    for depense in depenses:
        if depense.categorie not in tab:
            tab.append(depense.categorie)

    # Calculer les dépenses par catégorie
    somme = []
    dataDiagramme = []

    for index in range(len(tab)):
        somme.append(0)

    for ticket in depenses:
        for j in range(len(tab)):
            if ticket.categorie == tab[j]:
                somme[j] = somme[j] + ticket.montant

    for i in range(len(tab)):
        value = {
            "name": tab[i],
            "montant": somme[i],
            "color": "rgba(" + str(random.randint(180, 256)) + "," + str(random.randint(100, 256)) + ", " + str(random.randint(155, 257)) + "," + str(1) + ")",
            "legendFontColor": "#7F7F7F",
            "legendFontSize": 14
        }
        dataDiagramme.append(value)
    return jsonify(dataDiagramme)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=0, debug=True)

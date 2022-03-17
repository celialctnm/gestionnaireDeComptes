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
    #print(jsonify(imgText))
    #reponse["imgText"] = imgText
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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=0, debug=True)

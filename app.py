# app.py
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def clac_D(level, m_level):
    a = 13.0 / (13.0 + (level - m_level))
    b = 1.3
    return a if level >= m_level else b

def clac_C(str_, dex, _int, luk):
    return str_ / 2800.0 + dex / 3200.0 + _int / 7200.0 + luk / 3200.0

def clac_B(PDD, stdPDD, level, m_level, str_, dex, _int, luk):
    C = clac_C(str_, dex, _int, luk)
    D = clac_D(level, m_level)
    temp1 = C * 28.0 / 45.0 + (level * 7.0 / 13000.0)
    temp2 = D * (C + level / 550.0 + 0.28)
    return temp1 if PDD >= stdPDD else temp2

def clac_stdPdd(level, job):
    if job == 1:
        if level >= 8: return 19
        elif level >= 5: return 17
        else: return 7
    elif job == 2:
        if level >= 100: return 494
        elif level >= 95: return 446
        # ... include all other cases ...
        elif level >= 15: return 83
        else: return 54
    # ... include cases for other jobs ...
    return 999

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        job = int(request.form['job'])
        level = int(request.form['level'])
        str_ = int(request.form['str'])
        dex = int(request.form['dex'])
        _int = int(request.form['int'])
        luk = int(request.form['luk'])
        pdd = int(request.form['pdd'])
        m_level = int(request.form['m_level'])
        m_pad = int(request.form['m_pad'])

        A = clac_C(str_, dex, _int, luk) + 0.28
        stdPdd = clac_stdPdd(level, job)
        B = clac_B(pdd, stdPdd, level, m_level, str_, dex, _int, luk)

        damagemin = int((m_pad * m_pad * 0.008) - (pdd * A) - ((pdd - stdPdd) * B))
        damagemax = int((m_pad * m_pad * 0.0085) - (pdd * A) - ((pdd - stdPdd) * B))

        if damagemin < 1: damagemin = 1
        if (damagemax < 1): damagemax = 1

        return jsonify(damagemin=damagemin, damagemax=damagemax)
    except Exception as e:
        return jsonify(error=str(e)), 400

if __name__ == '__main__':
    app.run(debug=True)

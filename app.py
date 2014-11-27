import random
import os
import sys

from flask import Flask, render_template

app = Flask(__name__)


def get_tracks():
    if hasattr(get_tracks, "cache"):
        return get_tracks.cache
    path = os.path.join(os.path.dirname(__file__), "tracks")
    data = [line.split(",") for line in open(path).read().splitlines()]
    get_tracks.cache = [
        {"title": title.strip(),
         "band": band.strip(),
         "id": _id.strip()} for (title, band, _id) in data
    ]
    return get_tracks.cache


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/<path:path>')
def glitch(path):
    return render_template('glitch.html', keywords=path,
                           track=random.choice(get_tracks()))

if __name__ == '__main__':
    app.debug = sys.platform == "darwin"
    app.run()

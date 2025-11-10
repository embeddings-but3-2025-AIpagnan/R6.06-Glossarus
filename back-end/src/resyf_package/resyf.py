#!/usr/bin/env python3
"""Script d'exemple pour charger le modèle ReSyf et appeler les fonctions publiques.
"""
import os
import sys
from pathlib import Path

# Add package root to path so imports work when running the script
pkg_root = Path(__file__)
sys.path.insert(0, str(pkg_root))

from src.resyf_package.src import ReSyf




def load_resource():
    pkg_path = str(Path(__file__).resolve().parents[0])
    print('Package root:', pkg_path)
    lexicalRes = ReSyf.load(pkg_path)
    return lexicalRes


def getSynonyms(lexicalRes, word):
    poss = ['NC', 'VER', 'ADJ', 'ADV']
    syno = []

    for pos in poss:
        syn = ReSyf.get_synonyms(lexicalRes, word, pos)
        for sense_id, info in syn.items():
            for synonym in info.get('synonyms', []):
                syno.append(synonym.feat.get('word'))

    return syno



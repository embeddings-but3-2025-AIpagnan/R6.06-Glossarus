import logging

from fastapi import APIRouter, Request
from src.ia_contexte.ollamaLM import Ollama

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/synonym", tags=["synonyms"])

lm = Ollama()


@router.post("/getSynonym")
async def get_synonym(request: Request) -> dict[str, list[str]]:
    """Envoyer le mot a Resyf pour avoir une liste de synonymes.
    envoyer les mots du contexte et la liste de synonymes a l'ia pour choisir les meilleurs synonymes.
    récupérer dans une liste les synonymes ayant un taux de pertinence superieur a un certain seuil
    puis envoyer cette liste en reponse à l'application.
    """
    logger.info("Received request to get synonyms")

    req = await request.json()
    word = req.get("word")
    synonyms = req.get("synonyms")
    definition = req.get("definition")

    logger.debug("Input word: %s", word)
    logger.debug("Input synonyms: %s", synonyms)
    logger.debug("Input definition: %s", definition)

    suggestion_synonyms = lm.get_synonyms(word, definition, synonyms)
    logger.info("Generated synonyms: %s", suggestion_synonyms.split(","))

    return {"synonyms": suggestion_synonyms.split(",")}


"""
récupérer les mots ajouter par les utilisateurs
puis les envoyer a l'ia pour avoir leur proximité sémantique et leur attribuer leur couleur.
"""

import logging
import os
import subprocess
import sys
from pathlib import Path

import ollama

logger = logging.getLogger(__name__)


class Ollama:
    def __init__(self) -> None:
        logger.info("Initializing Ollama client")
        ollama_path = self.find_ollama_path()
        logger.info("Found Ollama at: %s", ollama_path)

        logger.info("Pulling model qwen3:0.6b")
        result = subprocess.run([ollama_path, "pull", "qwen3:0.6b"], check=True)  # noqa: S603
        if result.returncode == 0:
            logger.info("Model qwen3:0.6b pulled successfully")
        else:
            logger.error(
                "Failed to pull model qwen3:0.6b. Return code: %s",
                result.returncode,
            )

    def get_synonyms(self, word: str, definition: str, synonyms: list[str]) -> str:
        logger.info("Generating synonyms for word: '%s'", word)
        logger.debug("Definition: '%s', Existing synonyms: %s", definition, synonyms)

        # Règle de base : comment le modèle doit se comporter
        system_prompt = f"""
            I have the word "{word}" with the definition: "{definition}"
            Some synonyms of the word are: "{synonyms}"
            Give me a list of synonyms for the word "{word}" based on its definition except already given synonyms.
            Respond only with the list of synonyms  in CSV format, without determiners, sentences, or punctuation.
            Do not include any spaces between the synonyms, only commas.
            """

        logger.debug("Sending request to Ollama model")
        response = ollama.generate(
            model="qwen3:0.6b",
            prompt=system_prompt,
            options={"thinking": False, "num_predict": 300},
        )

        result = response["response"]
        logger.info("Successfully generated synonyms for word: '%s'", word)
        logger.debug("Generated synonyms: %s", result)

        return result

    @staticmethod
    def find_ollama_path() -> Path:
        # Définir les chemins candidats selon l'OS
        if sys.platform == "darwin":  # macOS
            candidates = [
                Path("/usr/local/bin/ollama"),  # classique
                Path("/opt/homebrew/bin/ollama"),  # Homebrew sur Apple Silicon
                Path("/usr/bin/ollama"),  # fallback mac
            ]
        elif sys.platform.startswith("linux"):  # Linux
            candidates = [
                Path("/usr/local/bin/ollama"),
                Path("/usr/bin/ollama"),
                Path("/snap/bin/ollama"),  # si installé via snap
            ]
        elif sys.platform.startswith("win"):  # Windows
            candidates = [
                Path(r"C:\Program Files\Ollama\ollama.exe"),
                Path(r"C:\Program Files (x86)\Ollama\ollama.exe"),
            ]
        else:
            candidates = []
        # Vérifier les chemins candidats
        for c in candidates:
            if c.exists():
                return c
        # Chercher dans le PATH
        exe_name = "ollama.exe" if sys.platform.startswith("win") else "ollama"
        for dir in os.environ.get("PATH", "").split(os.pathsep):
            candidate = Path(dir) / exe_name
            if candidate.exists():
                return candidate

        # Fallback final
        return Path(exe_name)

import subprocess
import ollama
import os
import sys

class miniLM:

    def __init__(self):
        print("client ollama se lance")
        print("client ollama lancé")
        print("pull model qwen3:0.6b")
        ollama_path = self.find_ollama_path()
        subprocess.run([ollama_path, "pull", "qwen3:0.6b"])
        print("model qwen3:0.6b pullé")


    def getSynonyms(self, word, definition, synonyms):
        # Règle de base : comment le modèle doit se comporter
        system_prompt = f"""
            I have the word "{word}" with the definition: "{definition}"
            Some synonyms of the word are: "{synonyms}"
            Give me a list of synonyms for the word "{word}" based on its definition except already given synonyms.
            Respond only with the list of synonyms  in CSV format, without determiners, sentences, or punctuation.
            Do not include any spaces between the synonyms, only commas.
            """

        response = ollama.generate(model="qwen3:0.6b", prompt = system_prompt,options={
            "thinking": False, 
            "num_predict": 300   
        })

        return response['response']


    @staticmethod
    def find_ollama_path():
        # Définir les chemins candidats selon l’OS
        if sys.platform == "darwin":  # macOS
            candidates = [
                "/usr/local/bin/ollama",       # classique
                "/opt/homebrew/bin/ollama",    # Homebrew sur Apple Silicon
                "/usr/bin/ollama",             # fallback mac
            ]
        elif sys.platform.startswith("linux"):  # Linux
            candidates = [
                "/usr/local/bin/ollama",
                "/usr/bin/ollama",
                "/snap/bin/ollama",            # si installé via snap
            ]
        elif sys.platform.startswith("win"):  # Windows
            candidates = [
                r"C:\Program Files\Ollama\ollama.exe",
                r"C:\Program Files (x86)\Ollama\ollama.exe",
            ]
        else:
            candidates = []
        # Vérifier les chemins candidats
        for c in candidates:
            if os.path.exists(c):
                return c
        # Chercher dans le PATH
        exe_name = "ollama.exe" if sys.platform.startswith("win") else "ollama"
        for dir in os.environ.get("PATH", "").split(os.pathsep):
            candidate = os.path.join(dir, exe_name)
            if os.path.exists(candidate):
                return candidate

        # Fallback final
        return exe_name
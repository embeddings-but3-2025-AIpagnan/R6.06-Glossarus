import ollama

class miniLM:


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

    
"""
AgroSmart API - AI Service
Integration with Google Gemini for product suggestions and chat assistant.
Uses the new google-genai SDK.
"""
import json
import random
from django.conf import settings
from google import genai

MOCK_CHAT = [
    "Pour les cereales dans le Gharb, je recommande NPK 15-15-15 a 200 kg/ha, suivi d'uree 46% au tallage.",
    "La periode optimale pour les engrais phosphates est avant le semis. Pour le Souss-Massa, Super Triple 45% est conseille.",
    "Pour les agrumes a Berkane, un programme annuel avec 3 apports d'azote, 1 de phosphore et 2 de potasse est optimal.",
    "Les engrais organiques ameliorent la structure du sol. Pour les sols argileux de Meknes, combinez avec du gypse.",
    "La fertigation permet 30% d'economie d'engrais. Je recommande des formules hydrosolubles NPK 20-20-20.",
]

MOCK_SUGGESTIONS = {
    "suggestions": [
        {"product_name": "Sulfate de Potassium K2SO4", "reason": "Renforce la resistance au stress hydrique."},
        {"product_name": "Acide Humique Granule", "reason": "Ameliore l'absorption des nutriments NPK."},
        {"product_name": "Oligo-elements Chelates", "reason": "Previent les carences en micronutriments."}
    ],
    "conseil_saison": "Privilegiez une fertilisation fractionnee pour optimiser l'absorption."
}


def _get_client():
    """Get a configured Gemini client."""
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return None
    return genai.Client(api_key=api_key)


def get_ai_suggestions(products_in_cart, region=None, season=None):
    """Get AI product suggestions via Gemini."""
    client = _get_client()
    if not client:
        return MOCK_SUGGESTIONS
    try:
        prompt = (
            f"Tu es un expert agronome specialise dans les fertilisants au Maroc. "
            f"Un commercial cree une commande avec: {products_in_cart}. "
            f"Region: {region or 'N/A'}. Saison: {season or 'N/A'}. "
            f"Suggere 3 produits complementaires en JSON UNIQUEMENT (sans markdown): "
            f'{{"suggestions":[{{"product_name":"...","reason":"..."}}],"conseil_saison":"..."}}'
        )
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite-preview",
            contents=prompt
        )
        text = response.text.strip()
        # Clean markdown wrappers if present
        if text.startswith('```'):
            text = text.split('\n', 1)[1]
        if text.endswith('```'):
            text = text.rsplit('\n', 1)[0]
        if text.startswith('json'):
            text = text[4:].strip()
        return json.loads(text)
    except Exception as e:
        print(f"[AgroSmart] Gemini suggest error: {e}")
        return MOCK_SUGGESTIONS


def get_chat_response(message, context=None):
    """Get AI chat response via Gemini."""
    client = _get_client()
    if not client:
        return {"response": random.choice(MOCK_CHAT), "source": "mock"}
    try:
        system = (
            "Tu es AgroBot, un assistant IA expert en agriculture et fertilisants au Maroc. "
            "Tu travailles pour AgroSmart, une plateforme de gestion des commandes de fertilisants. "
            "Tu aides les commerciaux avec des recommandations de fertilisants, dosages, "
            "calendriers d'application et conseils saisonniers. "
            "Reponds toujours en francais, de maniere professionnelle mais accessible. "
            "Sois concis mais precis."
        )
        ctx = f"\nContexte: {json.dumps(context, ensure_ascii=False)}" if context else ""
        full_prompt = f"{system}{ctx}\n\nMessage du commercial: {message}"

        response = client.models.generate_content(
            model="gemini-3.1-flash-lite-preview",
            contents=full_prompt
        )
        return {"response": response.text, "source": "gemini"}
    except Exception as e:
        print(f"[AgroSmart] Gemini chat error: {e}")
        return {"response": random.choice(MOCK_CHAT), "source": "mock"}

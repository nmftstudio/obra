# -*- coding: utf-8 -*-
"""
Obra del Día — backend FastAPI.

Sirve el frontend estático y una API mínima:
  GET  /api/obra-del-dia          -> obra elegida de forma determinística según la fecha
  POST /api/intento                -> valida un intento de adivinanza
  GET  /api/obra/{obra_id}/detalle -> ficha completa (se usa al terminar la partida)

No requiere base de datos: la "obra del día" se calcula con un hash de la fecha,
así que todos los jugadores en el mismo día ven la misma pintura (como Wordle).
"""

import hashlib
import re
import unicodedata
from datetime import date, datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from .data import PAINTINGS, commons_url

app = FastAPI(title="Obra del Día", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

MAX_ATTEMPTS = 6


def _normalize(text: str) -> str:
    """minúsculas, sin acentos, sin espacios/puntuación de más."""
    text = text.strip().lower()
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^a-z0-9\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _painting_for_date(d: date) -> dict:
    """Selección determinística: mismo día -> misma obra para todos."""
    seed = d.isoformat()
    digest = hashlib.sha256(seed.encode("utf-8")).hexdigest()
    index = int(digest, 16) % len(PAINTINGS)
    return PAINTINGS[index]


def _painting_by_id(painting_id: str) -> dict:
    for p in PAINTINGS:
        if p["id"] == painting_id:
            return p
    raise HTTPException(status_code=404, detail="Obra no encontrada")


def _public_payload(painting: dict, day: date) -> dict:
    """Lo que ve el cliente ANTES de adivinar: nada que delate la respuesta."""
    return {
        "id": painting["id"],
        "date": day.isoformat(),
        "image_url": commons_url(painting["file"]),
        "max_attempts": MAX_ATTEMPTS,
        "museum": painting["museum"],
    }


class GuessRequest(BaseModel):
    painting_id: str
    guess: str
    attempt_number: int


class GuessResponse(BaseModel):
    correct: bool
    close: bool
    reveal_step: int
    max_attempts: int
    message: str
    solved_title: Optional[str] = None
    solved_artist: Optional[str] = None
    solved_year: Optional[str] = None
    solved_museum: Optional[str] = None
    fun_fact: Optional[str] = None


@app.get("/api/obra-del-dia")
def obra_del_dia(fecha: Optional[str] = None):
    try:
        day = datetime.strptime(fecha, "%Y-%m-%d").date() if fecha else date.today()
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido, usá YYYY-MM-DD")
    painting = _painting_for_date(day)
    return _public_payload(painting, day)


@app.post("/api/intento", response_model=GuessResponse)
def intento(body: GuessRequest):
    painting = _painting_by_id(body.painting_id)
    guess_norm = _normalize(body.guess)

    title_norm = _normalize(painting["title"])
    alias_norms = [_normalize(a) for a in painting["aliases"]]
    artist_norms = [_normalize(a) for a in painting["artist_aliases"]]

    is_title_hit = guess_norm == title_norm or guess_norm in alias_norms
    is_artist_hit = guess_norm in artist_norms

    # "cerca": comparte al menos dos palabras significativas con el título
    guess_words = set(w for w in guess_norm.split() if len(w) > 3)
    title_words = set(w for w in title_norm.split() if len(w) > 3)
    is_close = len(guess_words & title_words) >= 1 and not is_title_hit

    attempt_number = max(1, min(body.attempt_number, MAX_ATTEMPTS))
    reveal_step = attempt_number  # cuántos "pasos" de desenfoque se levantan

    if is_title_hit or is_artist_hit:
        return GuessResponse(
            correct=True,
            close=False,
            reveal_step=MAX_ATTEMPTS,
            max_attempts=MAX_ATTEMPTS,
            message="¡Exacto!" if is_title_hit else "¡Correcto! (identificaste al autor)",
            solved_title=painting["title"],
            solved_artist=painting["artist"],
            solved_year=painting["year"],
            solved_museum=painting["museum"],
            fun_fact=painting["fun_fact"],
        )

    game_over = attempt_number >= MAX_ATTEMPTS
    return GuessResponse(
        correct=False,
        close=is_close,
        reveal_step=reveal_step,
        max_attempts=MAX_ATTEMPTS,
        message=(
            "Se acabaron los intentos"
            if game_over
            else ("Cerca, pero no es esa" if is_close else "No es esa obra, seguí intentando")
        ),
        solved_title=painting["title"] if game_over else None,
        solved_artist=painting["artist"] if game_over else None,
        solved_year=painting["year"] if game_over else None,
        solved_museum=painting["museum"] if game_over else None,
        fun_fact=painting["fun_fact"] if game_over else None,
    )


@app.get("/api/obra/{painting_id}/detalle")
def obra_detalle(painting_id: str):
    painting = _painting_by_id(painting_id)
    return {
        "title": painting["title"],
        "artist": painting["artist"],
        "year": painting["year"],
        "museum": painting["museum"],
        "fun_fact": painting["fun_fact"],
        "image_url": commons_url(painting["file"]),
    }


# --- Frontend estático -------------------------------------------------

app.mount("/assets", StaticFiles(directory=STATIC_DIR), name="assets")


@app.get("/")
def index():
    return FileResponse(STATIC_DIR / "index.html")
